import { useState, useEffect } from 'react';

import './Calendar.css'
import { MealNames } from './Day/DayTypes';
import { MealDate, AttendanceDto } from '../../Api/ApiTypes';
import LoadingDay from './Day/LoadingDay';
import DisabledDay from './Day/DisabledDay';

import { useSession } from '../Common/Session';

interface DayComponentProps {
    date: MealDate,
    attendance: AttendanceDto,
}

type DayComponent = (props: DayComponentProps) => JSX.Element;

type MealFetchFunction = (token: string, date: Date) => Promise<AttendanceDto[]>;

interface CalendarProps {
    fetchFunction: MealFetchFunction;

    SelectedDay: DayComponent;

    selectedDate: Date;
    setDate: (date: Date) => void;
}

function Calendar({ fetchFunction, SelectedDay, selectedDate, setDate }: CalendarProps) {

    const [_attendance, setAttendance] = useState<AttendanceDto[]>([]);

    const _session = useSession();

    useEffect(() => {
        setAttendance([]);
        let isActive = true;
        fetchFunction(_session.token, selectedDate).then(
            (newAttendance) => {
                if (isActive && newAttendance && newAttendance) {
                    setAttendance(newAttendance.map(a => patchAttendance(a, MealNames)));
                }
            }, e => {
                _session.invalidateSession();
            });

        return () => { isActive = false }
    }, [_session, selectedDate, fetchFunction, SelectedDay]);


    const renderDay = (date: Date) => {
        let dayKey = `${date.getDate()}-${date.getMonth()}`;

        if (date.getMonth() !== selectedDate.getMonth()) {
            return (<div key={dayKey} className="empty-day"></div>);
        }
        else if (date.getDay() === 6 || date.getDay() === 0) {
            return (<DisabledDay key={dayKey} date={new Date(date)} />);
        }
        else if (_attendance[date.getDate() - 1] === undefined) {
            return (<LoadingDay key={dayKey} />);
        }
        return <SelectedDay
            key={`${date.getMonth() + 1}-${date.getDate()}`}
            date={{ year: date.getFullYear(), month: date.getMonth() + 1, day: date.getDate() }}
            attendance={_attendance[date.getDate()]} />
    }

    let populateCalendar = () => {
        let result = [] as JSX.Element[];
        let date = new Date(selectedDate);

        date.setDate(date.getDate() - ((date.getDay() + 6) % 7));//Align to monday

        let nextMonth = ((selectedDate.getMonth() + 1) % 12);

        for (; date.getMonth() !== nextMonth; date.setDate(date.getDate() + 1)) {

            result.push(renderDay(date));
        }
        return result;
    }

    let changeMonth = (move: number) => {
        let newDate = new Date(selectedDate.getFullYear(), selectedDate.getMonth() + move, 1)
        setDate(newDate);
    }

    const daysOfWeek = ["Pn", "Wt", "Śr", "Czw", "Pt", "Sob", "Nied"];

    return (
        <div className="calendar-container">
            <div className="inner-calendar">
                <div className="calendar-navigation">
                    <span className="calendar-prev button" onClick={() => changeMonth(-1)}></span>
                    <h2 className="calendar-date">
                        {selectedDate.getFullYear()} {selectedDate.toLocaleString('default', { month: 'long' })}
                    </h2>
                    <span className="calendar-next button" onClick={() => changeMonth(1)}></span>
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

function patchAttendance(data: AttendanceDto, meals: string[]): AttendanceDto {
    const filledData = { ...data };
    for (let meal of meals) {
        if (filledData[meal] === undefined) {
            filledData[meal] = { masked: false, present: 0 };
        }
    }
    return filledData;
}

export default Calendar;
export type { DayComponent, DayComponentProps, MealFetchFunction };