import GroupMeal from './GroupMeal';
import GroupDayHeader from './GroupHeader';
import { SetGroupAttendance, FetchGroupAttendance } from './GroupApi';

import { MealContext } from '../DayTypes';
import CreateDayContext, { MonthCountUpdate } from '../Day';

const groupMealContext: MealContext = {
    mealFunc: GroupMeal,
    headerFunc: GroupDayHeader,
    updateAttendance: SetGroupAttendance
}

function CreateGroupContext(targetId: number, updateFunc: MonthCountUpdate) {
    return CreateDayContext(groupMealContext,
        targetId,
        (year: number, month: number) => FetchGroupAttendance(targetId, year, month),
        updateFunc);
}


export default CreateGroupContext;