import { useState, useEffect } from 'react';

import './Calendar.css'
import { AttendanceDto } from '../../Api/ApiTypes';
import { DisabledDay, LoadingDay } from './Day/Day';
import { DayContext } from './Day/DayTypes';
import { useNavigate } from 'react-router-dom';

import apiHandler from '../../Api/Api';

interface CalendarProps {
    context: DayContext;
    selectedDate: Date;
    setDate: (date: Date) => void;
}

function Calendar(props: CalendarProps) {

    let unrollDate = (date: Date): [number, number] => {
        return [date.getFullYear(), date.getMonth() + 1];
    }

    let [_attendance, setAttendance] = useState<AttendanceDto[]>([]);
    let navigate = useNavigate();

    useEffect(() => {
        console.log(props);
        setAttendance([]);
        let isActive = true;
        props.context.apiHandler.getMonthlyAttendance(...unrollDate(props.selectedDate)).then(
            (newAttendance) => {
                if (isActive && newAttendance) {
                    setAttendance(newAttendance.days);
                }
            }, e => {
                apiHandler.errorMessage(e);
                navigate('/login');
            });

        return () => { isActive = false }
    }, [props.context, props.selectedDate, navigate]);


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
            <div className="inner-calendar">
                <div className="calendar-navigation">
                    <span className="calendar-prev" onClick={() => changeMonth(-1)}></span>
                    <h2>
                        {props.selectedDate.getFullYear()} {props.selectedDate.toLocaleString('default', { month: 'long' })}
                    </h2>
                    <span className="calendar-next" onClick={() => changeMonth(1)}></span>
                </div>
                <div className="calendar-header">
                    {daysOfWeek.map(a => <span key={a} className="day-header">{a}.</span>)}
                </div>
                <div className="calendar">
                    {populateCalendar()}
                </div>
            </div>
        </div>);
}

export default Calendar;