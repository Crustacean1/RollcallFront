import { useEffect, useState } from 'react';

import './GroupDay.css';
import { Attendance, AttendanceSummary, AttendanceDto, AttendanceSummaryDto } from '../../../Api/ApiTypes';
import apiHandler from '../../../Api/Api';
import { DayProps } from './../Calendar'

function fetchGroupAttendance(groupId: number, year: number, month: number): Promise<AttendanceSummaryDto[]> {
    return apiHandler.fetchGroupAttendance(groupId, year, month + 1);
}
function fetchGroupMasks(groupId: number, year: number, month: number): Promise<AttendanceDto[]> {
    return apiHandler.fetchGroupMasks(groupId, year, month + 1);
}

type MealName = "breakfast" | "dinner" | "desert";

function GroupDay(props: DayProps) {
    const dayMap = {
        "breakfast": "Śniadanie",
        "dinner": "Obiad",
        "desert": "Deser"
    };


    let nilAttendance = { "breakfast": 0, "dinner": 0, "desert": 0 };
    let nilMask = { "breakfast": true, "dinner": true, "desert": true };
    let defaultLoaded = { "breakfast": false, "dinner": false, "desert": false };

    let [_loaded, setLoaded] = useState<Attendance>(defaultLoaded);

    useEffect(() => {
        if (props.masks[props.date.day] !== undefined && props.attendance[props.date.day] !== undefined) {
            setLoaded(nilMask);
        }
    }, [props.masks, props.attendance])

    let mapProperties = (meals: AttendanceSummary) => {
        let result = [] as JSX.Element[];
        let id = `group-day-${props.date.day}`;

        let mealNames: MealName[] = ["breakfast", "dinner", "desert"];
        let mask = props.masks[props.date.day] ?? nilMask;

        for (let name of mealNames) {
            result.push(<div className="child-day-field">
                <input id={`${id}-${name}`} type="checkbox" checked={mask[name as MealName]} onChange={() => { }} />
                <label htmlFor={`${id}-${name}`}>{dayMap[name as MealName]}: </label>
                <span>{meals[name as MealName]}</span>
            </div>)
        }
        return result;
    }
    return <div className="calendar-day child-day">
        <h4>{props.date.day}</h4>
        {mapProperties(props.attendance[props.date.day] ?? nilAttendance)}
    </div>
}

export default GroupDay;
export { fetchGroupAttendance, fetchGroupMasks };
