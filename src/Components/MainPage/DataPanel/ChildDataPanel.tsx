import { useState, useEffect } from 'react';

import './ChildDataPanel.css';

import apiHandler from '../../../Api/Api';
import { ChildDto, AttendanceCountDto } from '../../../Api/ApiTypes';
import { Loading, Loader } from '../../Common/Loading';
import { MealName, MealPluralLabels } from '../Day/DayTypes';
import { useSession } from '../../Common/Session';

interface DataPanelProps {
    targetId: number;
    date: Date;
    setMonthCount: (update: AttendanceCountDto) => void;
    monthCount: AttendanceCountDto;
}

function ChildDataPanel({ targetId, date, setMonthCount, monthCount }: DataPanelProps) {
    const [_child, setChild] = useState<ChildDto>();
    const [_childLoaded, setChildLoaded] = useState(false);
    const [_summaryLoaded, setSummaryLoaded] = useState(false);

    const _session = useSession();

    useEffect(() => {
        setChildLoaded(false);
        setSummaryLoaded(false);
        let active = true;
        apiHandler.get<ChildDto>(_session.token, "child", ...apiHandler.toStringArray(targetId))
            .then((childDto) => {
                if (active) {
                    setChildLoaded(true);
                    setChild(childDto);
                }
            });
        apiHandler.get<AttendanceCountDto>(_session.token, "attendance", "child", "monthly",
            ...apiHandler.toStringArray(targetId, date.getFullYear(), date.getMonth() + 1))
            .then((summary) => {
                if (active) {
                    setSummaryLoaded(true);
                    setMonthCount(summary);
                }
            });
        return () => { active = false; }
    }, [targetId, _session, setMonthCount, date])
    let meals: MealName[] = ["breakfast", "dinner", "desert"];

    let content = (<>
        <h2>Uczeń: {_child?.name} {_child?.surname}, {_child?.groupName}</h2>
        <h3>W tym miesiącu:</h3>
        <div className="data-month-summary">
            {meals.map((m, i) => <h4 key={i}>{MealPluralLabels[m]}: {monthCount[m]}</h4>)}
        </div>
    </>);

    return <div className="data-panel child-panel">
        <Loading condition={_childLoaded && _summaryLoaded} target={content} loader={<Loader size="100px" />} />
    </div>
}

export default ChildDataPanel;