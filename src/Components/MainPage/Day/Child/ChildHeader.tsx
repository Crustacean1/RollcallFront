import './ChildMeal.css';
import { MealDate } from '../../../../Api/ApiTypes';
import { DayMealState } from '../DayTypes';


interface ChildDayHeaderProps {
    meals: DayMealState;
    date: MealDate;

    updateAttendance: (u: boolean) => void;
}

function ChildDayHeader(props: ChildDayHeaderProps) {
    let toggled: boolean = false;
    let disabled: boolean = false;
    for (let meal in props.meals) {
        if (props.meals[meal].masked || props.meals[meal].loading) {
            disabled = true;
        }
        if (props.meals[meal].present === 1) {
            toggled = true;
        }
    }
    let headerId = `child-header-${props.date.day}`;
    let checkbox = <input type="checkbox" id={headerId} disabled={disabled} checked={toggled} onChange={(e) => {
        props.updateAttendance(!toggled)
    }} />
    return <h4>{checkbox}<label htmlFor={headerId}>{props.date.day}</label></h4>
}

export default ChildDayHeader;