import {  useCallback } from 'react';

import { Loading, Loader } from '../../../Common/Loading';
import BasicTable from '../../../Common/Table';

import apiHandler from '../../../../Api/Api';
import { MealDto, MealDate, AttendanceCountDto, ChildAttendanceDto, AttendanceDto } from '../../../../Api/ApiTypes';

import { MealNames, MealName } from '../DayTypes';
import useAttendanceInfo from '../AttendanceInfoHook';

import { useSession } from '../../../Common/Session';
import { DailyGroupSummary, ChildSummary } from './GroupOverlay';

import './GroupList.css';
interface ChildItemProps {
    summary: ChildSummary;
    date: MealDate;
}


function ChildItem({ summary, date }: ChildItemProps) {

    const _session = useSession();

    const fetchDaysMeals = useCallback(() => {
        return apiHandler.get<AttendanceDto>(_session.token, "attendance", "child", "daily",
            ...apiHandler.toStringArray(summary.childId,
                date.year,
                date.month,
                date.day))
    }, [date, _session, summary])

    const updateDayMeals = useCallback((attendance: ChildAttendanceDto) => {
        return apiHandler.post<ChildAttendanceDto>(attendance, _session.token, "attendance", "child", ...apiHandler.toStringArray(summary.childId,
            date.year, date.month, date.day));
    }, [_session, date, summary])

    const [_info, updateMeal] = useAttendanceInfo(
        summary.meals,
        { getDailyAttendance: fetchDaysMeals, updateAttendance: updateDayMeals },
        (delta: AttendanceCountDto) => { });

    const renderInput = (mealName: MealName, info: MealDto) => <input type="checkbox" checked={info.present === 1} disabled={info.masked}
        onChange={e => { updateMeal([mealName], e.currentTarget.checked); }} />

    return <tr><td>{summary.name}</td>

        <td>{summary.surname}</td>
        {
            MealNames.map(m => <td key={m}> <Loading condition={!_info[m].loading} target={renderInput(m, _info[m])} loader={<Loader size="20px" />} /></td>)
        }
    </tr>
}

interface GroupListProps {
    date: MealDate;
    summary: DailyGroupSummary;
    exit: () => void;
}

function GroupList({ date, summary, exit }: GroupListProps) {

    const renderFunc = useCallback((source: ChildSummary) => ChildItem({
        summary: source,
        date: date,
    }), [date]);

    let childList = <BasicTable source={summary.children} loading={false} displayFunc={renderFunc}
        class="group-list-table" height="50vh" headers={[{ "name": "name", "title": "Imię" },
        { "name": "surname", "title": "Nazwisko" },
        { "name": "", "title": "Śniadanie" },
        { "name": "", "title": "Obiad" },
        { "name": "", "title": "Deser" },
        ]} />

    let content = (<div className="group-list-container" onClick={e => e.stopPropagation()}>
        <h2>{date.day}-{date.month}-{date.year}</h2>
        <h3>{summary.groupName}</h3>
        {childList}
    </div>);
    return content;
}

export default GroupList;