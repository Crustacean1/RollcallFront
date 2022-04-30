import { useState, useEffect } from 'react';

import fetchApi from '../../../Api/Api';
import { ChildDto, ChildAttendanceDto } from '../../../Api/ApiTypes';
import { PreviewMode } from '../../Common/Types';
import BasicTable from '../../Common/Table';
import { MealNames } from '../Day/DayTypes';

import { useSession } from '../../Common/Session';

import './ChildPreview.css';

interface ChildPreviewProps {
    mode: PreviewMode;
    setMode: (update: (mode: PreviewMode) => PreviewMode) => void;
}

function ChildItem(props: { name: string, surname: string, default: ChildAttendanceDto, setMode: () => void }) {
    return <tr className="child-row" onClick={props.setMode}>
        <td>{props.name}</td>
        <td>{props.surname}</td>
        {MealNames.map(meal => <td>{props.default[meal] ? "✅" : "❌"}</td>)}
    </tr>
}

function ChildPreview(props: ChildPreviewProps) {
    const [_children, setChildren] = useState<ChildDto[]>([]);
    const [_loaded, setLoaded] = useState(false);

    const _session = useSession();

    useEffect(() => {
        let active = true;
        if (props.mode.type !== "Child") {
            setLoaded(false);
            fetchApi.get<ChildDto[]>(_session.token, "child")
                .then((children) => {
                    if (active) {
                        setChildren(children);
                        setLoaded(true);
                    }
                }, (error) => {
                    _session.invalidateSession(); // TODO: Obsługa innych błędów
                    alert("Sesja wygasła, zaloguj się ponownie");
                })
        }
        return () => { active = false; }
    }, [props.mode])

    let selectChild = (childId: number) => {
        props.setMode(mode => {return { "type": "Child", "groupId": props.mode.groupId, "childId": childId }});
    }

    let displayFunc = (child: ChildDto) => ChildItem({ name: child.name, surname: child.surname, default: child.defaultAttendance, setMode: () => { selectChild(child.id) } });

    return (<div className="child-preview">
        <BasicTable source={_children}
            headers={[{ name: "name", title: "Imię" },
            { name: "surname", title: "Nazwisko" },
            { name: "", title: "Śniadanie" },
            { name: "", title: "Obiad" },
            { name: "", title: "Deser" }]}

            class="preview-table"
            height="100%"
            loading={!_loaded}
            displayFunc={displayFunc} />
    </div>);
}

export default ChildPreview;