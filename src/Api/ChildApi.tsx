import Api from './Api';
import { MealAttendance, Attendance, ChildDto, GroupDto } from './ApiTypes';

class ChildApi {
    api: Api;
    constructor(api: Api) {
        this.api = api;
    }
    addChild(name: string, surname: string, groupId: number, attendance: Attendance): Promise<number[]> {
        return this.api.sendRequest("POST",
            [{
                "Name": name,
                "Surname": surname,
                "GroupId": groupId,
                "DefaultAttendance": attendance
            }], this.api.token, "child");
    }

    fetchChild(childId: number): Promise<ChildDto> {
        return this.api.sendRequest("GET", {}, this.api.token, "child",
            ...this.api.toStringArray(childId));
    }

    updateDefaultAttendance(childId: number, attendance: MealAttendance[]): Promise<MealAttendance[]> {
        return this.api.sendRequest("POST", attendance, this.api.token, "child", "attendance",
            ...this.api.toStringArray(childId));
    }


    fetchGroup(groupId: number): Promise<GroupDto> {
        return this.api.sendRequest("GET", {}, this.api.token, "group", ...this.api.toStringArray(groupId/*,year, month*/));
    }

    addGroup(groupName: string): Promise<GroupDto> {
        return this.api.sendRequest("POST", { "Name": groupName }, this.api.token, "group");
    }

    fetchGroups(): Promise<GroupDto[]> {
        return this.api.sendRequest("GET", {}, this.api.token, "group");
    }

    fetchChildrenFromGroup(groupId: number): Promise<ChildDto[]> {
        return this.api.sendRequest("GET", {}, this.api.token, "child", "group", ...this.api.toStringArray(groupId));
    }
}

export default ChildApi;