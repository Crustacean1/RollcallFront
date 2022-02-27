import { useState, useEffect } from 'react';

import './ChildDay.css';
import { Attendance, AttendanceSummary, AttendanceDto, AttendanceSummaryDto } from '../../../Api/ApiTypes';
import apiHandler from '../../../Api/Api';
import { DayProps } from './../Calendar';

import { Loading, Loader } from '../../Common/Loading';

function toSummary(a: Attendance): AttendanceSummary {
    return {
        "breakfast": a.breakfast ? 1 : 0,
        "dinner": a.dinner ? 1 : 0,
        "desert": a.desert ? 1 : 0
    };
}
function fromSummary(a: AttendanceSummary): Attendance {
    return {
        "breakfast": a.breakfast === 1,
        "dinner": a.dinner === 1,
        "desert": a.desert === 1,
    };
}

function fetchChildAttendance(childId: number, year: number, month: number): Promise<AttendanceSummaryDto[]> {
    return apiHandler.fetchChildAttendance(childId, year, month + 1)
        .then(list => {
            return list.map(a => {
                return {
                    "date": a.date,
                    "meals": toSummary(a.meals)
                }
            });
        });
}

function fetchChildMasks(groupId: number, year: number, month: number): Promise<AttendanceDto[]> {
    return apiHandler.fetchChildMasks(groupId, year, month + 1);
}

type MealName = "breakfast" | "dinner" | "desert";

interface ChildMealProps {
    date: number;
    name: MealName;
    attendance: number;
    mask: boolean;
    loaded: boolean;
    onChange: (value: boolean) => void;
}

function ChildMeal(props: ChildMealProps) {
    let id = `day-${props.date}-${props.name}`;
    let checkbox = <input id={id} type="checkbox" disabled={!props.mask} checked={props.attendance === 1}
        onChange={(e) => { props.onChange(e.currentTarget.checked) }} />
    return <div className="day-field">
        <Loading condition={props.loaded} target={checkbox} loader={<Loader size="15px" />} />
        <label htmlFor={id}>{props.name}</label>
    </div>
}

function ChildDay(props: DayProps) {
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
        /*if (props.masks[props.date.day] !== undefined && props.attendance[props.date.day] !== undefined) {
            setLoaded(nilMask);
        }*/
    })

    let changeAttendance = (name: MealName, value: boolean) => {
        let dto = fromSummary(props.attendance[props.date.day] ?? nilAttendance);
        dto[name] = value;
        let newLoaded = _loaded;
        newLoaded[name] = false;
        setLoaded(newLoaded);
        apiHandler.setChildAttendance(props.targetId, dto, props.date.year, props.date.month + 1, props.date.day)
            .then((response) => {
                props.updateAttendance(toSummary(response[0].meals));

            });
    }

    let mapProperties = () => {
        let result = [] as JSX.Element[];
        let id = `child-day-${props.date.day}`;
        let mealNames: MealName[] = ["breakfast", "dinner", "desert"];
        let attendance = props.attendance[props.date.day] ?? nilAttendance;
        let mask = props.masks[props.date.day] ?? nilMask;
        console.log(props.attendance);

        for (let name of mealNames) {

            result.push(<div className="child-day-field">
            </div>);
        }
        return result;
    }
    return <div className="calendar-day child-day">
        <h4>{props.date.day}</h4>
        {mapProperties()}
    </div>
}

export default ChildDay;
export { fetchChildAttendance, fetchChildMasks };
