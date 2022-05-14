import { AttendanceCountDto, MealDate } from '../../../Api/ApiTypes';

interface AttendanceRequestData {
    target: number;
    date: MealDate;
}

interface MealState {
    name: MealName;
    present: number;
    masked: boolean;
    loading: boolean;
}

interface DayMealState {
    [mealName: string]: MealState;
}

type MealUpdateFunction = (info: MealState, update: boolean) => void;

type MonthCountUpdate = (arg: AttendanceCountDto) => void;

export type {
    AttendanceRequestData,
    MealName,
    MealState,
    DayMealState,
    MealUpdateFunction,
    MonthCountUpdate
};

type MealName = "breakfast" | "dinner" | "desert"

const MealLabels = { "breakfast": "Śniadanie", "dinner": "Obiad", "desert": "Deser" };
const MealPluralLabels = { "breakfast": "Śniadania", "dinner": "Obiady", "desert": "Desery" };
const MealNames: MealName[] = ["breakfast", "dinner", "desert"];

export {
    MealLabels,
    MealPluralLabels,
    MealNames
};