import { AttendanceApi, AttendanceDto, AttendanceCountDto, ChildAttendanceDto } from '../../../Api/ApiTypes';
import { DayMealState, MealState, MealNames, MealName } from './DayTypes';
import { useState, useEffect } from 'react';

type MealSelectionFunction = (m: MealState) => boolean;
type MealUpdateFunction = (m: MealState, u: boolean) => void;
type MealStateCallback = (delta: AttendanceCountDto) => void;

type ReturnType = [info: DayMealState,
    updateMeals: (meals: MealName[], update: boolean) => void,
    updateMasks: (meals: MealName[], update: boolean) => void,
    refreshMeals: () => void];

function useAttendanceInfo(sourceDto: AttendanceDto,
    api: AttendanceApi,
    updateCallback: MealStateCallback): ReturnType {

    const [_mealState, setMealState] = useState<DayMealState>(getStateFromDto(sourceDto));

    useEffect(() => {
        let shouldUpdate = false;
        for (let meal in sourceDto) {
            if (sourceDto[meal].masked !== _mealState[meal].masked || sourceDto[meal].present !== _mealState[meal].present) {
                shouldUpdate = true;
                break;
            }
        }
        if (shouldUpdate) {
            setMealState(getStateFromDto(sourceDto));
        }
    }, [sourceDto, _mealState])


    const updateMealArray = (update: ChildAttendanceDto): Promise<ChildAttendanceDto> => {
        setMealState(state => startLoadingMeals(state, update));

        return api.updateAttendance(update)
            .then((response) => {
                return response;
            }, (e) => {
                alert("Zmiana obecności nie powiodła się");
                setMealState(info => setFailedMeals(info));
                return {};
            })
    }

    const updateMealState = (response: ChildAttendanceDto, updateFunc: MealUpdateFunction) => {
        let oldState: DayMealState = {};
        let newState: DayMealState = {};
        setMealState(state => {
            oldState = { ...state };
            newState = { ...readUpdatedMeals(state, response, updateFunc) };
            return newState;
        });
        updateCallback(getDelta(oldState, newState));
    }

    const updateAttendance = (mealsToUpdate: MealName[], update: boolean) => {

        const mealUpdate = selectMealsToUpdate(_mealState, mealsToUpdate, update, m => m.present === 1);

        updateMealArray(mealUpdate)
            .then((response) => {
                updateMealState(response, (m, u) => { m.present = u ? 1 : 0 });
            }, (e) => { console.log(e); })
    }

    const updateMasks = (mealsToUpdate: MealName[], update: boolean) => {
        const mealUpdate = selectMealsToUpdate(_mealState, mealsToUpdate, update, m => m.masked);

        updateMealArray(mealUpdate)
            .then((response) => {
                console.log(response);
                updateMealState(response, (m, u) => { m.masked = u });
            }, (e) => { console.log(e); })
    }
    const refreshAttendance = () => {
        const mealsToRefresh: ChildAttendanceDto = {};
        for (let meal of MealNames) { mealsToRefresh[meal] = false; }
        setMealState(state => startLoadingMeals(state, mealsToRefresh))
        api.getDailyAttendance().then((response) => {
            let oldState = {};
            let newState = {};
            setMealState(info => {
                oldState = { ...info };
                newState = readRefreshedMeals(info, response);
                return newState;
            });
            updateCallback(getDelta(oldState, newState));
        }, (e) => { setMealState(info => setFailedMeals(info)) });
    }

    return [_mealState, updateAttendance, updateMasks, refreshAttendance];
}

function selectMealsToUpdate(prev: DayMealState, updateTarget: MealName[], update: boolean, mealCompare: MealSelectionFunction): ChildAttendanceDto {
    const mealsToUpdate: ChildAttendanceDto = {};
    for (let meal of updateTarget) {
        if (mealCompare(prev[meal]) !== update) {
            mealsToUpdate[meal] = update;
        }
    }
    return mealsToUpdate;
}

function copyMealState(info: DayMealState): DayMealState {
    let newInfo = Object.assign({}, info);
    for (let name of MealNames) {
        newInfo[name] = { ...info[name] };
    }
    return newInfo;
}

function startLoadingMeals(info: DayMealState, meals: ChildAttendanceDto): DayMealState {
    let newInfo = copyMealState(info);
    for (let name in meals) {
        newInfo[name as MealName].loading = true;
    }
    return newInfo;
}

function readUpdatedMeals(info: DayMealState, updates: ChildAttendanceDto, updateFunc: MealUpdateFunction): DayMealState {
    let newInfo = copyMealState(info);
    for (let meal in updates) {
        updateFunc(newInfo[meal as MealName], updates[meal]);
        newInfo[meal as MealName].loading = false;
    }
    return newInfo;
}

function readRefreshedMeals(info: DayMealState, update: AttendanceDto) {
    const newInfo = copyMealState(info);
    const defaultAttendance = { masked: false, present: 0 };
    for (let meal of MealNames) {
        if (update[meal] === undefined) {
            update[meal] = defaultAttendance;
        }
        newInfo[meal] = { name: meal as MealName, present: update[meal].present, masked: update[meal].masked, loading: false };
    }
    return newInfo;
}

function setFailedMeals(info: DayMealState): DayMealState {
    let newInfo = copyMealState(info);
    for (let meal in newInfo) {
        newInfo[meal as MealName].loading = false;
    }
    return newInfo;
}

function getStateFromDto(dto: AttendanceDto): DayMealState {
    const mealState: DayMealState = {};
    for (let meal in dto) {
        mealState[meal] = { name: meal as MealName, present: dto[meal].present, masked: dto[meal].masked, loading: false };
    }
    return mealState;
}

function getDelta(prev: DayMealState, now: DayMealState): AttendanceCountDto {
    const delta: AttendanceCountDto = {};
    const getRealMealCount = (m: MealState) => (m.masked ? 0 : m.present);

    for (let meal in prev) {
        if (now[meal] !== undefined) {
            delta[meal] = getRealMealCount(now[meal]) - getRealMealCount(prev[meal]);
        }
    }
    return delta;
}

export default useAttendanceInfo;