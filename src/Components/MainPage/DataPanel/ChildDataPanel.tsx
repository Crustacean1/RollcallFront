import { useState, useEffect } from 'react';

import './ChildDataPanel.css';

import apiHandler from '../../../Api/Api';
import { ChildDto } from '../../../Api/ApiTypes';
import { Loading, Loader } from '../../Common/Loading';
import { MealName, MealPluralLabels } from '../Day/DayTypes';
import { MonthCount } from '../MainPage';

interface DataPanelProps {
    targetId: number;
    date: Date;
    setMonthCount: (arg: MonthCount) => void;
    monthCount: MonthCount;
}

function ChildDataPanel(props: DataPanelProps) {
    let [_child, setChild] = useState<ChildDto>();
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

        apiHandler.getChildMonthlyCount(props.targetId, props.date.getFullYear(), props.date.getMonth() + 1)
            .then((summary) => {
                if (active) {
                    setSummaryLoaded(true);
                    props.setMonthCount(summary.meals);
                }
            });

        return () => { active = false; }
    }, [props.targetId, props.date])
    let meals: MealName[] = ["breakfast", "dinner", "desert"];

    let content = (<>
        <h2>{_child?.name} {_child?.surname} : {_child?.groupName}</h2>
        <h3>W tym miesiącu:</h3>
        <div className="data-month-summary">
            {meals.map((m, i) => <h4 key={i}>{MealPluralLabels[m]}: {props.monthCount[m]}</h4>)}
        </div>
    </>);

    return <div className="data-panel child-panel">
        <Loading condition={_childLoaded && _summaryLoaded} target={content} loader={<Loader size="100px" />} />
    </div>
}

export default ChildDataPanel;