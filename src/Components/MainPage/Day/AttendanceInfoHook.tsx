import { MealAttendance } from '../../../Api/ApiTypes';
import { DayInfo, MealNames, MealName, MealUpdateFunction } from './DayTypes';
import { useState } from 'react';

function copyDayInfo(info: DayInfo): DayInfo {
    let newInfo = Object.assign({}, info);
    for (let name of MealNames) {
        newInfo[name] = Object.assign({}, info[name]);
    }
    return newInfo;
}

function startLoadingMeals(info: DayInfo, names: MealName[]): DayInfo {
    let newInfo = copyDayInfo(info);
    for (let name of names) {
        newInfo[name].loading = true;
    }
    return newInfo;
}

function setUpdatedMeals(info: DayInfo, updates: MealAttendance[], updateFunc: MealUpdateFunction): DayInfo {
    let newInfo = copyDayInfo(info);
    for (let meal of updates) {
        updateFunc(newInfo[meal.name as MealName], meal.present);
        newInfo[meal.name as MealName].loading = false;
    }
    return newInfo;
}

type AttendanceUpdateRequest = (attendance: MealAttendance[]) => Promise<MealAttendance[]>

type ReturnType = [info: DayInfo, updateMeal: (name: MealName, update: boolean) => void, updateMeals: (update: boolean) => void];

function useAttendanceInfo(defaultInfo: DayInfo, apiCallFunction: AttendanceUpdateRequest,
    updateFunction: MealUpdateFunction): ReturnType {

    let [_info, setInfo] = useState<DayInfo>(defaultInfo);

    function updateMealArray(update: MealAttendance[]) {
        setInfo(info => startLoadingMeals(info, update.map(u => u.name as MealName)));
        apiCallFunction(update)
            .then((response) => {
                setInfo(info => setUpdatedMeals(info, response, updateFunction));
            })
    }

    function updateMeal(name: MealName, update: boolean) {
        updateMealArray([{ name: name, present: update }]);
    }

    function updateMeals(update: boolean) {
        let mealsToUpdate = [];
        for (let mealName of MealNames) {
            mealsToUpdate.push({ name: mealName, present: update });
        }
        updateMealArray(mealsToUpdate);
    }
    return [_info, updateMeal, updateMeals];
}

export default useAttendanceInfo;