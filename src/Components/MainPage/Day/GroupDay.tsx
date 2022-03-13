import { useState, useEffect } from 'react';

import './GroupDay.css';
import { AttendanceDto, MealAttendance } from '../../../Api/ApiTypes';
import apiHandler from '../../../Api/Api';
import { AttendanceRequestData, MealProps } from './DayTypes';
import { Loading, Loader } from "../../Common/Loading";

function fetchGroupAttendance(groupId: number, year: number, month: number): Promise<AttendanceDto[]> {
    return apiHandler.fetchGroupAttendance(groupId, year, month + 1).then(n => n.days);
}

function setGroupAttendance(requestData: AttendanceRequestData, attendance: MealAttendance): Promise<boolean> {
    return apiHandler.setGroupAttendance(requestData.target, attendance,
        requestData.date)
        .then((result) => {
            return result.present;
        });
}

function GroupMeal(props: MealProps) {
    const mealLabels = { "breakfast": "Śniadanie", "dinner": "Obiad", "desert": "Deser" };

    let [_loading, setLoading] = useState<boolean>(props.attendance.masked);

    let setMasked = (value: boolean) => {
        let newAttendance = Object.assign({}, props.attendance);
        newAttendance.masked = value;
        props.setAttendance(newAttendance);
    }

    useEffect(() => {
        let active = true;
        if (_loading === true) {
            setGroupAttendance({ target: props.target, date: props.date }, { present: !props.attendance.masked, name: props.name })
                .then((e) => {
                    if (active) {
                        setMasked(e);
                        setLoading(true);
                    }
                })
        }
        return () => { setMasked(props.attendance.masked); active = false; }
    }, [_loading])

    let setNewMask = () => { setLoading(false) }

    let id = `meal-${props.date.day}-${props.name}`;
    let checkbox = <input id={id} type="checkbox" checked={props.attendance.masked} onChange={(e) => setNewMask()} />

    let mealStyle = { "color": props.attendance.masked ? "grey" : "black" };

    return <div className="day-meal">
        <Loading condition={!_loading} target={checkbox} loader={<Loader size="16px" />} />
        <label htmlFor={id}>{mealLabels[props.name]}</label>
        <span className="meal-count" style={mealStyle}>{props.attendance.attendance}</span>
    </div >
}

let groupMealContext = {
    fetchAttendance: fetchGroupAttendance,
    renderMeal: GroupMeal
}

export default groupMealContext;
