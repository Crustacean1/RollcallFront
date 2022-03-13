import './Day.css';
import { useReducer, useState, useEffect } from 'react';
import { Loading, Loader } from '../../Common/Loading';
import { MealDto } from '../../../Api/ApiTypes';
import { DayState, DayProps, MealProps } from './DayTypes';



type MealName = "breakfast" | "dinner" | "desert";

function UpdateMeal(state: DayState, action: { type: string, prop: DayState, name: MealName, value: MealDto }) {
    switch (action.type) {
        case 'update':
            let newState = Object.assign({}, state);
            newState[action.name] = action.value;
            return newState
        case 'replace':
            return action.prop;
        default:
            throw new Error();
    }
}

function Day(props: DayProps) {
    let [_attendance, setAttendance] = useReducer(UpdateMeal, props.attendance);

    let populateMeals = () => {
        const mealNames: MealName[] = ["breakfast", "dinner", "desert"];

        let result: JSX.Element[] = [];

        for (let name of mealNames) {
            let currentMeal = _attendance[name];
            result.push(<props.renderMeal
                key={`${name}`}
                attendance={currentMeal}
                setAttendance={(a => setAttendance({ type: 'update', prop: props.attendance, 'name': name, 'value': a }))}
                date={props.date}
                name={name}
                target={props.targetId} />);
        }
        return result;
    }
    return <div className="calendar-day">
        <h4><input type="checkbox" checked={false} readOnly={true} />{props.date.day}</h4>
        {populateMeals()}
    </div>
}

function LoadingDay(props: {}) {
    return <div className="calendar-day">
        <Loading condition={false} target={<div></div>} loader={<Loader size="5vw" />} />
    </div>
}
function DisabledDay(props: {}) {
    return <div className="calendar-day disabled-day">
    </div>
}

type DayFunction = (props: DayProps) => JSX.Element;
type MealFunction = (props: MealProps) => JSX.Element;

function CreateDay(dayFunc: DayFunction, mealFunc: MealFunction, props: DayProps) {
    return dayFunc({ ...props, renderMeal: mealFunc });
}

export default Day;

export { DisabledDay, LoadingDay };