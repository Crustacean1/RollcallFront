import { useState, useEffect } from 'react';
import apiHandler from '../../Api/Api';
import { GroupDto } from '../../Api/ApiTypes';
import { useSession } from '../Common/Session';
import './GroupPage.css';

import BasicTable from '../Common/Table';
import Button from '../Common/Button';

function GroupPage() {
    const [_groups, setGroups] = useState<GroupDto[]>([]);
    const [_currentName, setCurrentName] = useState("Homary");
    const [_loading, setLoading] = useState(true);

    const _session = useSession();

    let refreshGroup = () => {
        setLoading(true);
        apiHandler.get<GroupDto[]>(_session.token, "group").then(newGroups => {
            setGroups(newGroups);
            setLoading(false);
        });

    }
    useEffect(() => {
        refreshGroup();
    }, []);

    let addGroup = (groupName: string) => {
        apiHandler.post({ "name": groupName }, _session.token, "group").then((newGroup) => {
            refreshGroup();
        })
    }

    let groupDisplay = (group: GroupDto) => { return <tr><td>{group.name}</td><td><Button text="✕" textColor="red" onPress={() => {alert("Usuwanie grup jest zablokowane")}}/></td></tr> }

    return <div className="group-page">
        <h1>Dodaj nową grupe:</h1>
        <div className="inner-group-page">
            <BasicTable
                headers={[{ name: "name", title: "Nazwa grupy" }, { name: "", title: "" }]}
                source={_groups}
                height="30vh"
                loading={_loading}
                class="group-browser"
                displayFunc={groupDisplay}
            />
            <div className="group-form">
                <input type="text" value={_currentName} onChange={(e) => setCurrentName(e.currentTarget.value)} />
                <Button text="Dodaj" onPress={() => addGroup(_currentName)} />
            </div>
        </div>
    </div>
}

export default GroupPage;