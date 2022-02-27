import { useState, useEffect } from 'react';

import './Calendar.css'
import { AttendanceSummaryDto, AttendanceDto, Attendance, AttendanceSummary, MealDate } from '../../Api/ApiTypes';
import { PreviewMode } from '../Common/Types';

interface DayDate {
    day: number;
    month: number;
    year: number;
}

interface ChildDayData {
    attendance: Attendance;
    mask: Attendance;
}

interface GroupDayData {
    attendance: AttendanceSummary;
    mask: Attendance;
}

interface DayProps {
    date: DayDate;
    attendance: AttendanceSummary[];
    masks: Attendance[];
    targetId: number

    updateAttendance: (a: AttendanceSummary) => void;
    updateMask: (a: Attendance) => void;
}

interface DayContext {
    fetchAttendance: (target: number, year: number, month: number) => Promise<AttendanceSummaryDto[]>;
    fetchMasks: (target: number, year: number, month: number) => Promise<AttendanceDto[]>;
    dayComponent: (props: DayProps) => JSX.Element;
}

interface CalendarProps {
    targetId: number;
    context: DayContext;
    selectedDate: Date;
    setDate: (date: Date) => void;
}


function parseSparseData<T>(dto: { date: MealDate, meals: T }[], nilValue: T): T[] {
    let filled: T[] = [];
    for (let day of dto) {
        filled[day.date.day] = day.meals;
    }
    return filled;
}

function Calendar(props: CalendarProps) {

    let nilMask = { "breakfast": false, "dinner": false, "desert": false };
    let nilAttendance = { "breakfast": 0, "dinner": 0, "desert": 0 };

    let unrollDate = (date: Date): [number, number] => {
        return [date.getFullYear(), date.getMonth()];
    }

    let [_attendance, setAttendance] = useState(parseSparseData([], nilAttendance));
    let [_masks, setMasks] = useState(parseSparseData([], nilMask));


    useEffect(() => {
        let isActive = true;

        setAttendance(parseSparseData([], nilAttendance));
        setMasks(parseSparseData([], nilMask));

        props.context.fetchAttendance(props.targetId, props.selectedDate.getFullYear(), props.selectedDate.getMonth()).then(
            (newAttendance) => {
                if (isActive) {
                    let parsedAttendance = parseSparseData(newAttendance, nilAttendance);
                    setAttendance(parsedAttendance);
                }
            }
        )
        props.context.fetchMasks(props.targetId, ...unrollDate(props.selectedDate)).then(
            (newMasks) => {
                if (isActive) {
                    let parsedMasks = parseSparseData(newMasks, nilMask);
                    setMasks(parsedMasks);
                }
            })
        return () => { isActive = false }
    }, [props.context, props.selectedDate]);

    let setDayAttendance = (a: AttendanceSummary, day: number) => {
        let newAttendance = _attendance.slice();
        newAttendance.splice(day - 1, 1, a);
        setAttendance(newAttendance);
    }

    let setDayMask = (m: Attendance, day: number) => {
        let newMasks = _masks.slice();
        newMasks.splice(day, 1, m);
        setMasks(newMasks);
    }

    let populateCalendar = () => {
        let result = [] as JSX.Element[];
        let date = new Date(props.selectedDate);

        date.setDate(date.getDate() - ((date.getDay() + 6) % 7));//Align to monday

        let nextMonth = ((props.selectedDate.getMonth() + 1) % 12);

        for (let i: number = 1;
            date.getMonth() !== nextMonth;
            date.setDate(date.getDate() + 1)) {

            if (date.getMonth() !== props.selectedDate.getMonth()) {
                result.push(<div className="empty-day"></div>);
                continue;
            }

            result.push(props.context.dayComponent(
                {
                    "date": {
                        "year": date.getFullYear(),
                        "month": date.getMonth(),
                        "day": date.getDate()
                    },
                    "masks": _masks,
                    "attendance": _attendance,
                    "targetId": props.targetId,
                    "updateAttendance": (a) => setDayAttendance(a, i),
                    "updateMask": (m) => setDayMask(m, i)
                }
            ));
            i += 1;
        }
        return result;
    }

    let changeMonth = (move: number) => {
        let newDate = new Date(props.selectedDate.getFullYear(), props.selectedDate.getMonth() + move, 1)
        props.setDate(newDate);
    }

    return (
        <div className="calendar-container">
            <div className="calendar-prev" onClick={() => { changeMonth(-1) }}></div>
            <div className="inner-calendar">
                <h2>{props.selectedDate.getFullYear()} {props.selectedDate.toLocaleString('default', { month: 'long' })}</h2>
                <div className="calendar-header">
                    <span className="day-header">Pn.</span>
                    <span className="day-header">Wt.</span>
                    <span className="day-header">Śr.</span>
                    <span className="day-header">Czw.</span>
                    <span className="day-header">Pt.</span>
                    <span className="day-header">Sob.</span>
                    <span className="day-header">Nied.</span>
                </div>
                <div className="calendar">
                    {populateCalendar()}
                </div>
            </div>
            <div className="calendar-next" onClick={() => { changeMonth(1) }}></div>
        </div>);
}

export default Calendar;

export type { DayProps };