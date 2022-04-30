import { useState, useEffect } from 'react';

import './GroupDataPanel.css';

import apiHandler from '../../../Api/Api';
import { GroupDto, AttendanceCountDto } from '../../../Api/ApiTypes';
import { Loading, Loader } from '../../Common/Loading';
import { MealName, MealPluralLabels } from '../Day/DayTypes';
import { useSession } from '../../Common/Session';

interface DataPanelProps {
    setMonthCount: (update: AttendanceCountDto) => void;
    monthCount: AttendanceCountDto;
    targetId: number;
    date: Date;
}


function GroupDataPanel({ setMonthCount, monthCount, targetId, date }: DataPanelProps) {

    const [_group, setGroup] = useState<GroupDto>();
    const [_groupLoaded, setGroupLoaded] = useState(false);
    const [_summaryLoaded, setSummaryLoaded] = useState(false);

    const _session = useSession();

    useEffect(() => {
        setSummaryLoaded(false);
        setGroupLoaded(false);

        var active = true;

        apiHandler.get<GroupDto>(_session.token, "group", ...apiHandler.toStringArray(targetId))
            .then((groupDto) => {
                if (!active) { return }
                setGroup(groupDto);
                setGroupLoaded(true);
            }, (error) => {
            });

        apiHandler.get<AttendanceCountDto>(_session.token, "attendance", "group", "monthly",
            ...apiHandler.toStringArray(targetId, date.getFullYear(), date.getMonth() + 1))
            .then((summary) => {
                if (active) {
                    setSummaryLoaded(true);
                    setMonthCount(summary);
                }
            });
        return () => { active = false; }
    }, [targetId, setMonthCount, _session, date])

    let meals: MealName[] = ["breakfast", "dinner", "desert"];

    let content = (<>
        <h2>Grupa: {_group?.name}</h2>
        <h3>W tym miesiącu:</h3>
        <div className="data-month-summary">
            {meals.map((m, i) => <h4 key={i}> {MealPluralLabels[m]} : {monthCount[m]}</h4>)}
        </div>
    </>);
    return <div className="data-panel group-panel">
        <Loading condition={_groupLoaded && _summaryLoaded} target={content} loader={<Loader size="100px" />} />
    </div>
}

export default GroupDataPanel;