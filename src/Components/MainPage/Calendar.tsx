import { useState, useEffect } from 'react';

import './Calendar.css'
import { AttendanceDto, MealAttendance, AttendanceSummary, MealDate } from '../../Api/ApiTypes';
import Day, { LoadingDay } from './Day/Day';
import { DayContext } from './Day/DayTypes';

interface CalendarProps {
    context: DayContext;
    selectedDate: Date;
    setDate: (date: Date) => void;
}

function Calendar(props: CalendarProps) {

    let unrollDate = (date: Date): [number, number] => {
        return [date.getFullYear(), date.getMonth()];
    }

    let [_attendance, setAttendance] = useState<AttendanceDto[]>([]);


    useEffect(() => {
        let isActive = true;

        setAttendance([]);

        props.context.fetchAttendance(...unrollDate(props.selectedDate)).then(
            (newAttendance) => {
                if (isActive && newAttendance) {
                    setAttendance(newAttendance);
                }
            }, (e) => { console.log(e); });
        return () => { isActive = false }
    }, [props.context, props.selectedDate]);

    let populateCalendar = () => {
        let result = [] as JSX.Element[];
        let date = new Date(props.selectedDate);

        date.setDate(date.getDate() - ((date.getDay() + 6) % 7));//Align to monday

        let nextMonth = ((props.selectedDate.getMonth() + 1) % 12);

        for (let i: number = 0;
            date.getMonth() !== nextMonth;
            date.setDate(date.getDate() + 1)) {

            if (date.getMonth() !== props.selectedDate.getMonth()) {
                result.push(<div key={++i} className="empty-day"></div>);
                continue;
            }
            if (_attendance[date.getDate() - 1] === undefined) {
                result.push(<LoadingDay key={++i} />);
                continue;
            }

            result.push(<props.context.dayFunc key={++i}
                attendance={_attendance[date.getDate() - 1]}
                date={{
                    year: date.getFullYear(),
                    month: date.getMonth() + 1,
                    day: date.getDate()
                }} />);
        }
        return result;
    }

    let changeMonth = (move: number) => {
        let newDate = new Date(props.selectedDate.getFullYear(), props.selectedDate.getMonth() + move, 1)
        props.setDate(newDate);
    }

    let daysOfWeek = ["Pn", "Wt", "Śr", "Czw", "Pt", "Sob", "Nied"];
    let dayKey = 0;

    return (
        <div className="calendar-container">
            <div className="calendar-prev" onClick={() => { changeMonth(-1) }}></div>
            <div className="inner-calendar">
                <h2>{props.selectedDate.getFullYear()} {props.selectedDate.toLocaleString('default', { month: 'long' })}</h2>
                <div className="calendar-header">
                    {daysOfWeek.map(a => <span key={++dayKey} className="day-header">{a}.</span>)}
                </div>
                <div className="calendar">
                    {populateCalendar()}
                </div>
            </div>
            <div className="calendar-next" onClick={() => { changeMonth(1) }}></div>
        </div>);
}

export default Calendar;