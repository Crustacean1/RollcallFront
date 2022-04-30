import './ChildrenList.css';

import { useState, useEffect } from 'react';

import apiHandler from '../../Api/Api';
import { ChildDto, ChildAttendanceDto } from '../../Api/ApiTypes';
import '../Common/Table';
import BasicTable from '../Common/Table';
import { MealName } from '../MainPage/Day/DayTypes';
import { useSession } from '../Common/Session';


function ChildrenList(props: { newest: number }) {
    const [_children, setChildren] = useState<ChildDto[]>([]);
    const [_loading, setLoading] = useState<boolean>(true);

    const _session = useSession();

    useEffect(() => {
        setChildren([]);
        apiHandler.get<ChildDto[]>(_session.token, "child", "group", ...apiHandler.toStringArray(0))
            .then(children => {
                setChildren(children);
                setLoading(false);
            })
    }, [props.newest]);

    let changeAttendance = (childId: number, mealName: string, value: boolean) => {
        apiHandler.post<ChildAttendanceDto>({ name: mealName, present: value }, _session.token, "child", ...apiHandler.toStringArray(childId))
            .then(response => {
                let newChildren: ChildDto[] = Object.assign([], _children);
                let child = newChildren.find(c => c.id === childId);
                if (child) {
                    for (let meal in response) {
                        child.defaultAttendance[meal as MealName] = response[meal];
                    }
                    setChildren(newChildren);
                }
            })
    }

    let renderMeal = (childId: number, meal: string, value: boolean) => <input type="checkbox" checked={(value === true)} onChange={(e) => changeAttendance(childId, meal, e.currentTarget.checked)} />
    let renderChild = (child: ChildDto) => {
        return <tr key={`${child.name}-${child.surname}`}>
            <td>{child.name}</td>
            <td>{child.surname}</td>
            <td>{child.groupName}</td>
            <td>{renderMeal(child.id, "breakfast", child.defaultAttendance.breakfast)}</td>
            <td>{renderMeal(child.id, "dinner", child.defaultAttendance.dinner)}</td>
            <td>{renderMeal(child.id, "desert", child.defaultAttendance.desert)}</td>
            <td><span className="child-eraser"></span></td>
        </tr>
    }

    return <BasicTable headers={[{ name: "name", title: "Imię" },
    { name: "surname", title: "Nazwisko" },
    { name: "groupName", title: "Grupa" },
    { name: "", title: "Śniadanie" },
    { name: "", title: "Obiad" },
    { name: "", title: "Deser" },
    { name: "", title: "" }]}
        source={_children}
        displayFunc={renderChild}
        class="children-list"
        height="50vh"
        loading={_loading} />;

}

export default ChildrenList;