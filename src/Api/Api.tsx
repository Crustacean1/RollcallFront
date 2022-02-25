import IsJWToken, {
    IsChildAttendanceList,
    JWToken,
    AttendanceDto,
    MaskDto,
    ChildDto,
    GroupDto} from "./ApiTypes";

class Api {
    apiEndpoint: string;
    httpOk: number;
    httpCreated: number;
    httpNotFound: number;
    httpUnauthorized: number;

    constructor() {
        this.apiEndpoint = process.env.REACT_APP_API_URL ?? "";
        this.httpOk = 200;
        this.httpCreated = 201;
        this.httpNotFound = 404;
        this.httpUnauthorized = 401;
    }
    getFetchOptions(fetchMethod: string, object: any, token: string): RequestInit {
        var options: RequestInit = {
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
        var result: string = "/";
        for (var sub of paths) {
            result += (sub + "/");
        }
        return result
    }
    tryLogin(login: string, password: string): Promise<JWToken> {
        return this.fetchFromApi("/user", "POST", { "Login": login, "Password": password })
            .then(
                (data) => {
                    switch (data.status) {
                        case this.httpOk:
                            return data.json();
                        case this.httpNotFound:
                            return Promise.reject(new Error("Server not responding"))
                        default:
                            return Promise.reject(new Error("Invalid credentials"))
                    }
                }
            ).then(
                (response) => {
                    if (IsJWToken(response)) {
                        return response as JWToken;
                    }
                    return Promise.reject(new Error("Invalid object received from api"));
                }
            )
    }

    fetchChildAttendanceCount(childId: number, year: number, month: number, token: string): Promise<AttendanceDto[]> {
        return this.fetchFromApi(this.concatPath("attendance", childId.toString(), year.toString(), month.toString()), "GET", {}, token)
            .then(
                (data) => {
                    switch (data.status) {
                        case this.httpOk:
                            return data.json();
                        case this.httpUnauthorized:
                            return Promise.reject(new Error("Session timed out"));
                        default:
                            return Promise.reject(new Error("Server side error"));
                    }
                }
            )
            .then(
                (response) => {
                    if (IsChildAttendanceList(response)) {
                        return response as Promise<AttendanceDto[]>;
                    }
                    return Promise.reject(new Error("In fetchChildAttendance: Invalid object returned from api"));
                }
            )
    }

    fetchChildAttendanceMasks(childId: number, year: number, month: number, token: string): Promise<MaskDto[]> {
        return this.fetchFromApi(this.concatPath("attendance", childId.toString(), year.toString(), month.toString()), "GET", {}, token)
            .then(
                (data) => {
                    switch (data.status) {
                        case this.httpOk:
                            return data.json();
                        case this.httpUnauthorized:
                            return Promise.reject(new Error("Session timed out"));
                        default:
                            return Promise.reject(new Error("Server side error"));
                    }
                }
            )
            .then(
                (response) => {
                    if (IsChildAttendanceList(response)) {
                        return response as Promise<MaskDto[]>;
                    }
                    return Promise.reject(new Error("In fetchChildAttendance: Invalid object returned from api"));
                }
            )
    }

    fetchChildrenFromGroup(groupId: number, token: string): Promise<ChildDto[]> {
        return this.fetchFromApi(this.concatPath("child", "group", groupId.toString()), "GET", {}, token)
            .then((data) => {
                switch (data.status) {
                    case this.httpOk:
                        return data.json();
                    case this.httpUnauthorized:
                        return Promise.reject(new Error("Session timed out"));
                    default:
                        return Promise.reject(new Error("Server side error"));
                }
            }
            ).then((response) => {
                return response as ChildDto[];// Whatever, TODO: Fix this
            })
    }

    fetchGroups(token: string) {
        return this.fetchFromApi(this.concatPath("group"), "GET", {}, token)
            .then((data) => {
                switch (data.status) {
                    case this.httpOk:
                        return data.json();
                    case this.httpUnauthorized:
                        return Promise.reject(new Error("Session timed out"));
                    default:
                        return Promise.reject(new Error("Server side error"));
                }
            }
            ).then((response) => {
                return response as GroupDto[];// Whatever, TODO: Fix this +1
            })

    }
}

const apiHandler = new Api();

export default apiHandler;