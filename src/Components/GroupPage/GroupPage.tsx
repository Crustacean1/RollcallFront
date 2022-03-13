import { useState, useEffect } from 'react';
import apiHandler from '../../Api/Api';
import { GroupDto } from '../../Api/ApiTypes';
import './GroupPage.css';

function GroupPage(props: { nav: JSX.Element }) {
    let [_groups, setGroups] = useState<GroupDto[]>([]);
    let [_currentName, setCurrentName] = useState("Homary");

    useEffect(() => {
        let active = true;
        apiHandler.fetchGroups().then(newGroups => {
            if (!active) { return; }
            setGroups(newGroups);
        });
        return () => { active = false; }
    },[]);

    let addGroup = (groupName: string) => {
        apiHandler.addGroup(groupName).then((newGroup) => {
            let updatedGroups = Object.assign({}, _groups);
            updatedGroups.push(newGroup);
            setGroups(updatedGroups);
            alert("Grupa dodana!");
        })
    }

    return <div className="main-component">
        {props.nav}
        <h1>Dodaj nową grupe:</h1>
        <div className="child-form">
            <input type="text" value={_currentName} onChange={(e) => setCurrentName(e.currentTarget.value)} />
            <span className="add-button" onClick={() => addGroup(_currentName)}>Dodaj</span>
        </div>
    </div>
}

export default GroupPage;