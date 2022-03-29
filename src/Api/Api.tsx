import {
    JWToken,
    ChildAttendanceSummary,
    MealAttendance,
    MealDate,
    AttendanceDto,
    ChildDto,
    GroupDto,
    AttendanceSummaryDto,
    MonthlyAttendanceDto,
    Attendance,
    DailyChildSummaryDto
} from "./ApiTypes";

import { getTokenFromStorage } from '../Components/Common/Session';

class Api {
    httpOk: number;
    httpCreated: number;
    httpCreatedEmpty: number;
    httpNotFound: number;
    httpUnauthorized: number;

    apiEndpoint: string;
    token: string;

    constructor() {
        this.httpOk = 200;
        this.httpCreated = 201;
        this.httpCreatedEmpty = 204;
        this.httpNotFound = 404;
        this.httpUnauthorized = 401;

        this.apiEndpoint = process.env.REACT_APP_API_URL ?? "";
        this.token = getTokenFromStorage();
    }

    getFetchOptions(fetchMethod: string, object: any, token: string): RequestInit {
        let options: RequestInit = {
            method: fetchMethod,
            mode: "cors",
            cache: "no-cache",
            headers: token ? { "Content-Type": "application/json", "Authorization": "Bearer " + token } : { "Content-Type": "application/json" },
            redirect: "follow"
        }
        if (object && Object.keys(object).length !== 0) {
            options.body = JSON.stringify(object);
        }
        return options;
    }

    fetchFromApi(path: string, method: string, object: any, token: string = "") {
        return fetch(this.apiEndpoint + path, this.getFetchOptions(method, object, token));
    }

    concatPath(...paths: string[]): string {
        let result: string = "/";
        for (let sub of paths) {
            result += (sub + "/");
        }
        return result
    }

    handleStatus(data: Response) {
        switch (data.status) {
            case this.httpOk:
            case this.httpCreated:
            case this.httpCreatedEmpty:
                return data.json();
            default:
                return Promise.reject(data.status);//Probably...
        }
    }

    toStringArray(...ints: number[]): string[] {
        let res: string[] = [];
        for (let item of ints) {
            res.push(item.toString());
        }
        return res;
    }

    sendRequest<T>(method: string, object: any, token: string, ...path: string[]): Promise<T> {
        return this.fetchFromApi(this.concatPath(...path), method, object, token)
            .then(data => this.handleStatus(data))
            .then(response => {
                return response as Promise<T>
            })
    }

    setToken(newToken: string) {
        this.token = newToken;
    }

    /*Login Methods*/

    tryLogin(login: string, password: string): Promise<JWToken> {
        return this.sendRequest<JWToken>("POST", { "Login": login, "Password": password }, "", "user");
    }

    /* Fetch Group Attendance*/

    getGroupMonthlyAttendance(groupId: number, year: number, month: number): Promise<MonthlyAttendanceDto> {
        return this.sendRequest("GET", {}, this.token, "attendance", "group", "daily", ...this.toStringArray(groupId, year, month));
    }
    getGroupDailyAttendance(groupId: number, date: MealDate): Promise<{ meals: AttendanceDto }> {
        return this.sendRequest("GET", {}, this.token, "attendance", "group", "daily", ...this.toStringArray(groupId, date.year, date.month, date.day));
    }
    getGroupMonthlyCount(groupId: number, year: number, month: number): Promise<AttendanceSummaryDto> {
        return this.sendRequest("GET", {}, this.token, "attendance", "group", "count", ...this.toStringArray(groupId, year, month));
    }

    updateGroupAttendance(groupId: number, mask: MealAttendance[], date: MealDate): Promise<MealAttendance[]> {
        return this.sendRequest("POST", mask, this.token, "attendance", "group",
            ...this.toStringArray(groupId, date.year, date.month, date.day));
    }

    /* Child Attendance Methods*/

    getChildMonthlyAttendance(childId: number, year: number, month: number): Promise<MonthlyAttendanceDto> {
        return this.sendRequest("GET", {}, this.token, "attendance", "child", "daily", ...this.toStringArray(childId, year, month));
    }
    getChildDailyAttendance(childId: number, date: MealDate): Promise<{ meals: AttendanceDto }> {
        return this.sendRequest("GET", {}, this.token, "attendance", "child", "daily", ...this.toStringArray(childId, date.year, date.month, date.day))
    }
    getChildMonthlyCount(childId: number, year: number, month: number): Promise<AttendanceSummaryDto> {
        return this.sendRequest("GET", {}, this.token, "attendance", "child", "count", ...this.toStringArray(childId, year, month));
    }
    updateChildAttendance(childId: number, attendance: MealAttendance[], date: MealDate): Promise<MealAttendance[]> {
        return this.sendRequest("POST", attendance, this.token, "attendance", "child"
            , ...this.toStringArray(childId, date.year, date.month, date.day));
    }

    /*SUMMARY INFO FETCHING*/

    fetchMonthlySummary(year: number, month: number): Promise<ChildAttendanceSummary[]> {
        return this.sendRequest("GET", {}, this.token, "attendance", "group", "summary", ...this.toStringArray(year, month));
    }
    fetchDailySummary(group: number, year: number, month: number, day: number): Promise<DailyChildSummaryDto[]> {
        return this.sendRequest("GET", {}, this.token, "attendance", "group", "summary", ...this.toStringArray(group, year, month, day));
    }
    extendAttendance(year: number, month: number): Promise<{ updated: number }> {
        return this.sendRequest("POST", {}, this.token, "attendance", "child", "extend", ...this.toStringArray(year, month));
    }

    /*  CRUD METHODS OF CHILD AND GROUP*/

    addChild(name: string, surname: string, groupId: number, attendance: Attendance): Promise<number[]> {
        return this.sendRequest("POST",
            [{
                "Name": name,
                "Surname": surname,
                "GroupId": groupId,
                "DefaultAttendance": attendance
            }], this.token, "child");
    }

    fetchChild(childId: number): Promise<ChildDto> {
        return this.sendRequest("GET", {}, this.token, "child",
            ...this.toStringArray(childId));
    }

    updateDefaultAttendance(childId: number, attendance: MealAttendance[]): Promise<MealAttendance[]> {
        return this.sendRequest("POST", attendance, this.token, "child", "attendance",
            ...this.toStringArray(childId));
    }


    fetchGroup(groupId: number): Promise<GroupDto> {
        return this.sendRequest("GET", {}, this.token, "group", ...this.toStringArray(groupId/*,year, month*/));
    }

    addGroup(groupName: string): Promise<GroupDto> {
        return this.sendRequest("POST", { "Name": groupName }, this.token, "group");
    }

    fetchGroups(): Promise<GroupDto[]> {
        return this.sendRequest("GET", {}, this.token, "group");
    }

    fetchChildrenFromGroup(groupId: number): Promise<ChildDto[]> {
        return this.sendRequest("GET", {}, this.token, "child", "group", ...this.toStringArray(groupId));
    }
}

const apiHandler = new Api();
export default apiHandler;