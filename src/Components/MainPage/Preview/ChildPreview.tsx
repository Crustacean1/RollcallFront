import { useState, useEffect } from 'react';

import fetchApi from '../../../Api/Api';
import { ChildDto } from '../../../Api/ApiTypes';
import { Loading, TableLoader } from '../../Common/Loading';
import { Attendance } from '../../../Api/ApiTypes';
import { PreviewMode } from '../../Common/Types';
import './ChildPreview.css';
import BasicTable from '../../Common/Table';

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

    let displayFunc = (child: ChildDto) => ChildItem({ name: child.name, surname: child.surname, default: child.defaultAttendance, setMode: () => { selectChild(child.id) } });

    return (<div className="child-preview">
        <BasicTable source={_children}
            headers={["Imię", "Nazwisko", "Śniadanie", "Obiad", "Deser"]}
            class="preview-table"
            height="100%"
            loading={!_loaded}
            displayFunc={displayFunc} />
    </div>);
}

export default ChildPreview;