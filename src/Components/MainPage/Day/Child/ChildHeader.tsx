import './ChildMeal.css';
import {
    DayInfo,
    DayDate,
    MealInfo,
    MealNames,
    MealUpdateFunction
} from '../DayTypes';

interface ChildDayHeaderProps {
    info: DayInfo;
    date: DayDate;

    updateAttendance: (update: boolean, func: MealUpdateFunction) => void;
}

function ChildDayHeader(props: ChildDayHeaderProps) {

    let isChecked = false;
    let isDisabled = false;

    for (let meal of MealNames) {
        if (props.info[meal].present === 1) {
            isChecked = true;
        }
        if (props.info[meal].masked === true) {
            isDisabled = true;
        }
    }
    let headerId = `child-header-${props.date.day}`;
    let checkbox = <input type="checkbox" id={headerId} disabled={isDisabled} checked={isChecked} onChange={(e) => {
        props.updateAttendance(e.currentTarget.checked,
            (info: MealInfo, update: boolean) => { info.present = update ? 1 : 0 })
    }} />
    return <h4>{checkbox}<label htmlFor={headerId}>{props.date.day}</label></h4>
}

export default ChildDayHeader;