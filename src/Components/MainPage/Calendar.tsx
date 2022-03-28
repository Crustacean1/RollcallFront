import { useState, useEffect } from 'react';

import './Calendar.css'
import { AttendanceDto } from '../../Api/ApiTypes';
import { DisabledDay, LoadingDay } from './Day/Day';
import { DayContext } from './Day/DayTypes';
import apiHandler from '../../Api/Api';

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

    let renderDay = (date: Date) => {
        let dayKey = `${date.getDate()}-${date.getMonth()}`;

        if (date.getMonth() !== props.selectedDate.getMonth()) {
            return (<div key={dayKey} className="empty-day"></div>);
        }
        else if (date.getDay() === 6 || date.getDay() === 0) {
            return (<DisabledDay key={dayKey} date={new Date(date)} />);
        }
        else if (_attendance[date.getDate() - 1] === undefined) {
            return (<LoadingDay key={dayKey} />);
        }
        return (<props.context.dayFunc key={dayKey}
            attendance={_attendance[date.getDate() - 1]}
            date={{
                year: date.getFullYear(),
                month: date.getMonth() + 1,
                day: date.getDate()
            }} />);
    }

    let populateCalendar = () => {
        let result = [] as JSX.Element[];
        let date = new Date(props.selectedDate);

        date.setDate(date.getDate() - ((date.getDay() + 6) % 7));//Align to monday

        let nextMonth = ((props.selectedDate.getMonth() + 1) % 12);

        for (; date.getMonth() !== nextMonth; date.setDate(date.getDate() + 1)) {

            result.push(renderDay(date));
        }
        return result;
    }

    let changeMonth = (move: number) => {
        let newDate = new Date(props.selectedDate.getFullYear(), props.selectedDate.getMonth() + move, 1)
        props.setDate(newDate);
    }

    let daysOfWeek = ["Pn", "Wt", "Śr", "Czw", "Pt", "Sob", "Nied"];

    return (
        <div className="calendar-container">
            <div className="calendar-prev" onClick={() => { changeMonth(-1) }}></div>
            <div className="inner-calendar">
                <h2>{props.selectedDate.getFullYear()} {props.selectedDate.toLocaleString('default', { month: 'long' })}</h2>
                <div className="calendar-header">
                    {daysOfWeek.map(a => <span key={a} className="day-header">{a}.</span>)}
                </div>
                <div className="calendar">
                    {populateCalendar()}
                </div>
            </div>
            <div className="calendar-next" onClick={() => { changeMonth(1) }}></div>
        </div>);
}

export default Calendar;