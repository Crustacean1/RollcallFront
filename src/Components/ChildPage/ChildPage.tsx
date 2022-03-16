import './ChildPage.css';
import { useEffect, useState } from 'react';
import apiHandler from '../../Api/Api';
import { MealAttendance, GroupDto } from '../../Api/ApiTypes';
import ChildrenList from './ChildrenList';

type MealName = "breakfast" | "dinner" | "desert";

function ChildPage(props: { nav: JSX.Element }) {

    let [_groups, setGroups] = useState<GroupDto[]>([]);

    let [_currentGroupId, setCurrentId] = useState(0);
    let [_currentName, setName] = useState("Karol");
    let [_currentSurname, setSurname] = useState("Wojtyła");
    let [_currentAttendance, setAttendance] = useState<MealAttendance[]>([]);

    let [_newChildId, setNewId] = useState(0);

    useEffect(() => {
        let active = true;
        apiHandler.fetchGroups().then((newGroups) => {
            if (active) {
                setGroups(newGroups)
                setCurrentId(newGroups[0].id);
            }
        });
        return () => {
            active = false;
        }
    }, []);

    let mealNames = { "breakfast": "Śniadanie", "dinner": "Obiad", "desert": "Deser" };

    let meals: MealName[] = ["breakfast", "dinner", "desert"];

    let addMeal = (name: string, value: boolean) => {
        let newAttendance = Object.assign([], _currentAttendance);
        let prev = _currentAttendance.find(a => a.name == name);
        if (prev == null) {
            newAttendance.push({ name: name, present: value });
        }
        else {
            prev.present = value;
        }
        setAttendance(newAttendance);
    }

    let submitChildren = () => {
        let dto = { "breakfast": false, "dinner": false, "desert": false };
        for (let meal of _currentAttendance) {
            dto[meal.name as MealName] = meal.present;
        }
        apiHandler.addChild(_currentName, _currentSurname, _currentGroupId, dto)
            .then((success) => {
                setNewId(_newChildId + 1);
            })
    }

    return <div className="main-component">
        {props.nav}
        <ChildrenList newest={_newChildId} />
        <h1>Dodaj dzieciaka:</h1>
        <div className="child-form">
            <input className="child-name" type="text" value={_currentName} onChange={(e) => setName(e.currentTarget.value)} />
            <input className="child-surname" type="text" value={_currentSurname} onChange={(e) => setSurname(e.currentTarget.value)} />
            <select onChange={e => setCurrentId(parseInt(e.currentTarget.value))}>
                {_groups.map(g => <option value={g.id}>{g.name}</option>)}
            </select>

            {meals.map(m => <><label htmlFor={m}>{mealNames[m as MealName]}</label><input id={m} type="checkbox" onClick={e => { addMeal(m, e.currentTarget.checked) }} /></>)}
            <span className="add-button" onClick={e => submitChildren()}>Dodaj</span>
        </div>
    </div>
}

export default ChildPage;