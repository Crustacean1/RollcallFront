import { useState, useEffect } from 'react';

import apiHandler from '../../../Api/Api';
import { GroupDto } from '../../../Api/ApiTypes';
import { PreviewMode } from '../../Common/Types';
import BasicTable from '../../Common/Table';

import { useSession } from '../../Common/Session';

import './GroupPreview.css';

interface GroupPreviewProps {
    setMode: (update: (mode: PreviewMode) => PreviewMode) => void;
}

function GroupPreview(props: GroupPreviewProps) {
    const [_groups, setGroups] = useState<GroupDto[]>([]);
    const [_loaded, setLoaded] = useState(false);

    const _session = useSession();

    useEffect(() => {
        if (!_groups || _groups.length === 0) {
            apiHandler.get<GroupDto[]>(_session.token, "group")
                .then((newGroups) => {
                    var total = [{ "name": "Wszystkie", "id": 0 }];
                    setGroups(total.concat(newGroups));
                    setLoaded(true);
                })
        }
    });
    let setGroup = (groupId: number) => {
        props.setMode(mode => { return { "type": "Group", "childId": 0, "groupId": groupId ?? 0 } });
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
