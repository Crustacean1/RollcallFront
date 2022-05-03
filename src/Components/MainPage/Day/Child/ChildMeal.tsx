import './ChildMeal.css';
import { Loading, MiniLoader } from '../../../Common/Loading';
import { MealDate, } from '../../../../Api/ApiTypes';

import { MealLabels, MealName } from '../DayTypes';
import { MealState } from '../DayTypes';

interface ChildMealProps {
    date: MealDate;
    mealState: MealState;
    updateAttendance: (update: boolean) => void;
}

function ChildMeal({ date, mealState, updateAttendance }: ChildMealProps) {

    const id = `meal-${date.day}-${mealState.name}`;

    const isChecked = mealState.present === 1;
    const isDisabled = mealState.masked === true || mealState.loading;

    const style = { "color": mealState.masked ? "red" : "white" };

    const checkbox = <input id={id} type="checkbox"
        disabled={isDisabled}
        checked={isChecked}
        onChange={(e) => updateAttendance(e.currentTarget.checked)} />

    return <div className="day-meal">
        <Loading condition={!mealState.loading} target={checkbox} loader={<MiniLoader size="16px" />} />
        <label style={style} htmlFor={id}>{MealLabels[mealState.name as MealName]}</label>
    </div>
}

export default ChildMeal;
