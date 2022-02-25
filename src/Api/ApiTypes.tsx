interface Attendance {
    breakfast: number;
    dinner: number;
    desert: number;
}
interface Mask {
    breakfast: boolean;
    dinner: boolean;
    desert: boolean;
}

interface AttendanceDto {
    Year: number;
    Month: number;
    Day: number;
    DailyAttendance: Attendance;
}

interface MaskDto {
    Year: number;
    Month: number;
    Day: number;
    DailyMask: Mask;
}

interface ChildDto {
    name: string;
    surname: string;
    groupId: number;
    defaultAttendance: Attendance;
}

interface GroupDto {
    name: string;
    groupId: number;
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

export type { ChildDto, GroupDto, MaskDto, AttendanceDto, Mask, Attendance, JWToken };