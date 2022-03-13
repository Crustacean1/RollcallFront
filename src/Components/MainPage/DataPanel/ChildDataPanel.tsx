import { useState, useEffect } from 'react';

import './ChildDataPanel.css';

import apiHandler from '../../../Api/Api';
import { ChildDto, MealDate, AttendanceSummary } from '../../../Api/ApiTypes';
import { Loading, Loader } from '../../Common/Loading';
import { MealName, MealPluralLabels } from '../Day/DayTypes';

interface DataPanelProps {
    targetId: number;
    date: Date;
}

function ChildDataPanel(props: DataPanelProps) {
    const defaultSummary = { breakfast: 0, dinner: 0, desert: 0 };

    let [_child, setChild] = useState<ChildDto>();
    let [_summary, setSummary] = useState<AttendanceSummary>(defaultSummary);
    let [_childLoaded, setChildLoaded] = useState(false);
    let [_summaryLoaded, setSummaryLoaded] = useState(false);

    useEffect(() => {
        setChildLoaded(false);
        setSummaryLoaded(false);
        let active = true;
        apiHandler.fetchChild(props.targetId)
            .then((childDto) => {
                if (active) {
                    setChildLoaded(true);
                    setChild(childDto);
                }
            });
        apiHandler.fetchChildSummary(props.targetId, props.date.getFullYear(), props.date.getMonth() + 1)
            .then((summary) => {
                if (active) {
                    setSummaryLoaded(true);
                    setSummary(summary.meals);
                }
            });

        return () => { active = false; }
    }, [props.targetId])
    let meals: MealName[] = ["breakfast", "dinner", "desert"];

    let content = (<>
        <h2>{_child?.name} {_child?.surname} : {_child?.groupName}</h2>
        <h3>W tym miesiącu:</h3>
        <div className="data-month-summary">
            {meals.map((m, i) => <h4 key={i}>{MealPluralLabels[m]}: {_summary[m]}</h4>)}
        </div>
        <div className="action-panel">
            <span className="data-panel-action">Wyczyść</span>
            <span className="data-panel-action">Przedłuż</span>
        </div>
    </>);

    return <div className="data-panel">
        <Loading condition={_childLoaded && _summaryLoaded} target={content} loader={<Loader size="100px" />} />
    </div>
}

export default ChildDataPanel;