import ChildDayHeader from './ChildHeader';
import ChildMeal from './ChildMeal';
import { FetchChildAttendance, SetChildAttendance } from './ChildApi';

import { MealContext } from '../DayTypes';
import CreateDayContext, { MonthCountUpdate } from '../Day';

const childMealContext: MealContext = {
    headerFunc: ChildDayHeader,
    mealFunc: ChildMeal,
    updateAttendance: SetChildAttendance
}

function CreateChildContext(childId: number, updateFunc: MonthCountUpdate) {
    return CreateDayContext(childMealContext,
        childId,
        (year: number, month: number) => FetchChildAttendance(childId, year, month),
        updateFunc);
}

export default CreateChildContext;