import ChildDayHeader from './ChildHeader';
import { AttendanceApi } from '../../../../Api/ApiTypes';
import { DayContext } from '../DayTypes';
import CreateDayContext, { MonthCountUpdate } from '../Day';
import ChildMeal from './ChildMeal';


function CreateChildContext(childId: number, apiHandler: AttendanceApi, updateFunc: MonthCountUpdate): DayContext {
    return CreateDayContext(
        {
            headerFunc: ChildDayHeader,
            mealFunc: ChildMeal,
            updateData: (info, present) => { info.present = present ? 1 : 0 },
            apiHandler: apiHandler
        },
        childId,
        apiHandler,
        updateFunc);
}

export default CreateChildContext;