import GroupMeal from './GroupMeal';
import GroupDayHeader from './GroupHeader';

import { MealUpdateFunction, DayInfo, DayDate, MealContext } from '../DayTypes';
import CreateDayContext, { MonthCountUpdate } from '../Day';
import { AttendanceApi } from '../../../../Api/ApiTypes';

interface GroupHeaderProps {
    info: DayInfo;
    date: DayDate;
    updateAttendance: (update: boolean, func: MealUpdateFunction) => void;
}

function CreateGroupContext(targetId: number, apiHandler: AttendanceApi, updateFunc: MonthCountUpdate) {
    return CreateDayContext(
        {
            mealFunc: GroupMeal,
            headerFunc: (props: GroupHeaderProps) => {
                return GroupDayHeader({ ...props, targetId: targetId, apiHandler: apiHandler })
            },
            updateData: (info, present) => { info.masked = present; },
            apiHandler: apiHandler
        },
        targetId,
        apiHandler,
        updateFunc);
}


export default CreateGroupContext;