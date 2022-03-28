import {
    JWToken,
    ChildAttendanceSummary,
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

    tryLogin(login: string, password: string): Promise<JWToken> {
        return this.sendRequest<JWToken>("POST", { "Login": login, "Password": password }, "", "user");
    }

    fetchMonthlySummary(year: number, month: number): Promise<ChildAttendanceSummary[]> {
        return this.sendRequest("GET", {}, this.token, "attendance", "group", "summary", ...this.toStringArray(year, month));
    }
    fetchDailySummary(group: number, year: number, month: number, day: number): Promise<ChildAttendanceSummary[]> {
        return this.sendRequest("GET", {}, this.token, "attendance", "group", "summary", ...this.toStringArray(group, year, month, day));
    }
}

export default Api;