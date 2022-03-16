import { useState, useEffect } from 'react';
import apiHandler from '../../Api/Api';
import { GroupDto } from '../../Api/ApiTypes';
import './GroupPage.css';

import BasicTable from '../Common/Table';

function GroupPage(props: { nav: JSX.Element }) {
    let [_groups, setGroups] = useState<GroupDto[]>([]);
    let [_currentName, setCurrentName] = useState("Homary");
    let [_loading, setLoading] = useState(true);

    let refreshGroup = () => {
        setLoading(true);
        apiHandler.fetchGroups().then(newGroups => {
            setGroups(newGroups);
            setLoading(false);
        });

    }
    useEffect(() => {
        refreshGroup();
    }, []);

    let addGroup = (groupName: string) => {
        apiHandler.addGroup(groupName).then((newGroup) => {
            refreshGroup();
        })
    }

    let groupDisplay = (group: GroupDto) => { return <tr><td>{group.name}</td><td><span className="group-eraser"></span></td></tr> }

    return <div className="main-component">
        {props.nav}
        <h1>Dodaj nową grupe:</h1>
        <BasicTable
            headers={["Grupa", ""]}
            source={_groups}
            height="30vh"
            loading={_loading}
            class="group-browser"
            displayFunc={groupDisplay}
        />
        <div className="child-form">
            <input type="text" value={_currentName} onChange={(e) => setCurrentName(e.currentTarget.value)} />
            <span className="add-button" onClick={() => addGroup(_currentName)}>Dodaj</span>
        </div>
    </div>
}

export default GroupPage;