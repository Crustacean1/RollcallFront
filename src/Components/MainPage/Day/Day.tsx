import './Day.css';
import { useCallback, useRef, useEffect } from 'react';
import { Loading, Loader } from '../../Common/Loading';
import { AttendanceApi, AttendanceDto } from '../../../Api/ApiTypes';
import { MonthCount } from '../../MainPage/MainPage';

import useAttendanceInfo from './AttendanceInfoHook';
import {
    MealContext,
    DayContext,
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

function getMealChange(a: MealInfo, b: MealInfo) {
    return (a.masked ? 0 : a.present) - (b.masked ? 0 : b.present);
}

function Day(props: DayProps) {

    let [_info, updateMeal, toggleMeals, refreshMeals] = useAttendanceInfo(props.attendance,
        props.date,
        props.apiHandler,
        props.context.updateData);

    const prevInfoRef = useRef<DayInfo>(_info);

    useEffect(() => {
        props.countUpdate(a => {
            return {
                breakfast: a.breakfast + getMealChange(_info.breakfast, prevInfoRef.current.breakfast),
                dinner: a.dinner + getMealChange(_info.dinner, prevInfoRef.current.dinner),
                desert: a.desert + getMealChange(_info.desert, prevInfoRef.current.desert),
            }
        })
        prevInfoRef.current = _info;
    }, [_info])

    let renderMeals = useCallback(() => {
        let result: JSX.Element[] = [];

        for (let mealName of MealNames) {
            result.push(<props.context.mealFunc
                key={`${mealName}`}
                info={_info[mealName]}
                updateAttendance={(update: boolean) => updateMeal(mealName, update)}
                date={props.date} />);
        }
        return result;
    }, [_info, props])

    return <div className="calendar-day">
        {props.context.headerFunc({ date: props.date, info: _info, refreshAttendance: refreshMeals, updateAttendance: toggleMeals })}
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