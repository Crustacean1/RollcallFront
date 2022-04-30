import {MealDate} from '../../../../Api/ApiTypes';
import { MealState, MealLabels } from '../DayTypes';
import { Loading, MiniLoader } from "../../../Common/Loading";


interface GroupMealProps {
    date: MealDate;
    state: MealState;
    updateAttendance: (value: boolean) => void;
}

function GroupMeal(props: GroupMealProps) {

    let id = `meal-${props.date.day}-${props.state.name}`;
    let checkbox = <input id={id} type="checkbox" checked={props.state.masked}
        disabled={props.state.loading}
        onChange={(e) => props.updateAttendance(e.currentTarget.checked)} />

    let mealStyle = { "color": props.state.masked ? "red" : "white" };

    return <div className="day-meal">
        <Loading condition={!props.state.loading} target={checkbox} loader={<MiniLoader size="16px" />} />
        <label htmlFor={id}>{MealLabels[props.state.name]}</label>
        <span className="meal-count" style={mealStyle}>{props.state.present}</span>
    </div >
}


export default GroupMeal;
