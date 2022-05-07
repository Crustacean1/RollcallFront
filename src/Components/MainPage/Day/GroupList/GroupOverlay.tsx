import { useEffect, useState } from 'react';
import apiHandler from '../../../../Api/Api';
import { MealDate, AttendanceDto, AttendanceCountDto, ChildAttendanceDto } from '../../../../Api/ApiTypes';
import { useSession } from '../../../Common/Session';
import GroupList from './GroupList';
import Overlay from '../../../Common/Overlay';
import { Loading, Loader } from '../../../Common/Loading';
import { MealNames } from '../DayTypes';
import './GroupOverlay.css';

interface ChildSummary {
    name: string;
    surname: string;
    childId: number;
    meals: AttendanceDto;
}
interface ChildSummaryDto {
    name: string;
    surname: string;
    childId: number;
    meals: AttendanceCountDto;
}

interface DailyGroupSummary {
    groupId: number;
    groupName: string;
    children: ChildSummary[];
}

interface DailyGroupSummaryDto {
    groupId: number;
    groupName: string;
    masks: ChildAttendanceDto;
    children: ChildSummaryDto[];
}

interface DailySummary<T> {
    groups: T[];
}

interface GroupOverlayProps {
    targetId: number;
    date: MealDate;
    active: boolean;
    exit: () => void;
}

const mergeMealsWithMasks = (mealsToMerge: AttendanceCountDto, masksToMerge: ChildAttendanceDto) => {
    let attendance: AttendanceDto = {};
    if (masksToMerge === undefined || mealsToMerge === undefined) {
        console.log(mealsToMerge);
        console.log(masksToMerge);
        alert("Wystąpił błąd, (mergeMealsWithMasks), skonsultuj się z administratorem");
        return {};
    }
    for (let meal of MealNames) {
        attendance[meal] = {
            present: (mealsToMerge[meal] !== undefined ? mealsToMerge[meal] : 0),
            masked: (masksToMerge[meal] !== undefined ? masksToMerge[meal] : false)
        };
    }
    return attendance;
}

const patchSummaryDto = (response: DailyGroupSummaryDto[]) => {
    return response.map(r => {
        return {
            groupId: r.groupId,
            groupName: r.groupName,
            children: r.children.map(child => {
                return {
                    name: child.name,
                    surname: child.surname,
                    childId: child.childId,
                    meals: mergeMealsWithMasks(child.meals, r.masks)
                }
            })
        }
    })
}

function GroupOverlay({ targetId, date, active, exit }: GroupOverlayProps) {
    const [_attendanceSummary, setAttendanceSummary] = useState<DailySummary<DailyGroupSummary>>({ groups: [] });
    const [_loading, setLoading] = useState(true);
    const _session = useSession();


    useEffect(() => {
        let isActive = true;
        setLoading(true);
        if (active) {
            apiHandler.get<DailyGroupSummaryDto[]>(_session.token, "attendance", "group", "childlist", ...apiHandler.toStringArray(targetId, date.year, date.month, date.day))
                .then((response) => {
                    if (isActive) {
                        const patchedResponse = patchSummaryDto(response);
                        setAttendanceSummary({ groups: patchedResponse });
                        setLoading(false);
                    }
                })
        }
        return () => { isActive = false; }
    }, [active])

    const groupList = _attendanceSummary.groups.map(s => <GroupList key={`group-${s.groupName}`} date={date} summary={s} exit={() => { }} />);
    const overlay = <Overlay class="" target={
        <div className="group-overlay">
            <Loading loader={<Loader size={"100px"} />} condition={!_loading} target={<div className="inner-group-overlay">{groupList}</div>} />
        </div>
    } exit={exit} />

    return active ? overlay : <></>;
}

export default GroupOverlay;
export type { DailyGroupSummary, ChildSummary, DailySummary };