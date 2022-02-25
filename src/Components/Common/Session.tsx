
function getTokenFromStorage(): string {
    var token = window.localStorage.getItem("rollcall-token");
    if (!token) {
        token = "";
    }
    return token;
}
function saveTokenToStorage(token: string) {
    window.localStorage.setItem("rollcall-token", token);
}

export { getTokenFromStorage, saveTokenToStorage };