import './ChildPage.css';
import { useEffect, useState } from 'react';
import apiHandler from '../../Api/Api';
import { ChildAttendanceDto, GroupDto } from '../../Api/ApiTypes';
import ChildrenList from './ChildrenList';
import { useSession } from '../Common/Session';
import Button from '../Common/Button';

type MealName = "breakfast" | "dinner" | "desert";

function ChildPage() {

    const [_groups, setGroups] = useState<GroupDto[]>([]);

    const [_currentGroupId, setCurrentId] = useState(0);
    const [_currentName, setName] = useState("Karol");
    const [_currentSurname, setSurname] = useState("Wojtyła");
    const [_currentAttendance, setAttendance] = useState<ChildAttendanceDto>({});

    const [_newChildId, setNewId] = useState(0);

    const _session = useSession();

    useEffect(() => {
        let active = true;
        apiHandler.get<GroupDto[]>(_session.token, "group").then((newGroups) => {
            if (active) {
                setGroups(newGroups)
                setCurrentId(newGroups[0].id);
            }
        });
        return () => {
            active = false;
        }
    }, [_session]);

    let mealNames = { "breakfast": "Śniadanie", "dinner": "Obiad", "desert": "Deser" };

    let meals: MealName[] = ["breakfast", "dinner", "desert"];

    let addMeal = (name: string, value: boolean) => {
        let newAttendance = { ..._currentAttendance };
        newAttendance[name] = value;
        setAttendance(newAttendance);
    }

    let submitChildren = () => {
        apiHandler.post<number>({
            "name": _currentName,
            "surname": _currentSurname,
            "groupId": _currentGroupId,
            "defaultMeals": _currentAttendance
        }, _session.token, "child")
            .then((newChildId) => {
                setNewId(newChildId);
                setName("Karol");
                setSurname("Wojtyła");
                setAttendance({});
            })
    }

    return <div className="child-page">
        <h1>Dodaj nowego ucznia:</h1>
        <div className="child-inner-page">
            <ChildrenList newest={_newChildId} />
            <div className="child-form">
                <div>
                    <div>
                        <input className="child-name" type="text" value={_currentName} onChange={(e) => setName(e.currentTarget.value)} />
                        <input className="child-surname" type="text" value={_currentSurname} onChange={(e) => setSurname(e.currentTarget.value)} />
                        <select onChange={e => setCurrentId(parseInt(e.currentTarget.value))}>
                            {_groups.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
                        </select>
                    </div>
                    <div className="meal-selection">
                        {meals.map(m => <div className="default-meal-selection" key={m}>
                            <label htmlFor={m}>{mealNames[m as MealName]}</label><input id={m} type="checkbox" onClick={e => { addMeal(m, e.currentTarget.checked) }} />
                        </div>)}
                    </div>
                </div>

                <Button text="Dodaj" onPress={() => submitChildren()} />

            </div>
        </div>
    </div>
}

export default ChildPage;
