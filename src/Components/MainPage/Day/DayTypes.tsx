import { AttendanceDto, MealDate, MealAttendance } from '../../../Api/ApiTypes';

interface AttendanceRequestData {
    target: number;
    date: MealDate;
}

interface MealInfo {
    name: MealName;
    present: number;
    masked: boolean;
    loading: boolean;
}

interface DayInfo {
    breakfast: MealInfo;
    dinner: MealInfo;
    desert: MealInfo;
}

interface DayDate {
    day: number;
    month: number;
    year: number;
}


type MealUpdateFunction = (info: MealInfo, update: boolean) => void;

interface MealProps {
    date: DayDate;
    info: MealInfo;
    updateAttendance: (update: boolean, func: MealUpdateFunction) => void;
}

interface HeaderProps {
    date: DayDate;
    info: DayInfo;
    updateAttendance: (update: boolean, func: MealUpdateFunction) => void;
}

type MealFunction = (props: MealProps) => JSX.Element;
type HeaderFunction = (props: HeaderProps) => JSX.Element;

type FetchFunction = (year: number, month: number) => Promise<AttendanceDto[]>;

interface DayContext {
    fetchAttendance: FetchFunction;
    dayFunc: (props: { attendance: AttendanceDto, date: MealDate }) => JSX.Element;
}

interface MealContext {
    updateAttendance: (target: number, date: DayDate, attendance: MealAttendance[]) => Promise<MealAttendance[]>;
    mealFunc: MealFunction;
    headerFunc: HeaderFunction;
}


export type {
    MealContext,
    AttendanceRequestData,
    DayContext,
    MealName,
    MealInfo,
    DayInfo,
    DayDate,
    MealUpdateFunction,
    FetchFunction
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