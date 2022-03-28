import { useState, useEffect } from 'react';
import apiHandler from '../../Api/Api';
import BasicTable from '../Common/Table';
import './SummaryPage.css';
import {ChildSummaryData} from '../Common/Types'

interface SummaryHeaderProps {
    year: number;
    month: number;
    prevMonth: () => void;
    nextMonth: () => void;
}

function SummaryHeader(props: SummaryHeaderProps) {
    return <div className="summary-header">
        <div className="summary-navigation">
            <span className="prev-summary" onClick={props.prevMonth}></span>
            <h1>Podsumowanie miesiąca: {props.year} - {props.month}</h1>
            <span className="next-summary" onClick={props.nextMonth}></span>
        </div>
        <span className="summary-extend-button">Przedłuż obecność</span>
    </div>
}

function SummaryPage(props: { nav: JSX.Element }) {
    let [_children, setChildren] = useState<ChildSummaryData[]>([]);
    let [_loading, setLoading] = useState(false);
    let [_date, setDate] = useState(new Date());

    useEffect(() => {
        let isActive = true;
        setLoading(true);
        setChildren([]);
        apiHandler.fetchTotalSummary(_date.getFullYear(), _date.getMonth() + 1)
            .then((response) => {
                if (!isActive) { return; }
                setChildren(response.map(r => {
                    return {
                        name: r.name,
                        surname: r.surname,
                        id: r.childId,
                        groupName: r.groupName,
                        breakfast: r.summary.breakfast,
                        dinner: r.summary.dinner,
                        desert: r.summary.desert
                    }
                }));
                setLoading(false);
            }, (status) => {
                alert("In SummaryPage: " + status);
            })
        return () => { isActive = false; }
    }, [_date])

    let displayChild = (child: ChildSummaryData) => (<tr>
        <td>{child.groupName}</td>
        <td>{child.name}</td>
        <td>{child.surname}</td>
        <td>{child.breakfast}</td>
        <td>{child.dinner}</td>
        <td>{child.desert}</td>
    </tr>);
    let changeMonth = (dir: number) => {
        var newDate = new Date(_date.setMonth(_date.getMonth() + dir));
        setDate(newDate);
    }

    return <div className="summary-page">
        {props.nav}
        <SummaryHeader year={_date.getFullYear()} month={_date.getMonth() + 1}
            prevMonth={() => changeMonth(-1)} nextMonth={() => changeMonth(1)} />
        <BasicTable
            headers={[
                { "name": "groupName", "title": "Grupa" },
                { "name": "name", "title": "Imię" },
                { "name": "surname", "title": "Nazwisko" },
                { "name": "breakfast", "title": "Śniadanie" },
                { "name": "dinner", "title": "Obiad" },
                { "name": "desert", "title": "Deser" }]}
            source={_children}
            loading={_loading}
            class="child-summary"
            height="auto"
            displayFunc={displayChild}
        />
    </div>
}

export default SummaryPage;