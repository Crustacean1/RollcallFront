import './Group.css';
import {
    DayInfo,
    MealInfo,
    DayDate,
    MealNames,
    MealUpdateFunction
} from '../DayTypes';

interface GroupDayHeaderProps {
    info: DayInfo;
    date: DayDate;
    updateAttendance: (update: boolean, func: MealUpdateFunction) => void;
}

function GroupDayHeader(props: GroupDayHeaderProps) {
    let checked = false;

    for (let meal of MealNames) {
        if (props.info[meal].masked) {
            checked = true;
            break;
        }
    }

    let headerId = `header-${props.date.day}`;
    let checkbox = <input id={headerId} type="checkbox" checked={checked} onChange={e =>
        props.updateAttendance(e.currentTarget.checked, (info: MealInfo, update: boolean) => { info.masked = update })} />
    return <h4>{checkbox}<label htmlFor={headerId}>{props.date.day}</label></h4>
}

export default GroupDayHeader;