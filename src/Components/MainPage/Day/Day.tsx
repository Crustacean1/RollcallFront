import './Day.css';
import { useState, useCallback } from 'react';
import { Loading, Loader } from '../../Common/Loading';
import { AttendanceDto, MealAttendance } from '../../../Api/ApiTypes';
import {
    MealContext,
    MealName,
    MealNames,
    DayDate,
    DayInfo,
    FetchFunction,
    MealUpdateFunction
} from './DayTypes';

interface DayProps {
    context: MealContext;

    targetId: number;
    date: DayDate;
    attendance: AttendanceDto;
}

function ReadAttendance(attendance: AttendanceDto): DayInfo {
    let info = {
        "breakfast": { ...attendance.breakfast, name: "breakfast" as MealName, loading: false },
        "dinner": { ...attendance.dinner, name: "dinner" as MealName, loading: false },
        "desert": { ...attendance.desert, name: "desert" as MealName, loading: false },
    };
    return info;
}

function CopyDayInfo(info: DayInfo): DayInfo {
    let newInfo = Object.assign({}, info);
    for (let name of MealNames) {
        newInfo[name] = Object.assign({}, info[name]);
    }
    return newInfo;
}

function StartLoadingMeals(info: DayInfo): DayInfo {
    let newInfo = CopyDayInfo(info);
    for (let meal of MealNames) {
        newInfo[meal].loading = true;
    }
    return newInfo;
}
function StartLoadingMeal(info: DayInfo, name: MealName): DayInfo {
    let newInfo = CopyDayInfo(info);
    newInfo[name].loading = true;
    return newInfo;
}

function SetUpdatedMeals(info: DayInfo, updates: MealAttendance[], updateFunc: MealUpdateFunction): DayInfo {
    let newInfo = CopyDayInfo(info);
    for (let meal of updates) {
        updateFunc(newInfo[meal.name as MealName], meal.present);
        newInfo[meal.name as MealName].loading = false;
    }
    return newInfo;
}

function Day(props: DayProps) {

    let [_info, setInfo] = useState<DayInfo>(ReadAttendance(props.attendance));

    const updateMealAttendance = useCallback((name: MealName, update: boolean, updateFunc: MealUpdateFunction) => {
        if (_info[name].loading === true) { return; }
        setInfo(s => StartLoadingMeal(s, name));

        let updateRequest = [{ name: name, present: update }];
        props.context.updateAttendance(props.targetId, props.date, updateRequest)
            .then(updateResponse => {
                setInfo(s => SetUpdatedMeals(s, updateResponse, updateFunc))
            })
    }, [_info, props.context, props.date, props.targetId]);

    const updateEntireAttendance = useCallback((update: boolean, updateFunc: MealUpdateFunction) => {
        let updateRequest: MealAttendance[] = [];
        for (let meal of MealNames) {
            if (_info[meal].loading !== false) { return; }
            updateRequest.push({ name: meal, present: update });
        }
        setInfo(s => StartLoadingMeals(s));

        props.context.updateAttendance(props.targetId, props.date, updateRequest)
            .then(updateResponse => {
                setInfo(s => SetUpdatedMeals(s, updateResponse, updateFunc));
            })
    }, [])

    let renderMeals = () => {
        let result: JSX.Element[] = [];

        for (let mealName of MealNames) {
            result.push(<props.context.mealFunc
                key={`${mealName}`}
                info={_info[mealName]}
                updateAttendance={(update: boolean, func: MealUpdateFunction) => updateMealAttendance(mealName, update, func)}
                date={props.date} />);
        }
        return result;
    }

    return <div className="calendar-day">
        {props.context.headerFunc({ date: props.date, info: _info, updateAttendance: updateEntireAttendance })}
        <div className="meal-container">
            {renderMeals()}
        </div>
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

type DayFunction = (props: { date: DayDate, attendance: AttendanceDto }) => JSX.Element;

function CreateDay(context: MealContext, targetId: number) {
    return (props: { date: DayDate, attendance: AttendanceDto }) =>
        Day({
            ...props,
            context: context,
            targetId: targetId,
        });
}

function CreateDayContext(context: MealContext, targetId: number, fetchFunc: FetchFunction) {
    return {
        dayFunc: CreateDay(context, targetId),
        fetchAttendance: fetchFunc
    }
}

export default CreateDayContext;

export { Day, DisabledDay, LoadingDay };

export type { DayFunction };