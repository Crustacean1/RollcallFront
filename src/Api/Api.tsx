import IsJWToken, {
    IsChildAttendanceList,
    JWToken,
    Attendance,
    AttendanceDto,
    AttendanceSummaryDto,
    ChildDto,
    GroupDto,
    GroupSummaryDto
} from "./ApiTypes";

import { getTokenFromStorage } from '../Components/Common/Session';

class Api {
    httpOk: number;
    httpCreated: number;
    httpNotFound: number;
    httpUnauthorized: number;

    apiEndpoint: string;
    token: string;

    constructor() {
        this.httpOk = 200;
        this.httpCreated = 201;
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
                return data.json();
            case this.httpNotFound:
                return Promise.reject(new Error("Resource not found"));
            case this.httpUnauthorized:
                return Promise.reject(new Error("You're unauthorized"));
            default:
                return Promise.reject(new Error("Server internal error"));//Probably...
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

    tryLogin(login: string, password: string): Promise<JWToken> {
        return this.sendRequest<JWToken>("POST", { "Login": login, "Password": password }, "", "user");
    }

    fetchChildAttendance(childId: number, year: number, month: number): Promise<AttendanceDto[]> {
        return this.sendRequest("GET", {}, this.token, "attendance", "child", ...this.toStringArray(childId, year, month));
    }

    fetchChildMasks(childId: number, year: number, month: number): Promise<AttendanceDto[]> {
        return this.sendRequest("GET", {}, this.token, "mask", "child", ...this.toStringArray(childId, year, month));
    }

    fetchGroupAttendance(groupId: number, year: number, month: number): Promise<AttendanceSummaryDto[]> {
        return this.sendRequest("GET", {}, this.token, "attendance", "group", ...this.toStringArray(groupId, year, month));
    }

    fetchGroupMasks(groupId: number, year: number, month: number): Promise<AttendanceDto[]> {
        return this.sendRequest("GET", {}, this.token, "mask", "group", ...this.toStringArray(groupId, year, month));
    }

    fetchChildrenFromGroup(groupId: number): Promise<ChildDto[]> {
        return this.sendRequest("GET", {}, this.token, "child", "group", ...this.toStringArray(groupId));
    }

    fetchGroups(): Promise<GroupDto[]> {
        return this.sendRequest("GET", {}, this.token, "group");
    }

    fetchGroup(groupId: number, year: number, month: number): Promise<GroupSummaryDto> {
        return this.sendRequest("GET", {}, this.token, "attendance", "group", "summary", ...this.toStringArray(groupId, year, month));
    }

    fetchChild(childId: number): Promise<ChildDto> {
        return this.sendRequest("GET", {}, this.token, "child", ...this.toStringArray(childId));
    }

    setGroupAttendance(groupId: number, mask: Attendance, year: number, month: number, day: number): Promise<AttendanceDto[]> {
        return this.sendRequest("POST", mask, this.token, "attendance", "group", ...this.toStringArray(groupId, year, month, day))
    }

    setChildAttendance(childId: number, attendance: Attendance, year: number, month: number, day: number): Promise<AttendanceDto[]> {
        return this.sendRequest("POST", attendance, this.token, "attendance", "child", ...this.toStringArray(childId, year, month, day));
    }
}

const apiHandler = new Api();

export default apiHandler;