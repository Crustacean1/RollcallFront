import './Group.css';
import { useState } from 'react';
import { AttendanceApi } from '../../../../Api/ApiTypes';

import {
    DayInfo,
    MealInfo,
    DayDate,
    MealNames,
    MealUpdateFunction
} from '../DayTypes';

import GroupList from '../GroupList/GroupList';

interface GroupDayHeaderProps {
    info: DayInfo;
    date: DayDate;
    targetId: number;
    apiHandler: AttendanceApi,
    updateAttendance: (update: boolean, func: MealUpdateFunction) => void;
}

function GroupDayHeader(props: GroupDayHeaderProps) {
    let checked = false;
    let [_folded, setFolded] = useState(true);

    for (let meal of MealNames) {
        if (props.info[meal].masked) {
            checked = true;
            break;
        }
    }

    let headerId = `header-${props.date.day}`;
    let checkbox = <input id={headerId} type="checkbox" checked={checked} onChange={e =>
        props.updateAttendance(e.currentTarget.checked, (info: MealInfo, update: boolean) => { info.masked = update })} />

    return <h4>
        <span className="group-list-button" onClick={e => setFolded(false)}>...</span>
        <label htmlFor={headerId}>{props.date.day}</label>
        {checkbox}
        <GroupList date={props.date} targetId={props.targetId} apiHandler={props.apiHandler} folded={_folded} exit={() => setFolded(true)} />
    </h4>
}

export default GroupDayHeader;
export type { GroupDayHeaderProps };