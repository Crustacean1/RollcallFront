import { useState, useEffect, useCallback } from 'react';

import { Loading, Loader } from '../../../Common/Loading';
import Overlay from '../../../Common/Overlay';
import BasicTable from '../../../Common/Table';
import { childApi } from '../Child/ChildContext';

import apiHandler from '../../../../Api/Api';
import { MealDto, DailyChildSummaryDto } from '../../../../Api/ApiTypes';

import { MealNames, MealName, DayDate } from '../DayTypes';
import useAttendanceInfo from '../AttendanceInfoHook';

import './GroupList.css';

interface GroupListProps {
    date: DayDate;
    targetId: number;
    folded: boolean;

    exit: () => void;
}

interface ChildItemProps {
    data: DailyChildSummaryDto;
    date: DayDate;
}

function ChildItem(props: ChildItemProps) {

    let [_info, setMeal,] = useAttendanceInfo(
        props.data.meals,
        props.date,
        childApi(props.data.childId),
        (info, present) => { info.present = present ? 1 : 0 });
    useEffect(() => {
    }, [props.data])

    let renderInput = (mealName: MealName, info: MealDto) => <input type="checkbox" checked={info.present === 1} disabled={info.masked}
        onChange={e => { setMeal(mealName, e.currentTarget.checked); }} />

    return <tr><td>{props.data.name}</td>
        <td>{props.data.surname}</td>
        {
            MealNames.map(m => <td key={m}> <Loading condition={!_info[m].loading} target={renderInput(m, _info[m])} loader={<Loader size="20px" />} /></td>)
        }
    </tr>
}

function GroupList(props: GroupListProps) {
    let [_children, setChildren] = useState<DailyChildSummaryDto[]>([]);
    let [_loading, setLoading] = useState(true);

    useEffect(() => {
        let isActive = true;
        if (props.folded) { return; }
        apiHandler.fetchDailySummary(props.targetId, props.date.year, props.date.month, props.date.day)
            .then((response) => {
                if (!isActive) { return; }
                setChildren(response);
                setLoading(false);
            })
        return () => { setChildren(children => []); setLoading(true); isActive = false; }
    }, [props.folded, props.date, props.targetId]);

    let renderFunc = useCallback((source: DailyChildSummaryDto) => ChildItem({
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