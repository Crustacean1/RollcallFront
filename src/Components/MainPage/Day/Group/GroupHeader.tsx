import './GroupMeal.css';
import { useState } from 'react';
import { MealDate } from '../../../../Api/ApiTypes';
import {
    DayMealState,
    MealState,
    MealNames,
    MealUpdateFunction
} from '../DayTypes';

import GroupOverlay from '../GroupList/GroupOverlay';
import Button from '../../../Common/Button';

interface GroupDayHeaderProps {
    info: DayMealState;
    date: MealDate;
    targetId: number;
    updateAttendance: (update: boolean, func: MealUpdateFunction) => void;
    refreshAttendance: () => void;
}

function GroupDayHeader(props: GroupDayHeaderProps) {
    let checked = false;
    let [_active, setActive] = useState(false);

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
        setActive(false);
    }

    return <h4>
        <Button text="..." onPress={() => setActive(true)} />
        <label htmlFor={headerId}>{props.date.day}</label>
        {checkbox}
        <GroupOverlay date={props.date} targetId={props.targetId} active={_active} exit={onExit} />
    </h4>
}

export default GroupDayHeader;
export type { GroupDayHeaderProps };