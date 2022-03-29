import GroupMeal from './GroupMeal';
import GroupDayHeader from './GroupHeader';

import { MealUpdateFunction, DayInfo, DayDate, DayContext } from '../DayTypes';
import CreateDayContext, { MonthCountUpdate } from '../Day';
import { AttendanceApi } from '../../../../Api/ApiTypes';
import apiHandler from '../../../../Api/Api';

const groupApi: (childId: number) => AttendanceApi = (childId: number) => {
    return {
        getMonthlyAttendance: (...args) => apiHandler.getGroupMonthlyAttendance(childId, ...args),
        getDailyAttendance: (...args) => apiHandler.getGroupDailyAttendance(childId, ...args).then(r => r.meals),
        getMonthlyCount: (...args) => apiHandler.getGroupMonthlyCount(childId, ...args),
        updateAttendance: (...args) => apiHandler.updateGroupAttendance(childId, ...args),
    }
}

interface GroupHeaderProps {
    info: DayInfo;
    date: DayDate;
    updateAttendance: (update: boolean, func: MealUpdateFunction) => void;
    refreshAttendance: () => void;
}

function CreateGroupContext(groupId: number, updateFunc: MonthCountUpdate): DayContext {
    return CreateDayContext(
        {
            mealFunc: GroupMeal,
            headerFunc: (props: GroupHeaderProps) => {
                return GroupDayHeader({ ...props, targetId: groupId })
            },
            updateData: (info, present) => { info.masked = present; },
        },
        groupId,
        groupApi(groupId),
        updateFunc);
}


export default CreateGroupContext;