import { useState, useEffect, useCallback } from 'react';

import { Loading, Loader } from '../../../Common/Loading';
import Overlay from '../../../Common/Overlay';
import BasicTable from '../../../Common/Table';
import { ChildSummaryData } from '../../../Common/Types'

import apiHandler from '../../../../Api/Api';
import { AttendanceApi, ChildAttendanceSummary, MealAttendance } from '../../../../Api/ApiTypes';

import { MealNames, MealName, DayDate } from '../DayTypes';
import useAttendanceInfo from '../AttendanceInfoHook';

import './GroupList.css';

interface GroupListProps {
    date: DayDate;
    targetId: number;
    folded: boolean;
    apiHandler: AttendanceApi;

    exit: () => void;
}

interface ChildItemProps {
    apiHandler: AttendanceApi;
    data: ChildSummaryData;
    date: DayDate;
}

function ChildItem(props: ChildItemProps) {

    let updateFunction = useCallback((update: MealAttendance[]) => props.apiHandler.updateAttendance(props.data.id, update, props.date), [props.data.id, props.date])

    let [_info, setMeal,] = useAttendanceInfo({
        breakfast: { name: "breakfast", loading: false, present: props.data.breakfast, masked: false },
        dinner: { name: "dinner", loading: false, present: props.data.dinner, masked: false },
        desert: { name: "desert", loading: false, present: props.data.desert, masked: false }
    }, updateFunction, (info, present) => { info.present = present ? 1 : 0 });

    let renderInput = (mealName: MealName, present: number) => <input type="checkbox" checked={present === 1}
        onChange={e => { setMeal(mealName, e.currentTarget.checked); }} />

    return <tr><td>{props.data.name}</td>
        <td>{props.data.surname}</td>
        {
            MealNames.map(m => <td> <Loading condition={!_info[m].loading} target={renderInput(m, _info[m].present)} loader={<Loader size="20px" />} /></td>)
        }
    </tr>
}

function mapChildrenDto(summary: ChildAttendanceSummary): ChildSummaryData {
    return {
        name: summary.name,
        surname: summary.surname,
        id: summary.childId,
        groupName: summary.groupName,

        breakfast: summary.summary.breakfast,
        dinner: summary.summary.dinner,
        desert: summary.summary.desert,
    };
}

function GroupList(props: GroupListProps) {
    let [_children, setChildren] = useState<ChildSummaryData[]>([]);
    let [_loading, setLoading] = useState(true);

    useEffect(() => {
        let isActive = true;
        if (props.folded) { return; }
        props.apiHandler.fetchDailySummary(props.targetId, props.date.year, props.date.month, props.date.day)
            .then((response) => {
                if (!isActive) { return; }
                setChildren(response.map(r => mapChildrenDto(r)));
                setLoading(false);
            })
        return () => { isActive = false; }
    }, [props.folded, props.date, props.targetId]);

    let renderFunc = (source: ChildSummaryData) => ChildItem({
        data: source,
        date: props.date,
        apiHandler: props.apiHandler
    });

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