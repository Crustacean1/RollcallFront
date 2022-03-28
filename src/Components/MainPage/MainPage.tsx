import { useState, useEffect, createContext } from 'react';

import './MainPage.css';
import Calendar from './Calendar';
import { PreviewMode } from '../Common/Types';
import MainPreview from './Preview/MainPreview';

import apiHandler from '../../Api/Api';
import { getTokenFromStorage } from '../Common/Session';

import CreateChildContext from './Day/Child/ChildContext';
import CreateGroupContext from './Day/Group/GroupContext';

import ChildDataPanel from './DataPanel/ChildDataPanel';
import GroupDataPanel from './DataPanel/GroupDataPanel';

import { DayContext } from './Day/DayTypes';

interface MonthCount {
    breakfast: number;
    dinner: number;
    desert: number;
}

const TokenContext = createContext('');

function MainPage(props: { nav: JSX.Element }) {

    let getStartingDate = (year: number, month: number) => {
        let date = new Date(year, month, 1);
        return date;
    }

    let now = new Date();

    let [_mode, setMode] = useState<PreviewMode>({ "type": "Group", "groupId": 0, "childId": 0 });
    let [_selectedDate, setDate] = useState<Date>(getStartingDate(now.getFullYear(), now.getMonth()));
    let [_monthCount, setMonthCount] = useState<MonthCount>({ breakfast: 0, dinner: 0, desert: 0 });
    let [_context, setContext] = useState<DayContext>(CreateGroupContext(0, setMonthCount));
    let [_token, setToken] = useState(getTokenFromStorage());

    let setGlobalMode = (mode: PreviewMode) => {
        setMode(mode);
    }

    useEffect(() => {
        setContext(_mode.type === "Group" ? CreateGroupContext(_mode.groupId, setMonthCount) :
            CreateChildContext(_mode.childId, setMonthCount));
    }, [_mode])

    return <div className="main-component">
        {props.nav}
        <div className="main-content">
            <MainPreview panelComponent={_mode.type === "Group" ?
                <GroupDataPanel monthCount={_monthCount} setMonthCount={setMonthCount} targetId={_mode.groupId} date={_selectedDate} /> :
                <ChildDataPanel monthCount={_monthCount} setMonthCount={setMonthCount} targetId={_mode.childId} date={_selectedDate} />}
                setMode={setGlobalMode} mode={_mode} />
            <TokenContext.Provider value="">
                <Calendar context={_context} selectedDate={_selectedDate} setDate={setDate} />
            </TokenContext.Provider>
        </div>
    </div>
}

export type { MonthCount };
export default MainPage;