import { useEffect, useState } from 'react';
import { MealDate, Attendance, AttendanceSummary, AttendanceDto, AttendanceSummaryDto } from '../../../Api/ApiTypes';

interface DayProps {
    renderMeal: (attendance: number, mask: boolean, loading: boolean) => JSX.Element;
    fetchAttendance: () => AttendanceSummaryDto[];
    fetchMasks: () => AttendanceDto[];

    date: MealDate;
    attendance: AttendanceSummary[];
    masks: Attendance[];
}

type MealName = "breakfast" | "dinner" | "desert";

function Day(props: DayProps) {
    const allLoaded = { "breakfast": true, "dinner": true, "desert": true };
    const notLoaded = { "breakfast": false, "dinner": false, "desert": false };

    let [_loaded, setLoaded] = useState(notLoaded);
    useEffect(() => {
        if (props.attendance[props.date.day] === undefined || props.masks[props.date.day] === undefined) {
            setLoaded(notLoaded);
        }
    }, [props.date, props.attendance, props.masks])

    let populateMeals = () => {
        const mealNames = ["breakfast", "dinner", "desert"];
        let result: JSX.Element[] = []

        let attendance = props.attendance[props.date.day];
        let mask = props.masks[props.date.day];

        for (let name of mealNames) {
            result.push(props.renderMeal(attendance[name as MealName], mask[name as MealName], _loaded[name as MealName]));
        }
        return result;
    }
    return <div className="calendar-day">
        <h4>{props.date.day}</h4>
        {populateMeals()}
    </div>
}

export default Day;