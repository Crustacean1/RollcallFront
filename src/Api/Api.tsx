class Api {
    httpOk: number;
    httpCreated: number;
    httpCreatedEmpty: number;
    httpNotFound: number;
    httpUnauthorized: number;
    httpServerError: number;

    apiEndpoint: string;

    constructor() {
        this.httpOk = 200;
        this.httpCreated = 201;
        this.httpCreatedEmpty = 204;
        this.httpNotFound = 404;
        this.httpUnauthorized = 401;
        this.httpServerError = 500;

        this.apiEndpoint = process.env.REACT_APP_API_URL ?? "";
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
                return Promise.reject(data.status);
        }
    }

    toStringArray(...ints: number[]): string[] {
        let res: string[] = [];
        for (let item of ints) {
            res.push(item.toString());
        }
        return res;
    }


    sendQuery<T>(method: string, object: any, token: string, ...path: string[]): Promise<T> {
        return this.fetchFromApi(this.concatPath(...path), method, object, token)
            .then(data => this.handleStatus(data))
            .then(response => {
                return response as Promise<T>
            })
    }
    sendRequest(method: string, object: any, token: string, ...path: string[]): Promise<{}> {
        return this.fetchFromApi(this.concatPath(...path), method, object, token)
            .then(() => { return {} });
    }

    post<T>(object: any, token: string, ...path: string[]): Promise<T> {
        return this.sendQuery<T>("POST", object, token, ...path);
    }
    get<T>(token: string, ...path: string[]): Promise<T> {
        return this.sendQuery<T>("GET", {}, token, ...path);
    }
    put<T>(object: any, token: string, ...path: string[]): Promise<T> {
        return this.sendQuery<T>("PUT", object, token, ...path);
    }
    patch<T>(object: any, token: string, ...path: string[]): Promise<T> {
        return this.sendQuery<T>("PATCH", object, token, ...path);
    }
    delete(token: string, ...path: string[]): Promise<{}> {
        return this.sendRequest("DELETE", {}, token, ...path);
    }
}

const apiHandler = new Api();
export default apiHandler;