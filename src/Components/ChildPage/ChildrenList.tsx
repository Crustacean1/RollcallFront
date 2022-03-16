import './ChildrenList.css';

import { useState, useEffect } from 'react';

import apiHandler from '../../Api/Api';
import { ChildDto } from '../../Api/ApiTypes';
import '../Common/Table';
import BasicTable from '../Common/Table';


function ChildrenList(props: { newest: number }) {
    let [_children, setChildren] = useState<ChildDto[]>([]);
    let [_loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        setChildren([]);
        apiHandler.fetchChildrenFromGroup(0)
            .then(children => {
                setChildren(children);
                setLoading(false);
            })
    }, [props.newest]);

    let renderMeal = (value: boolean) => <input type="checkbox" checked={value} />
    let renderChild = (child: ChildDto) => {
        return <tr>
            <td>{child.name}</td>
            <td>{child.surname}</td>
            <td>{renderMeal(child.defaultAttendance.breakfast)}</td>
            <td>{renderMeal(child.defaultAttendance.dinner)}</td>
            <td>{renderMeal(child.defaultAttendance.desert)}</td>
            <td><span className="child-eraser"></span></td>
        </tr>
    }

    return <BasicTable headers={["Imię", "Nazwisko", "Śniadanie", "Obiad", "Deser",""]}
        source={_children}
        displayFunc={renderChild}
        class="children-list"
        height="50vh"
        loading={_loading} />;

}

export default ChildrenList;