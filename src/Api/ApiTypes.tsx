interface AttendanceSummary {
    breakfast: number;
    dinner: number;
    desert: number;
}

interface AttendanceSummaryDto {
    meals: AttendanceSummary;
}

interface Attendance {
    breakfast: boolean;
    dinner: boolean;
    desert: boolean;
}


interface MealDto {
    present: number;
    masked: boolean;
}

interface AttendanceDto {
    breakfast: MealDto;
    dinner: MealDto;
    desert: MealDto;
}

interface MealAttendance {
    name: string;
    present: boolean;
}

interface MealDate {
    year: number;
    month: number;
    day: number;
}

interface MonthlyAttendanceDto {
    days: AttendanceDto[];
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
    childId: number;
    surname: string;
    groupName: string;
    summary: AttendanceSummary;
}

interface DailyChildSummaryDto {
    name: string;
    childId: number;
    surname: string;
    groupName: string;
    meals: AttendanceDto;
}

interface AttendanceApi {
    getMonthlyAttendance: (year: number, month: number) => Promise<MonthlyAttendanceDto>;
    getDailyAttendance(date: MealDate): Promise<AttendanceDto>;
    getMonthlyCount(year: number, month: number): Promise<AttendanceSummaryDto>;
    updateAttendance(attendance: MealAttendance[], date: MealDate): Promise<MealAttendance[]>;
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
    DailyChildSummaryDto,
    MonthlyAttendanceDto,
    MealAttendance,
    ChildAttendanceSummary,
    AttendanceApi
};