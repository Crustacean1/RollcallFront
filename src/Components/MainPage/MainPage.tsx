import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import './MainPage.css';
import Calendar from './Calendar';
import { PreviewMode } from '../Common/Types';
import MainPreview from './Preview/MainPreview';

import ChildDay, { fetchChildAttendance, fetchChildMasks } from './Day/ChildDay';
import GroupDay, { fetchGroupAttendance, fetchGroupMasks } from './Day/GroupDay';

import ChildDataPanel from './DataPanel/ChildDataPanel';
import GroupDataPanel from './DataPanel/GroupDataPanel';

function MainPage(props: { nav: JSX.Element }) {

    let getStartingDate = (year: number, month: number) => {
        let date = new Date(year, month, 1);
        return date;
    }

    let now = new Date();

    let [_mode, setMode] = useState<PreviewMode>({ "type": "Group", "groupId": 0, "childId": 0 });
    let [_selectedDate, setDate] = useState<Date>(getStartingDate(now.getFullYear(), now.getMonth()));

    let contexts = [{ "fetchMasks": fetchChildMasks, "fetchAttendance": fetchChildAttendance, "dayComponent": ChildDay },
    { "fetchMasks": fetchGroupMasks, "fetchAttendance": fetchGroupAttendance, "dayComponent": GroupDay }];

    return <div className="main-component">
        {props.nav}
        <div className="main-content">
            <MainPreview panelComponent={_mode.type === "Group" ?
                <GroupDataPanel targetId={_mode.groupId} date={_selectedDate} /> :
                <ChildDataPanel targetId={_mode.childId} />} setMode={setMode} mode={_mode} />
            <Calendar targetId={_mode.type === "Child" ? _mode.childId : _mode.groupId}
                context={contexts[_mode.type === "Group" ? 1 : 0]}
                selectedDate={_selectedDate} setDate={setDate} />
        </div>
    </div>
}

export default MainPage;