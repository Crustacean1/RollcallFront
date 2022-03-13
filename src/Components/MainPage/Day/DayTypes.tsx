import { MealDto, AttendanceDto, MealDate } from '../../../Api/ApiTypes';

interface AttendanceRequestData {
    target: number;
    date: MealDate;
}

interface MealProps {
    date: MealDate;
    name: MealName;
    target: number;

    attendance: MealDto;
    setAttendance: (arg: MealDto) => void;
}

type DayRenderer = (props: MealProps) => JSX.Element;


interface DayProps {
    renderMeal: DayRenderer;

    date: MealDate;
    attendance: AttendanceDto;
    targetId: number;
}

interface DayDate {
    day: number;
    month: number;
    year: number;
}

interface DayProps {
    date: DayDate;
    attendance: AttendanceDto;
    targetId: number,
}
interface DayState {
    breakfast: MealDto;
    dinner: MealDto;
    desert: MealDto;
}

interface DayContext {
    fetchAttendance: (target: number, year: number, month: number) => Promise<AttendanceDto[]>;
    renderMeal: DayRenderer;
    targetId: number;
}
export type {
    MealProps,
    DayProps,
    AttendanceRequestData,
    DayContext,
    MealName,
    DayState
};

type MealName = "breakfast" | "dinner" | "desert"

const MealLabels = { "breakfast": "Śniadanie", "dinner": "Obiad", "desert": "Deser" };
const MealPluralLabels = { "breakfast": "Śniadania", "dinner": "Obiady", "desert": "Desery" };

export {
    MealLabels,
    MealPluralLabels
};