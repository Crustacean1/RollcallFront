import { useState, useEffect } from 'react';

import './ChildDay.css';
import { Loading, Loader } from '../../Common/Loading';

import apiHandler from '../../../Api/Api';

import { MealAttendance, AttendanceDto } from '../../../Api/ApiTypes';
import { AttendanceRequestData, MealProps, MealName } from './DayTypes';


function fetchChildAttendance(childId: number, year: number, month: number): Promise<AttendanceDto[]> {
    return apiHandler.fetchChildAttendance(childId, year, month + 1)
        .then(list => {
            return list.days;
        });
}

function setChildAttendance(requestData: AttendanceRequestData, attendance: MealAttendance): Promise<boolean> {
    return apiHandler.setChildAttendance(requestData.target, attendance,
        requestData.date)
        .then((result) => {
            return result.present;
        })
}

function ChildMeal(props: MealProps) {

    const mealLabels = { "breakfast": "Śniadanie", "dinner": "Obiad", "desert": "Deser" };

    let [_loading, setLoading] = useState<boolean>(false);

    let setAttendance = (value: boolean) => {
        let newAttendance = Object.assign({}, props.attendance);
        newAttendance.attendance = value ? 1 : 0;
        props.setAttendance(newAttendance);
    }
    if(props.attendance.attendance>1){
        alert("Nosz kurwa");
    }
    useEffect(() => {
        let active = true;
        if (_loading === true) {
            let newAttendance = props.attendance.attendance === 0;
            setChildAttendance({ target: props.target, date: props.date }, { name: props.name, present: newAttendance })
                .then(e => {
                    if (active) {
                        setAttendance(e);
                        setLoading(false);
                    }
                })
        }
        return () => { active = false; }
    }, [_loading]);

    let changeAttendance = () => { setLoading(true); }

    let id = `meal-${props.date.day}-${props.name}`;

    let isChecked = props.attendance.attendance === 1 && props.attendance.masked === false
    let isDisabled = props.attendance.masked === true;

    let checkbox = <input id={id} type="checkbox"
        disabled={isDisabled}
        checked={isChecked}
        onChange={(e) => changeAttendance()} />

    return <div className="day-meal">
        <Loading condition={!_loading} target={checkbox} loader={<Loader size="16px" />} />
        <label htmlFor={id}>{mealLabels[props.name]}</label>
    </div>
}

let childMealContext = {
    fetchAttendance: fetchChildAttendance,
    renderMeal: ChildMeal,
};

export default childMealContext;
