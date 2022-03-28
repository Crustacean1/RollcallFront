import Api from './Api';
import {
    ChildAttendanceSummary,
    MonthlyAttendanceDto,
    AttendanceSummaryDto,
    AttendanceDto,
    MealAttendance,
    MealDate
} from './ApiTypes';

class ChildAttendanceApi {
    api: Api;
    constructor(api: Api) {
        this.api = api;
    }

    getMonthlyAttendance(childId: number, year: number, month: number): Promise<MonthlyAttendanceDto> {
        return this.api.sendRequest("GET", {}, this.api.token, "attendance", "child", "daily", ...this.api.toStringArray(childId, year, month));
    }
    getDailyAttendance(childId: number, year: number, month: number, day: number): Promise<AttendanceDto> {
        return this.api.sendRequest("GET", {}, this.api.token, "attendance", "child", "daily", ...this.api.toStringArray(childId, year, month, day));
    }
    getMonthlyCount(childId: number, year: number, month: number): Promise<AttendanceSummaryDto> {
        return this.api.sendRequest("GET", {}, this.api.token, "attendance", "child", "count", ...this.api.toStringArray(childId, year, month));
}
    updateAttendance(childId: number, attendance: MealAttendance[], date: MealDate): Promise<MealAttendance[]> {
        return this.api.sendRequest("POST", attendance, this.api.token, "attendance", "child"
            , ...this.api.toStringArray(childId, date.year, date.month, date.day));
    }
    fetchDailySummary(group: number, year: number, month: number, day: number): Promise<ChildAttendanceSummary[]> {
        return this.api.fetchDailySummary(group, year, month, day);
    }
    fetchMonthlySummary(year: number, month: number) {
        return this.api.fetchMonthlySummary(year, month);
    }
}

export default ChildAttendanceApi;