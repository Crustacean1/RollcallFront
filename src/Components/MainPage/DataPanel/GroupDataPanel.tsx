import { useState, useEffect } from 'react';

import './GroupDataPanel.css';

import apiHandler from '../../../Api/Api';
import { GroupDto } from '../../../Api/ApiTypes';
import { Loading, Loader } from '../../Common/Loading';
import { MealName, MealPluralLabels } from '../Day/DayTypes';
import { MonthCount } from '../MainPage';

interface DataPanelProps {
    setMonthCount: (arg: MonthCount) => void;
    monthCount: MonthCount;
    targetId: number;
    date: Date;
}

function GroupDataPanel(props: DataPanelProps) {

    let [_group, setGroup] = useState<GroupDto>();
    let [_groupLoaded, setGroupLoaded] = useState(false);
    let [_summaryLoaded, setSummaryLoaded] = useState(false);

    useEffect(() => {
        setSummaryLoaded(false);
        setGroupLoaded(false);

        var active = true;

        apiHandler.fetchGroup(props.targetId)
            .then((groupDto) => {
                if (!active) { return }
                setGroup(groupDto);
                setGroupLoaded(true);
            }, (error) => {
            });

        apiHandler.getGroupMonthlyCount(props.targetId, props.date.getFullYear(), props.date.getMonth() + 1)
            .then((summary) => {
                if (!active) { return }
                props.setMonthCount(summary.meals);
                setSummaryLoaded(true);
            }, (error) => {
            });

        return () => { active = false; }
    }, [props.targetId, props.date])

    let meals: MealName[] = ["breakfast", "dinner", "desert"];

    let content = (<>
        <h2>Grupa: {_group?.name}</h2>
        <h3>W tym miesiącu:</h3>
        <div className="data-month-summary">
            {meals.map((m, i) => <h4 key={i}> {MealPluralLabels[m]} : {props.monthCount[m]}</h4>)}
        </div>
    </>);
    return <div className="data-panel group-panel">
        <Loading condition={_groupLoaded && _summaryLoaded} target={content} loader={<Loader size="100px" />} />
    </div>
}

export default GroupDataPanel;