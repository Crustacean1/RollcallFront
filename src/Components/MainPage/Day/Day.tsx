import './Day.css';
import { useCallback, useRef, useEffect } from 'react';
import { Loading, Loader } from '../../Common/Loading';
import { AttendanceApi, AttendanceDto, MealAttendance } from '../../../Api/ApiTypes';
import { MonthCount } from '../../MainPage/MainPage';

import useAttendanceInfo from './AttendanceInfoHook';
import {
    MealContext,
    DayContext,
    MealName,
    MealNames,
    DayDate,
    DayInfo,
    MealInfo,
} from './DayTypes';

type MonthCountUpdate = (update: (arg: MonthCount) => MonthCount) => void;

interface DayProps {
    context: MealContext;
    countUpdate: MonthCountUpdate;
    apiHandler: AttendanceApi;
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

function getMealChange(a: MealInfo, b: MealInfo) {
    return (a.masked ? 0 : a.present) - (b.masked ? 0 : b.present);
}

function Day(props: DayProps) {

    let callApiUpdate = useCallback((meals: MealAttendance[]) => props.apiHandler.updateAttendance(props.targetId, meals, props.date),
        [props.apiHandler, props.targetId, props.date]);

    let [_info, updateMeal, updateMeals] = useAttendanceInfo(ReadAttendance(props.attendance), callApiUpdate, props.context.updateData);

    const prevInfoRef = useRef<DayInfo>(_info);

    useEffect(() => {
        let isActive = true;
        props.countUpdate(a => {
            return {
                breakfast: a.breakfast + getMealChange(_info.breakfast, prevInfoRef.current.breakfast),
                dinner: a.dinner + getMealChange(_info.dinner, prevInfoRef.current.dinner),
                desert: a.desert + getMealChange(_info.desert, prevInfoRef.current.desert),
            }
        })
        prevInfoRef.current = _info;
        return () => { isActive = false; }

    }, [_info])

    let renderMeals = () => {
        let result: JSX.Element[] = [];

        for (let mealName of MealNames) {
            result.push(<props.context.mealFunc
                key={`${mealName}`}
                info={_info[mealName]}
                updateAttendance={(update: boolean) => updateMeal(mealName, update)}
                date={props.date} />);
        }
        return result;
    }

    return <div className="calendar-day">
        {props.context.headerFunc({ date: props.date, info: _info, updateAttendance: updateMeals })}
        <div className="meal-container">
            {renderMeals()}
        </div>
    </div>
}

function LoadingDay() {
    return <div className="calendar-day">
        <Loading condition={false} target={<div></div>} loader={<Loader size="5vw" />} />
    </div>
}

function DisabledDay(props: { date: Date }) {
    return <div className="calendar-day disabled-day">
        <h4>{props.date.getDate()}</h4>
    </div>
}

type DayFunction = (props: { date: DayDate, attendance: AttendanceDto }) => JSX.Element;

function CreateDay(context: MealContext, apiHandler: AttendanceApi, targetId: number, updateFunc: MonthCountUpdate) {
    return (props: { date: DayDate, attendance: AttendanceDto }) =>
        Day({
            ...props,
            apiHandler: apiHandler,
            countUpdate: updateFunc,
            context: context,
            targetId: targetId,
        });
}

function CreateDayContext(context: MealContext, targetId: number, apiHandler: AttendanceApi, updateFunc: MonthCountUpdate): DayContext {
    return {
        dayFunc: CreateDay(context, apiHandler, targetId, updateFunc),
        apiHandler: apiHandler
    }
}

export default CreateDayContext;

export { Day, DisabledDay, LoadingDay };

export type { MonthCountUpdate, DayFunction };