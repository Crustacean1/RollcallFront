import ChildDayHeader from './ChildHeader';
import { AttendanceApi } from '../../../../Api/ApiTypes';
import { DayContext } from '../DayTypes';
import CreateDayContext, { MonthCountUpdate } from '../Day';
import ChildMeal from './ChildMeal';
import apiHandler from '../../../../Api/Api';

const childApi: (childId: number) => AttendanceApi = (childId: number) => {
    return {
        getMonthlyAttendance: (...args) => apiHandler.getChildMonthlyAttendance(childId, ...args),
        getDailyAttendance: (...args) => apiHandler.getChildDailyAttendance(childId, ...args).then(r => r.meals),
        getMonthlyCount: (...args) => apiHandler.getChildMonthlyCount(childId, ...args),
        updateAttendance: (...args) => apiHandler.updateChildAttendance(childId, ...args),
    }
}

function CreateChildContext(childId: number, updateFunc: MonthCountUpdate): DayContext {
    return CreateDayContext(
        {
            headerFunc: ChildDayHeader,
            mealFunc: ChildMeal,
            updateData: (info, present) => { info.present = present ? 1 : 0 },
        },
        childId,
        childApi(childId),
        updateFunc);
}

export default CreateChildContext;
export { childApi };