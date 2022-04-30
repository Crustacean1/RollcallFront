type NonImplemented = void;
export type { NonImplemented };

/*import './Day.css';
import { useCallback, useRef, useEffect } from 'react';
import { Loading, Loader } from '../../Common/Loading';
import { AttendanceApi, AttendanceDto } from '../../../Api/ApiTypes';
import { MonthCount } from '../../MainPage/MainPage';
import GroupMeal from '../Day/Group/GroupMeal';
import GroupDayHeader from '../Day/Group/GroupHeader';

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

interface GroupDayProps {
    countUpdate: MonthCountUpdate;
    apiHandler: AttendanceApi;
    date: DayDate;
    attendance: AttendanceDto;
}

function getMealChange(a: MealInfo, b: MealInfo) {
    return (a.masked ? 0 : a.present) - (b.masked ? 0 : b.present);
}

function GroupDay(props: GroupDayProps) {

    let [_info, updateMeal, toggleMeals, refreshMeals] = useAttendanceInfo(props.attendance,
        props.date,
        props.apiHandler,
        (info: MealInfo, update: boolean) => info.masked = update);

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
            result.push(<GroupMeal
                key={`${mealName}`}
                info={_info[mealName]}
                updateAttendance={(update: boolean) => updateMeal(mealName, update)}
                date={props.date} />);
        }
        return result;
    }, [_info, props])

    return <div className="calendar-day">
        {<GroupDayHeader date={props.date} info={_info} refreshAttendance={refreshMeals} updateAttendance={toggleMeals} />}
        <div className="meal-container">
            {renderMeals()}
        </div>
    </div>
}

export default GroupDay;*/