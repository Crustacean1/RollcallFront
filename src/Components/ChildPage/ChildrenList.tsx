import './ChildrenList.css';

import { useState, useEffect } from 'react';

import apiHandler from '../../Api/Api';
import { ChildDto } from '../../Api/ApiTypes';
import { TableLoader, Loading } from '../Common/Loading';


function ChildrenList(props: { newest: number }) {
    let [children, setChildren] = useState<ChildDto[]>([]);

    useEffect(() => {
        setChildren([]);
        apiHandler.fetchChildrenFromGroup(0)
            .then(children => {
                setChildren(children);
            })
    }, [props.newest]);

    let renderMeal = (value: boolean) => <input type="checkbox" checked={value}/>
    let childrenList = children.map(c => <tr key={c.id}>
        <td>{c.name}</td>
        <td>{c.surname}</td>
        <td>{c.groupName}</td>
        <td>{renderMeal(c.defaultAttendance.breakfast)}</td>
        <td>{renderMeal(c.defaultAttendance.dinner)}</td>
        <td>{renderMeal(c.defaultAttendance.desert)}</td>
        <td><span className="child-eraser"></span></td>
    </tr>);
    let childrenTable = <div className="outer-child-list"><table className="children-list">
        <thead>
            <tr>
                <th>Imię</th>
                <th>Nazwisko</th>
                <th>Grupa</th>
                <th>Śniadania</th>
                <th>Obiady</th>
                <th>Desery</th>
                <th></th>
            </tr>
        </thead>
        <Loading condition={children.length !== 0} target={<tbody>{childrenList}</tbody>} loader={<TableLoader span={7} size="7vw" />} />
    </table>
    </div>
    return childrenTable;
}

export default ChildrenList;