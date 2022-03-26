import { MealInfo, MealLabels, DayDate, MealUpdateFunction } from '../DayTypes';
import { Loading, MiniLoader } from "../../../Common/Loading";


interface GroupMealProps {
    date: DayDate;
    info: MealInfo;
    updateAttendance: (value: boolean, func: MealUpdateFunction) => void;
}

function GroupMeal(props: GroupMealProps) {

    let id = `meal-${props.date.day}-${props.info.name}`;
    let checkbox = <input id={id} type="checkbox" checked={props.info.masked}
        disabled={props.info.loading}
        onChange={(e) => props.updateAttendance(e.currentTarget.checked,
            (info: MealInfo, update: boolean) => { info.masked = update })} />

    let mealStyle = { "color": props.info.masked ? "grey" : "black" };

    return <div className="day-meal">
        <Loading condition={!props.info.loading} target={checkbox} loader={<MiniLoader size="16px" />} />
        <label htmlFor={id}>{MealLabels[props.info.name]}</label>
        <span className="meal-count" style={mealStyle}>{props.info.present}</span>
    </div >
}


export default GroupMeal;
