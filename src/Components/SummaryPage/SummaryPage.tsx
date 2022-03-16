import { useState, useEffect } from 'react';
import apiHandler from '../../Api/Api';
import { AttendanceSummary } from '../../Api/ApiTypes';

function SummaryPage(props: { nav: JSX.Element }) {
    let [_children, setChildren] = useState<AttendanceSummary[]>([]);

    return <div className="summary-page">
        {props.nav}
        <h1>Welcome to summary page</h1>
    </div>
}

export default SummaryPage;