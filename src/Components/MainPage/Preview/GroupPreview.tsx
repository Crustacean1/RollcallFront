import { useState, useEffect } from 'react';

import apiHandler from '../../../Api/Api';
import { GroupDto } from '../../../Api/ApiTypes';
import { PreviewMode } from '../../Common/Types';
import BasicTable from '../../Common/Table';
import './GroupPreview.css';

interface GroupPreviewProps {
    setMode: (mode: PreviewMode) => void;
}

function GroupPreview(props: GroupPreviewProps) {
    let [_groups, setGroups] = useState<GroupDto[]>([]);
    let [_loaded, setLoaded] = useState(false);

    useEffect(() => {
        if (!_groups || _groups.length === 0) {
            apiHandler.fetchGroups().then((newGroups) => {
                var total = [{ "name": "Wszystkie", "id": 0 }];
                setGroups(total.concat(newGroups));
                setLoaded(true);
            })
        }
    });
    let setGroup = (groupId: number) => {
        props.setMode({ "type": "Group", "childId": 0, "groupId": groupId ?? 0 });
    }

    let displayFunc = (group: GroupDto) => (<tr><td onClick={() => setGroup(group.id)}>{group.name}</td></tr>);

    return <div className="group-preview">
        <BasicTable
            headers={[{ name: "", title: "Nazwa groupy" }]}
            source={_groups}
            loading={!_loaded}
            height="100%"
            class="preview-table"
            displayFunc={displayFunc}
        />
    </div>
}

export default GroupPreview;
