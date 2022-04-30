import { useState, useEffect, useCallback } from 'react';

import { Loading, Loader } from '../../../Common/Loading';
import Overlay from '../../../Common/Overlay';
import BasicTable from '../../../Common/Table';

import apiHandler from '../../../../Api/Api';
import { MealDto, MealDate, AttendanceCountDto, ChildAttendanceDto, AttendanceDto } from '../../../../Api/ApiTypes';

import { MealNames, MealName } from '../DayTypes';
import useAttendanceInfo from '../AttendanceInfoHook';

import { useSession } from '../../../Common/Session';

import './GroupList.css';

interface GroupListProps {
    date: MealDate;
    targetId: number;
    folded: boolean;

    exit: () => void;
}

interface DailyChildSummary {
    childId: number;
    name: string;
    surname: string;
    summary: AttendanceDto;
}

interface ChildItemProps {
    data: DailyChildSummary;
    date: MealDate;
}

function ChildItem(props: ChildItemProps) {

    const _session = useSession();

    const fetchDaysMeals = () => {
        return apiHandler.get<AttendanceDto>(_session.token, "attendance", "child", "daily",
            ...apiHandler.toStringArray(props.data.childId,
                props.date.year,
                props.date.month,
                props.date.day))
    }
    const updateDayMeals = (attendance: ChildAttendanceDto) => {
        return apiHandler.post<ChildAttendanceDto>(_session.token, "attendance", "child", ...apiHandler.toStringArray(props.data.childId,
            props.date.year, props.date.month, props.date.day));
    }

    const [_info, setMeal, updateMeal,] = useAttendanceInfo(
        props.data.summary,
        { getDailyAttendance: fetchDaysMeals, updateAttendance: updateDayMeals },
        (delta: AttendanceCountDto) => { });

    const renderInput = (mealName: MealName, info: MealDto) => <input type="checkbox" checked={info.present === 1} disabled={info.masked}
        onChange={e => { updateMeal([mealName], e.currentTarget.checked); }} />

    return <tr><td>{props.data.name}</td>
        <td>{props.data.surname}</td>
        {
            MealNames.map(m => <td key={m}> <Loading condition={!_info[m].loading} target={renderInput(m, _info[m])} loader={<Loader size="20px" />} /></td>)
        }
    </tr>
}

function GroupList(props: GroupListProps) {
    const [_children, setChildren] = useState<DailyChildSummary[]>([]);
    const [_loading, setLoading] = useState(true);

    const _session = useSession();

    useEffect(() => {
        let isActive = true;
        if (props.folded) { return; }
        apiHandler.get<DailyChildSummary[]>(_session.token, "attendance", "group", "daily", ...apiHandler.toStringArray(props.date.year, props.date.month, props.date.day))
            .then((response) => {
                if (!isActive) { return; }
                setChildren(response);
                setLoading(false);
            }, e => {
                alert("In group list: " + e);
                setLoading(false)
            })

        return () => { setChildren(children => []); setLoading(true); isActive = false; }
    }, [props.folded, props.date, props.targetId]);

    let renderFunc = useCallback((source: DailyChildSummary) => ChildItem({
        data: source,
        date: props.date,
    }), [props.date]);

    let childList = <BasicTable source={_children} loading={_loading} displayFunc={renderFunc}
        class="group-list-table" height="50vh" headers={[{ "name": "name", "title": "Imię" },
        { "name": "surname", "title": "Nazwisko" },
        { "name": "breakfast", "title": "Śniadanie" },
        { "name": "dinner", "title": "Obiad" },
        { "name": "desert", "title": "Deser" }
        ]} />

    let content = (<div className="group-list-container" onClick={e => e.stopPropagation()}>
        <h2>{props.date.day}-{props.date.month}-{props.date.year}</h2>
        <Loading loader={<Loader size="200px" />} condition={!_loading} target={childList} />
    </div>);
    return props.folded ? <></> : <Overlay class="" target={content} exit={props.exit} />
}

export default GroupList;