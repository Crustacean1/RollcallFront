import { useState, useEffect, useCallback } from 'react';
import apiHandler from '../../Api/Api';
import BasicTable from '../Common/Table';
import './SummaryPage.css';
import { AttendanceCountDto } from '../../Api/ApiTypes';
import { useSession } from '../Common/Session';
import { MealNames } from '../MainPage/Day/DayTypes';

interface SummaryHeaderProps {
    year: number;
    month: number;
    prevMonth: () => void;
    nextMonth: () => void;
    refresh: () => void;
}

interface ChildAttendanceSummary {
    name: string;
    surname: string;
    groupName: string;
    summary: AttendanceCountDto;
}

function SummaryHeader(props: SummaryHeaderProps) {
    const _session = useSession();

    let extend = () => {
        apiHandler.sendRequest<{ updated: number }>("POST", {}, _session.token, "attendance", "group", "extend", ...apiHandler.toStringArray(props.year, props.month))
            .then((response) => {
                props.refresh();
                alert("Przedłużono " + response.updated + " umów")
            })
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
    const [_children, setChildren] = useState<ChildAttendanceSummary[]>([]);
    const [_loading, setLoading] = useState(false);
    const [_date, setDate] = useState(new Date());

    const _session = useSession();

    let refresh = useCallback((isActive: boolean) => {
        setLoading(true);
        setChildren([]);
        apiHandler.sendRequest<ChildAttendanceSummary[]>("GET", {}, _session.token, "attendance", "group", "summary",
            ...apiHandler.toStringArray(_date.getFullYear(), _date.getMonth() + 1))
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
        {MealNames.map(n => <td>{child.summary[n]}</td>)}
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