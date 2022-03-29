import { useState, useEffect, useRef } from 'react';

import './MainPage.css';
import Calendar from './Calendar';
import { PreviewMode } from '../Common/Types';
import MainPreview from './Preview/MainPreview';

import CreateChildContext from './Day/Child/ChildContext';
import CreateGroupContext from './Day/Group/GroupContext';

import ChildDataPanel from './DataPanel/ChildDataPanel';
import GroupDataPanel from './DataPanel/GroupDataPanel';

import { DayContext } from './Day/DayTypes';
import apiHandler from '../../Api/Api';

interface MonthCount {
    breakfast: number;
    dinner: number;
    desert: number;
}

function MainPage(props: { nav: JSX.Element }) {

    apiHandler.refreshToken();

    let getStartingDate = (year: number, month: number) => {
        let date = new Date(year, month, 1);
        return date;
    }

    let now = new Date();

    let [_mode, setMode] = useState<PreviewMode>({ "type": "Group", "groupId": 0, "childId": 0 });
    let [_selectedDate, setDate] = useState<Date>(getStartingDate(now.getFullYear(), now.getMonth()));
    let [_monthCount, setMonthCount] = useState<MonthCount>({ breakfast: 0, dinner: 0, desert: 0 });

    let defaultContext = CreateGroupContext(0, setMonthCount);

    let [_context, setContext] = useState<DayContext>(defaultContext);

    let setGlobalMode = (mode: PreviewMode) => {
        setMode(mode);
    }

    let prevMode = useRef(_mode);

    useEffect(() => {
        if (_mode.type === prevMode.current.type && _mode.childId === prevMode.current.childId && _mode.groupId === prevMode.current.groupId) {
            return;
        }
        setContext(_mode.type === "Group" ? CreateGroupContext(_mode.groupId, setMonthCount) :
            CreateChildContext(_mode.childId, setMonthCount));
        prevMode.current = _mode;
    }, [_mode])

    return <div className="main-component">
        {props.nav}
        <div className="main-content">
            <MainPreview panelComponent={_mode.type === "Group" ?
                <GroupDataPanel monthCount={_monthCount} setMonthCount={setMonthCount} targetId={_mode.groupId} date={_selectedDate} /> :
                <ChildDataPanel monthCount={_monthCount} setMonthCount={setMonthCount} targetId={_mode.childId} date={_selectedDate} />}
                setMode={setGlobalMode} mode={_mode} />
            <Calendar context={_context} selectedDate={_selectedDate} setDate={setDate} />
        </div>
    </div>
}

export type { MonthCount };
export default MainPage;