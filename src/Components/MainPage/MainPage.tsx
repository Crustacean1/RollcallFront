import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import './MainPage.css';
import Calendar from './Calendar';
import { PreviewMode } from '../Common/Types';
import MainPreview from './Preview/MainPreview';

import childMealContext from './Day/ChildDay';
import groupMealContext from './Day/GroupDay';

import ChildDataPanel from './DataPanel/ChildDataPanel';
import GroupDataPanel from './DataPanel/GroupDataPanel';

import { DayContext } from './Day/DayTypes';

function MainPage(props: { nav: JSX.Element }) {

    let getStartingDate = (year: number, month: number) => {
        let date = new Date(year, month, 1);
        return date;
    }

    let now = new Date();

    let defaultContext = {
        ...groupMealContext,
        targetId: 0
    };

    let [_mode, setMode] = useState<PreviewMode>({ "type": "Group", "groupId": 0, "childId": 0 });
    let [_selectedDate, setDate] = useState<Date>(getStartingDate(now.getFullYear(), now.getMonth()));
    let [_context, setContext] = useState<DayContext>(defaultContext);


    let setGlobalMode = (mode: PreviewMode) => {
        setContext(mode.type === "Group" ? { ...groupMealContext, targetId: mode.groupId } :
            { ...childMealContext, targetId: mode.childId });

        setMode(mode);
    }

    return <div className="main-component">
        {props.nav}
        <div className="main-content">
            <MainPreview panelComponent={_mode.type === "Group" ?
                <GroupDataPanel targetId={_mode.groupId} date={_selectedDate} /> :
                <ChildDataPanel targetId={_mode.childId} date={_selectedDate} />}
                setMode={setGlobalMode} mode={_mode} />
            <Calendar context={_context}
                selectedDate={_selectedDate} setDate={setDate} />
        </div>
    </div>
}

export default MainPage;