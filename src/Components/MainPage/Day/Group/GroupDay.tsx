import '../Day.css';
import { useCallback, useRef, useEffect } from 'react';
import { Loading, Loader } from '../../../Common/Loading';
import { MealDate, ChildAttendanceDto, AttendanceDto } from '../../../../Api/ApiTypes';
import GroupMeal from '../../Day/Group/GroupMeal';
import GroupDayHeader from '../../Day/Group/GroupHeader';

import useAttendanceInfo from '../AttendanceInfoHook';
import { MealNames, MonthCountUpdate } from '../DayTypes';
import { useSession } from '../../../Common/Session';
import apiHandler from '../../../../Api/Api';

interface GroupDayProps {
    countUpdate: MonthCountUpdate;
    targetId: number;
    date: MealDate;
    attendance: AttendanceDto;
}

function GroupDay({ countUpdate, targetId, date, attendance }: GroupDayProps) {


    const _session = useSession();

    const requestMeals = useCallback((): Promise<AttendanceDto> => {
        return apiHandler.get(_session.token, "attendance", "group", "daily",
            ...apiHandler.toStringArray(targetId, date.year, date.month, date.day));
    }, [date, targetId, _session.token]);

    const requestAttendanceUpdate = useCallback((attendance: ChildAttendanceDto): Promise<ChildAttendanceDto> => {
        return apiHandler.post(attendance, _session.token, "attendance", "group",
            ...apiHandler.toStringArray(targetId, date.year, date.month, date.day))
    }, [date, targetId, _session.token])

    const [_mealAttendance, , updateMeal, refreshMeals] = useAttendanceInfo(attendance,
        { getDailyAttendance: requestMeals, updateAttendance: requestAttendanceUpdate },
        countUpdate);

    const renderMeals = () => {
        let result: JSX.Element[] = [];

        for (let mealName of MealNames) {
            result.push(<GroupMeal
                key={`${mealName}`}
                state={_mealAttendance[mealName]}
                updateAttendance={(update: boolean) => updateMeal([mealName], update)}
                date={date} />);
        }
        return result;
    };

    const toggleMeals = useCallback((update: boolean) => {
        updateMeal(MealNames, update);
    }, [updateMeal]);

    return <div className="calendar-day group-day">
        {<GroupDayHeader date={date} info={_mealAttendance} targetId={targetId} refreshAttendance={refreshMeals} updateAttendance={toggleMeals} />}
        <div className="meal-container">
            {renderMeals()}
        </div>
    </div>
}

export default GroupDay;