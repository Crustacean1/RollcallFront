import { useState, useEffect } from 'react';

import fetchApi from '../../../Api/Api';
import { ChildDto } from '../../../Api/ApiTypes';
import { Loading, TableLoader } from '../../Common/Loading';
import { Attendance } from '../../../Api/ApiTypes';
import { PreviewMode } from '../../Common/Types';
import './ChildPreview.css';

interface ChildPreviewProps {
    mode: PreviewMode;
    setMode: (mode: PreviewMode) => void;
}

function ChildItem(props: { name: string, surname: string, default: Attendance, setMode: () => void }) {
    return <tr className="child-row" onClick={props.setMode}>
        <td>{props.name}</td>
        <td>{props.surname}</td>
        <td>{props.default.breakfast ? "✅" : "❌"}</td>
        <td>{props.default.dinner ? "✅" : "❌"}</td>
        <td>{props.default.desert ? "✅" : "❌"}</td>
    </tr>
}

function ChildPreview(props: ChildPreviewProps) {
    let [_children, setChildren] = useState<ChildDto[]>([]);
    let [_loaded, setLoaded] = useState(false);

    useEffect(() => {
        let active = true;
        if (props.mode.type !== "Child") {
            setLoaded(false);
            fetchApi.fetchChildrenFromGroup(props.mode.groupId)
                .then((children) => {
                    if (active) {
                        setChildren(children);
                        setLoaded(true);
                    }
                }, (error) => {
                    alert(error)
                })
        }
        return () => { active = false; }
    }, [props.mode])

    let selectChild = (childId: number) => {
        props.setMode({ "type": "Child", "groupId": props.mode.groupId, "childId": childId });
    }

    let key = 0;
    let content = (<tbody>
        {_children.map((child) => <ChildItem key={++key} name={child.name} surname={child.surname} setMode={() => { selectChild(child.id); }}
            default={child.defaultAttendance} />)}
    </tbody>);
    return (<div className="child-preview">
        <h3>Dzieci:</h3>
        <div className="preview-table">
            <table>
                <thead>
                    <tr><th>Imie</th><th>Nazwisko</th><th>Śniadanie</th><th>Obiad</th><th>Deser</th></tr>
                </thead>
                <Loading condition={_loaded} target={content} loader={<TableLoader span={6} size="5vw" />} />
            </table>
        </div>
    </div>);
}

export default ChildPreview;