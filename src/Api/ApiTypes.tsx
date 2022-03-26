
interface AttendanceSummary {
    breakfast: number;
    dinner: number;
    desert: number;
}

interface AttendanceSummaryDto {
    meals: AttendanceSummary;
}
interface MonthlyAttendanceDto {
    days: AttendanceDto[];
}

interface Attendance {
    breakfast: boolean;
    dinner: boolean;
    desert: boolean;
}

interface MealDate {
    year: number;
    month: number;
    day: number;
}

interface MealDto {
    present: number;
    masked: boolean;
}

interface MealAttendance {
    name: string;
    present: boolean;
}

interface AttendanceDto {
    breakfast: MealDto;
    dinner: MealDto;
    desert: MealDto;
}

interface ChildDto {
    name: string;
    id: number;
    surname: string;
    groupId: number;
    defaultAttendance: Attendance;
    groupName: string;
}

interface GroupDto {
    name: string;
    id: number;
}

interface GroupSummaryDto {
    name: string;
    id: number;
    summary: AttendanceSummary;
}

interface JWToken {
    token: string;
}

interface ChildAttendanceSummary {
    name: string;
    id: number;
    surname: string;
    summary: AttendanceSummary;
}

export type {
    ChildDto,
    GroupDto,
    AttendanceSummary,
    AttendanceDto,
    MealDto,
    Attendance,
    JWToken,
    GroupSummaryDto,
    MealDate,
    AttendanceSummaryDto,
    MonthlyAttendanceDto,
    MealAttendance,
    ChildAttendanceSummary
};