import { MealInfo, MealLabels, DayDate } from '../DayTypes';
import { Loading, MiniLoader } from "../../../Common/Loading";


interface GroupMealProps {
    date: DayDate;
    info: MealInfo;
    updateAttendance: (value: boolean) => void;
}

function GroupMeal(props: GroupMealProps) {

    let id = `meal-${props.date.day}-${props.info.name}`;
    let checkbox = <input id={id} type="checkbox" checked={props.info.masked}
        disabled={props.info.loading}
        onChange={(e) => props.updateAttendance(e.currentTarget.checked)} />

    let mealStyle = { "color": props.info.masked ? "red" : "white" };

    return <div className="day-meal">
        <Loading condition={!props.info.loading} target={checkbox} loader={<MiniLoader size="16px" />} />
        <label htmlFor={id}>{MealLabels[props.info.name]}</label>
        <span className="meal-count" style={mealStyle}>{props.info.present}</span>
    </div >
}


export default GroupMeal;
