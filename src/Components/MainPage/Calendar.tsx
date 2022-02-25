import { useState, useEffect } from 'react';

import './Calendar.css'
import { MaskDto, AttendanceDto } from '../../Api/ApiTypes';
import apiHandler from '../../Api/Api';

interface DayDate {
    day: number;
    month: number;
    year: number;
}

interface DayContext {
    fetchAttendance: (target: number, year: number, month: number, token: string) => Promise<AttendanceDto[]>;
    fetchMasks: (target: number, year: number, month: number, token: string) => Promise<MaskDto[]>;
    dayComponent: ({ date, attendance, mask }: { date: DayDate, attendance: AttendanceDto, mask: MaskDto }) => JSX.Element;
}

interface CalendarProps {
    token: string;
    targetId: number;
    year: number;
    month: number;
    context: DayContext;
}


function Calendar(props: CalendarProps) {
    let getStartingDate = (year: number, month: number) => {
        var date = new Date(year, month, 1);
        return date;
    }

    let now = new Date();

    let [_selectedDate, selectDate] = useState<Date>(getStartingDate(now.getFullYear(), now.getMonth()));
    let [_attendance, setAttendance] = useState<AttendanceDto[]>([]);
    let [_masks, setMasks] = useState<MaskDto[]>([]);


    useEffect(() => {
        if (!_attendance) {
            props.context.fetchAttendance(props.targetId, _selectedDate.getFullYear(), _selectedDate.getMonth(), props.token).then(
                (newAttendance) => {
                    setAttendance(newAttendance);
                }
            )
        }
        if (!_masks) {
            props.context.fetchMasks(props.targetId, _selectedDate.getFullYear(), _selectedDate.getMonth(), props.token).then(
                (newMasks) => {
                    setMasks(newMasks);
                }
            )
        }
    });

    let populateCalendar = () => {
        var result = [] as JSX.Element[];
        var emptyMask = { "breakfast": -1, "dinner": -1, "desert": -1 };
        var emptyCount = { "breakfast": -1, "dinner": -1, "desert": -1 };
        var date = new Date(_selectedDate);

        date.setDate(date.getDate() - ((date.getDay() + 6) % 7));

        for (var i: number = 0;
            date.getMonth() !== ((_selectedDate.getMonth() + 1) % 12);
            date.setDate(date.getDate() + 1), i += 1) {

            if (date.getMonth() !== _selectedDate.getMonth()) {
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
                    "attendance": _attendance[i] ?? emptyCount,
                    "mask": _masks[i] ?? emptyMask
                }
            ));
        }
        return result;
    }

    let changeMonth = (move: number) => {
        selectDate(new Date(_selectedDate.getFullYear(), _selectedDate.getMonth() + move, 1));
    }

    return (
        <div className="calendar-container">
            <div className="calendar-prev" onClick={() => { changeMonth(-1) }}></div>
            <div className="inner-calendar">
                <h2>{_selectedDate.getFullYear()} {_selectedDate.toLocaleString('default', { month: 'long' })}</h2>
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