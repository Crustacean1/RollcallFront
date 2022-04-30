import './GroupMeal.css';
import { useState } from 'react';
import { MealDate } from '../../../../Api/ApiTypes';
import {
    DayMealState,
    MealState,
    MealNames,
    MealUpdateFunction
} from '../DayTypes';

import GroupList from '../GroupList/GroupList';

interface GroupDayHeaderProps {
    info: DayMealState;
    date: MealDate;
    targetId: number;
    updateAttendance: (update: boolean, func: MealUpdateFunction) => void;
    refreshAttendance: () => void;
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
        props.updateAttendance(e.currentTarget.checked, (info: MealState, update: boolean) => { info.masked = update })} />

    let onExit = () => {
        props.refreshAttendance();
        setFolded(true);
    }

    return <h4>
        <span className="group-list-button" onClick={e => setFolded(false)}>...</span>
        <label htmlFor={headerId}>{props.date.day}</label>
        {checkbox}
        <GroupList date={props.date} targetId={props.targetId} folded={_folded} exit={onExit} />
    </h4>
}

export default GroupDayHeader;
export type { GroupDayHeaderProps };