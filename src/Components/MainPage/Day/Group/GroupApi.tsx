import apiHandler from '../../../../Api/Api';
import { MealAttendance, AttendanceDto } from '../../../../Api/ApiTypes';
import { DayDate } from '../DayTypes';

function FetchGroupAttendance(groupId: number, year: number, month: number): Promise<AttendanceDto[]> {
    return apiHandler.fetchGroupAttendance(groupId, year, month + 1).then(n => n.days);
}

function SetGroupAttendance(target: number, date: DayDate, attendance: MealAttendance[]): Promise<MealAttendance[]> {
    return apiHandler.setGroupAttendance(target, attendance, date)
        .then((result) => {
            return result;
        });
}

export { SetGroupAttendance, FetchGroupAttendance };