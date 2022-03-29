import { useState, useEffect, useCallback } from 'react';
import apiHandler from '../../Api/Api';
import BasicTable from '../Common/Table';
import './SummaryPage.css';
import { ChildAttendanceSummary } from '../../Api/ApiTypes';

interface SummaryHeaderProps {
    year: number;
    month: number;
    prevMonth: () => void;
    nextMonth: () => void;
    refresh: () => void;
}

function SummaryHeader(props: SummaryHeaderProps) {
    let extend = () => {
        apiHandler.extendAttendance(props.year, props.month)
            .then((response) => { props.refresh(); alert("Przedłużono " + response.updated + " umów") })

    }

    return <div className="summary-header">
        <div className="summary-navigation">
            <span className="prev-summary" onClick={props.prevMonth}></span>
            <h1>Podsumowanie miesiąca: {props.year} - {props.month}</h1>
            <span className="next-summary" onClick={props.nextMonth}></span>
        </div>
        <span className="summary-extend-button" onClick={extend}>Przedłuż obecność</span>
    </div>
}

function SummaryPage(props: { nav: JSX.Element }) {
    let [_children, setChildren] = useState<ChildAttendanceSummary[]>([]);
    let [_loading, setLoading] = useState(false);
    let [_date, setDate] = useState(new Date());

    let refresh = useCallback((isActive: boolean) => {
        setLoading(true);
        setChildren([]);
        apiHandler.fetchMonthlySummary(_date.getFullYear(), _date.getMonth() + 1)
            .then((response) => {
                if (!isActive) { return; }
                setChildren(response);
                setLoading(false);
            }, (status) => {
                alert("Error: In SummaryPage: " + status);
            })
    }, [_date]);

    useEffect(() => {
        let isActive = true;
        refresh(isActive);
        return () => { isActive = false; }
    }, [_date, refresh])

    let displayChild = (child: ChildAttendanceSummary) => (<tr>
        <td>{child.groupName}</td>
        <td>{child.name}</td>
        <td>{child.surname}</td>
        <td>{child.summary.breakfast}</td>
        <td>{child.summary.dinner}</td>
        <td>{child.summary.desert}</td>
    </tr>);

    let changeMonth = (dir: number) => {
        var newDate = new Date(_date);
        newDate.setDate(1);
        newDate = new Date(newDate.setMonth(newDate.getMonth() + dir));
        setDate(newDate);
    }

    return <div className="summary-page">
        {props.nav}
        <SummaryHeader refresh={() => refresh(true)} year={_date.getFullYear()} month={_date.getMonth() + 1}
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