import { useState, useEffect } from 'react';

import apiHandler from '../../Api/Api';
import { GroupDto } from '../../Api/ApiTypes';
import { Loading, TableLoader } from '../Common/Loading';
import { PreviewMode } from '../Common/Types';
import './GroupPreview.css';

interface GroupPreviewProps {
    token: string;
    setMode: (mode: PreviewMode) => void;
}

function GroupPreview(props: GroupPreviewProps) {
    let [_groups, setGroups] = useState<GroupDto[]>([]);
    let [_loaded, setLoaded] = useState(false);

    useEffect(() => {
        if (!_groups || _groups.length === 0) {
            apiHandler.fetchGroups(props.token).then((newGroups) => {
                var total = [{ "name": "Wszystkie", "groupId": 0 }];
                setGroups(newGroups.concat(total));
                setLoaded(true);
            })
        }
    });

    let content = <tbody>{_groups.map((group) => <tr><td>{group.name}</td></tr>)}</tbody>
    return <div className="group-preview">
        <h3>Grupy:</h3>
        <table>
            <thead>
                <tr><th>Name</th></tr>
            </thead>
            <Loading condition={_loaded} target={content} loader={<TableLoader size="5vw" />} />
        </table>
    </div>
}

export default GroupPreview;
