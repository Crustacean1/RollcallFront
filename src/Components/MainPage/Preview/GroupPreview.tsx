import { useState, useEffect } from 'react';

import apiHandler from '../../../Api/Api';
import { GroupDto } from '../../../Api/ApiTypes';
import { Loading, TableLoader } from '../../Common/Loading';
import { PreviewMode } from '../../Common/Types';
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

    let key = 0;
    let content = (<tbody>
        {_groups.map((group) =>
            <tr key={++key} onClick={() => setGroup(group.id)}><td>{group.name}</td></tr>)}
    </tbody>)

    return <div className="group-preview">
        <h3>Grupy:</h3>
        <div className="preview-table">
            <table>
                <thead>
                    <tr><th>Nazwa</th></tr>
                </thead>
                <Loading condition={_loaded} target={content} loader={<TableLoader span={6} size="5vw" />} />
            </table>
        </div>
    </div>
}

export default GroupPreview;
