import { AttendanceApi, AttendanceDto, MealAttendance } from '../../../Api/ApiTypes';
import { DayDate, DayInfo, MealNames, MealName, MealUpdateFunction } from './DayTypes';
import { useState, useEffect } from 'react';

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

function readAttendance(attendance: AttendanceDto): DayInfo {
    let info = {
        "breakfast": { ...attendance.breakfast, name: "breakfast" as MealName, loading: false },
        "dinner": { ...attendance.dinner, name: "dinner" as MealName, loading: false },
        "desert": { ...attendance.desert, name: "desert" as MealName, loading: false },
    };
    return info;
}

function readRefresh(info: DayInfo, refresh: AttendanceDto): DayInfo {
    let newInfo = {
        "breakfast": { name: "breakfast" as MealName, loading: false, present: 0, masked: false },
        "dinner": { name: "dinner" as MealName, loading: false, present: 0, masked: false },
        "desert": { name: "desert" as MealName, loading: false, present: 0, masked: false },
    };
    for (let meal of MealNames) {
        newInfo[meal].present = refresh[meal].present;
        newInfo[meal].masked = refresh[meal].masked;
    }
    return newInfo;
}

type ReturnType = [info: DayInfo,
    updateMeal: (name: MealName, update: boolean) => void,
    updateMeals: (update: boolean) => void,
    refreshMeals: () => void];


const defaultAttendance: DayInfo = {
    "breakfast": { name: "breakfast", loading: false, present: 0, masked: false },
    "dinner": { name: "dinner", loading: false, present: 0, masked: false },
    "desert": { name: "desert", loading: false, present: 0, masked: false },
};

function useAttendanceInfo(sourceInfo: AttendanceDto, date: DayDate, api: AttendanceApi,
    updateFunction: MealUpdateFunction): ReturnType {

    let [_info, setInfo] = useState<DayInfo>(defaultAttendance);

    useEffect(() => {
        setInfo(info => readAttendance(sourceInfo));
    }, [sourceInfo])

    function updateMealArray(update: MealAttendance[]) {
        setInfo(info => startLoadingMeals(info, update.map(u => u.name as MealName)));
        api.updateAttendance(update, date)
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
            let meal = Object.assign({}, _info[mealName]);
            updateFunction(meal, update);
            if (meal.masked !== _info[mealName].masked || meal.present !== _info[mealName].present) {
                mealsToUpdate.push({ name: mealName, present: update });
            }
        }
        updateMealArray(mealsToUpdate);
    }

    function refreshMeals() {
        setInfo(info => startLoadingMeals(info, MealNames));
        api.getDailyAttendance(date)
            .then((response) => {
                setInfo(info => readRefresh(info, response));
            })
    }
    return [_info, updateMeal, updateMeals, refreshMeals];
}

export default useAttendanceInfo;