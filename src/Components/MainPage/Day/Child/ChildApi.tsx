import apiHandler from '../../../../Api/Api';
import { MealAttendance, AttendanceDto } from '../../../../Api/ApiTypes';
import { DayDate } from '../DayTypes';

function FetchChildAttendance(childId: number, year: number, month: number): Promise<AttendanceDto[]> {
    return apiHandler.fetchChildAttendance(childId, year, month + 1)
        .then(list => {
            return list.days;
        });
}

function SetChildAttendance(target: number, date: DayDate, attendance: MealAttendance[]): Promise<MealAttendance[]> {
    return apiHandler.setChildAttendance(target, attendance,
        date)
        .then((result) => {
            return result;
        })
}

export { FetchChildAttendance, SetChildAttendance };