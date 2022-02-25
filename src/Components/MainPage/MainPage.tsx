import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import './MainPage.css';
import Calendar from './Calendar';
import ChildDay, { fetchChildAttendance, fetchChildMasks } from './Day';
import { PreviewMode } from '../Common/Types';
import MainPreview from './MainPreview';

import { getTokenFromStorage } from '../Common/Session';

function MainPage(props: { nav: JSX.Element }) {

    let navigate = useNavigate();

    let [_mode, setMode] = useState<PreviewMode>({ "type": "Group", "groupId": 0, "childId": 0 });
    let [_token, setToken] = useState<string>(getTokenFromStorage());

    useEffect(() => {
        if (!_token) {
            navigate("/login");
        }
    }, [navigate])

    var now = new Date();
    var emptySource = { "mealCounts": [], "mealMasks": [] }

    return <div className="main-component">
        {props.nav}
        <div className="main-content">
            <MainPreview token={_token} setMode={setMode} mode={_mode} />
            <Calendar year={now.getFullYear()} month={now.getMonth() + 1} token={_token} targetId={1}
                context={{
                    "fetchMasks": fetchChildMasks,
                    "fetchAttendance": fetchChildAttendance,
                    "dayComponent": ChildDay
                }} />
        </div>
    </div>
}

export default MainPage;