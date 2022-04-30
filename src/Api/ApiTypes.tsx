
interface MealDto {
    present: number;
    masked: boolean;
}

type AttendanceDto = { [MealName: string]: MealDto };

type AttendanceCountDto = { [MealName: string]: number };

type ChildAttendanceDto = { [MealName: string]: boolean };

interface ChildDto {
    name: string;
    id: number;
    surname: string;
    groupId: number;
    defaultAttendance: ChildAttendanceDto;
    groupName: string;
}

interface GroupDto {
    name: string;
    id: number;
}

interface JWToken {
    token: string;
}

interface MealDate {
    year: number;
    month: number;
    day: number;
}

interface AttendanceApi {
    getDailyAttendance(): Promise<AttendanceDto>;
    updateAttendance(attendance: ChildAttendanceDto): Promise<ChildAttendanceDto>;
}

export type {
    ChildDto,
    GroupDto,

    AttendanceDto,
    AttendanceCountDto,
    ChildAttendanceDto,

    MealDto,
    JWToken,
    MealDate,
    AttendanceApi
};