import { useState, useEffect } from 'react';

import fetchApi from '../../Api/Api';
import { ChildDto } from '../../Api/ApiTypes';
import { Loading, TableLoader } from '../Common/Loading';
import { Attendance } from '../../Api/ApiTypes';
import {PreviewMode} from '../Common/Types';
import './ChildPreview.css';

interface ChildPreviewProps {
    token: string;
    mode: PreviewMode;
}

function ChildItem(props: { name: string, surname: string, groupName: string, default: Attendance }) {
    return <tr className="child-row"><td>{props.name}</td><td>{props.surname}</td><td>{props.groupName}</td><td>{"j"}</td></tr>
}

function ChildPreview(props: ChildPreviewProps) {
    let [_children, setChildren] = useState<ChildDto[]>([]);
    let [_loaded, setLoaded] = useState(false);

    useEffect(() => {
        if (!_children || _children.length === 0) {
            fetchApi.fetchChildrenFromGroup(props.mode.childId, props.token)
                .then((children) => {
                    setChildren(children);
                    setLoaded(true);
                }, (error) => {
                    alert(error)
                })
        }
    }
    )
    let key = 0;
    let content = (<tbody>
        {_children.map((child) => <ChildItem key={++key} name={child.name} surname={child.surname} groupName={child.groupId.toString()} default={child.defaultAttendance} />)}
    </tbody>);
    return (<div className="child-preview">
        <h3>Dzieci:</h3>
        <table>
            <thead>
                <tr><th>Imie</th><th>Nazwisko</th><th>Grupa</th><th>Umowa</th></tr>
            </thead>
            <Loading condition={_loaded} target={content} loader={<TableLoader size="5vw" />} />
        </table>
    </div>);
}

export default ChildPreview;