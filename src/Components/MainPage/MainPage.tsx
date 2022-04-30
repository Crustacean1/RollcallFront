import { useState, useCallback } from 'react';

import './MainPage.css';
import Calendar, { DayComponentProps, MealFetchFunction } from './Calendar';
import { PreviewMode } from '../Common/Types';
import { MealNames } from './Day/DayTypes';
import MainPreview from './Preview/MainPreview';

import ChildDataPanel from './DataPanel/ChildDataPanel';
import GroupDataPanel from './DataPanel/GroupDataPanel';

import ChildDay from './Day/Child/ChildDay';

import apiHandler from '../../Api/Api';
import { AttendanceDto, AttendanceCountDto } from '../../Api/ApiTypes';

function MainPage(props: { nav: JSX.Element }) {

    const getStartingDate = (year: number, month: number) => {
        let date = new Date(year, month, 1);
        return date;
    }

    const now = new Date();

    const [_mode, setMode] = useState<PreviewMode>({ "type": "Group", "groupId": 0, "childId": 0 });
    const [_selectedDate, setDate] = useState<Date>(getStartingDate(now.getFullYear(), now.getMonth()));
    const [_monthCount, setMonthCount] = useState<AttendanceCountDto>({ breakfast: 0, dinner: 0, desert: 0 });

    const updateMonthCount = useCallback((delta: AttendanceCountDto) =>
        setMonthCount(count => {
            const newCount = { ...count };
            for (let meal in newCount) {
                if (delta[meal] !== undefined) {
                    newCount[meal] += delta[meal];
                }
            }
            return newCount;
        }),
        [setMonthCount]);

    const dayComponent = useCallback(
        ((dayProps: DayComponentProps) => ChildDay({ targetId: _mode.childId, countUpdate: updateMonthCount, ...dayProps })),
        [_mode, updateMonthCount]);

    const fetchFunction: MealFetchFunction = useCallback(
        (token: string, date: Date) =>
            apiHandler.get<AttendanceDto[]>(token,
                "attendance",
                _mode.type === "Group" ? "group" : "child",
                "daily",
                ...apiHandler.toStringArray((_mode.type === "Group" ? _mode.groupId : _mode.childId), date.getFullYear(), date.getMonth() + 1)),
        [_mode])

    const mealCounterReset = useCallback((count: AttendanceCountDto) => {
        let newCounter: AttendanceCountDto = {};
        for (let meal of MealNames) {
            newCounter[meal] = count[meal] === undefined ? 0 : count[meal];
        }
        setMonthCount(newCounter);
    }, [setMonthCount])

    const dataPanel = (_mode.type === "Group" ?
        <GroupDataPanel monthCount={_monthCount} setMonthCount={mealCounterReset} targetId={_mode.groupId} date={_selectedDate} /> :
        <ChildDataPanel monthCount={_monthCount} setMonthCount={mealCounterReset} targetId={_mode.childId} date={_selectedDate} />);

    return <div className="main-component">
        {props.nav}
        <div className="main-content">
            <MainPreview panelComponent={dataPanel} setMode={setMode} mode={_mode} />
            <Calendar SelectedDay={dayComponent} fetchFunction={fetchFunction} selectedDate={_selectedDate} setDate={setDate} />
        </div>
    </div>
}

export default MainPage;