import './ChildMeal.css';
import { Loading, MiniLoader } from '../../../Common/Loading';

import {
    MealLabels,
    DayDate,
    MealInfo,
    MealUpdateFunction
} from '../DayTypes';

interface ChildMealProps {
    date: DayDate;
    info: MealInfo;
    updateAttendance: (update: boolean, func: MealUpdateFunction) => void;
}

function ChildMeal(props: ChildMealProps) {

    let id = `meal-${props.date.day}-${props.info.name}`;

    let isChecked = props.info.present === 1 && props.info.masked === false
    let isDisabled = props.info.masked === true;

    let checkbox = <input id={id} type="checkbox"
        disabled={isDisabled}
        checked={isChecked}
        onChange={(e) => props.updateAttendance(e.currentTarget.checked,
            (info: MealInfo, update: boolean) => { info.present = update ? 1 : 0 })} />

    return <div className="day-meal">
        <Loading condition={!props.info.loading} target={checkbox} loader={<MiniLoader size="16px" />} />
        <label htmlFor={id}>{MealLabels[props.info.name]}</label>
    </div>
}

export default ChildMeal;