import '../Day.css';
import { useCallback } from 'react';
import { MealDate, ChildAttendanceDto, AttendanceDto } from '../../../../Api/ApiTypes';

import ChildMeal from './ChildMeal';
import ChildDayHeader from './ChildHeader';

import apiHandler from '../../../../Api/Api';
import useAttendanceInfo from '../AttendanceInfoHook';
import { MealNames, MonthCountUpdate } from '../DayTypes';
import { useSession } from '../../../Common/Session';


interface ChildDayProps {
    countUpdate: MonthCountUpdate;
    targetId: number;
    date: MealDate;
    attendance: AttendanceDto;
}

function ChildDay({ countUpdate, targetId, date, attendance }: ChildDayProps) {

    const _session = useSession();

    const requestMeals = useCallback((): Promise<AttendanceDto> => {
        return apiHandler.get(_session.token, "attendance", "child", "daily",
            ...apiHandler.toStringArray(targetId, date.year, date.month, date.day));
    }, [date, targetId, _session.token]);

    const requestAttendanceUpdate = useCallback((attendance: ChildAttendanceDto): Promise<ChildAttendanceDto> => {
        return apiHandler.post(attendance, _session.token, "attendance", "child",
            ...apiHandler.toStringArray(targetId, date.year, date.month, date.day))
    }, [date, targetId, _session.token])


    const [_mealAttendance, updateMeals] = useAttendanceInfo(attendance,
        { getDailyAttendance: requestMeals, updateAttendance: requestAttendanceUpdate },
        countUpdate
    );

    const renderMeals = useCallback(() => {
        const result: JSX.Element[] = [];

        for (let mealName of MealNames) {
            result.push(<ChildMeal
                key={`${mealName}`}
                mealState={_mealAttendance[mealName]}
                updateAttendance={(update: boolean) => updateMeals([mealName], update)}
                date={date} />);
        }
        return result;
    }, [_mealAttendance, date, updateMeals])


    return <div className="calendar-day child-day">
        <ChildDayHeader date={date} meals={_mealAttendance} updateAttendance={(toggle: boolean) => updateMeals(MealNames, toggle)} />
        <div className="meal-container">
            {renderMeals()}
        </div>
    </div>
}

export default ChildDay;