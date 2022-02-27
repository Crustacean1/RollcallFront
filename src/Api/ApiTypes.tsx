interface AttendanceSummary {
    breakfast: number;
    dinner: number;
    desert: number;
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

interface AttendanceDto {
    date: MealDate;
    meals: Attendance;
}

interface AttendanceSummaryDto {
    date: MealDate;
    meals: AttendanceSummary;
}

interface ChildDto {
    name: string;
    id: number;
    surname: string;
    groupId: number;
    defaultAttendance: Attendance;
}

interface GroupDto {
    name: string;
    id: number;
}

interface GroupSummaryDto {
    name: string,
    id: number;
    summary: AttendanceSummary;
}

interface JWToken {
    token: string;
}

function IsJWToken(obj: any): boolean {
    if ("token" in obj && typeof obj["token"] == "string") {
        return true;
    }
    return false;
}
function IsChildAttendanceList(object: any): boolean {
    if (!Array.isArray(object)) {
        return false;
    }
    var areElementsOk = true;
    object.forEach(
        (e) => {
            if ("Year" in e && "Month" in e && "Day" in e && "DailyAttendance" in e) {
            } else {
                areElementsOk = false;
            }
        }
    )
    return areElementsOk;
}

export default IsJWToken;
export { IsChildAttendanceList };

export type { ChildDto, GroupDto, AttendanceSummary, AttendanceDto, AttendanceSummaryDto, Attendance, JWToken, GroupSummaryDto, MealDate };