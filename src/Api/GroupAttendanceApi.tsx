
import Api from './Api';
import {
    AttendanceDto,
    AttendanceSummaryDto,
    MonthlyAttendanceDto,
    ChildAttendanceSummary,
    MealAttendance,
    MealDate
} from './ApiTypes';

class GroupAttendanceApi {
    api: Api;

    constructor(api: Api) {
        this.api = api;
    }

    getMonthlyAttendance(groupId: number, year: number, month: number): Promise<MonthlyAttendanceDto> {
        return this.api.sendRequest("GET", {}, this.api.token, "attendance", "group", "daily", ...this.api.toStringArray(groupId, year, month));
    }
    getDailyAttendance(groupId: number, year: number, month: number, day: number): Promise<AttendanceDto> {
        return this.api.sendRequest("GET", {}, this.api.token, "attendance", "group", "daily", ...this.api.toStringArray(groupId, year, month, day));
    }
    getMonthlyCount(groupId: number, year: number, month: number): Promise<AttendanceSummaryDto> {
        return this.api.sendRequest("GET", {}, this.api.token, "attendance", "group", "count", ...this.api.toStringArray(groupId, year, month));
    }

    updateAttendance(groupId: number, mask: MealAttendance[], date: MealDate): Promise<MealAttendance> {
        return this.api.sendRequest("POST", mask, this.api.token, "attendance", "group",
            ...this.api.toStringArray(groupId, date.year, date.month, date.day));
    }

    fetchDailySummary(group: number, year: number, month: number, day: number): Promise<ChildAttendanceSummary[]> {
        return this.api.fetchDailySummary(group, year, month, day);
    }

    fetchMonthlySummary(year: number, month: number) {
        return this.api.fetchMonthlySummary(year, month);
    }
}

export default GroupAttendanceApi;