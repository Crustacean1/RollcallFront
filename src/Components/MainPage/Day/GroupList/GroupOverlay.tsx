import { useEffect, useState } from 'react';
import apiHandler from '../../../../Api/Api';
import { MealDate, AttendanceCountDto, ChildAttendanceDto } from '../../../../Api/ApiTypes';
import { useSession } from '../../../Common/Session';
import GroupList from './GroupList';

interface ChildSummary {
    name: string;
    surname: string;
    childId: number;
    meals: AttendanceCountDto;
}

interface DailyGroupSummary {
    masks: ChildAttendanceDto;
    groupId: number;
    children: ChildSummary[];
}

interface DailySummary {
    [groupName: string]: DailyGroupSummary;
}

interface GroupOverlayProps {
    targetId: number;
    date: MealDate;
    active: boolean;
}

function GroupOverlay({ targetId, date }: GroupOverlayProps) {
    const [_attendanceSummary, setAttendanceSummary] = useState<DailySummary>({});
    const _session = useSession();

    useEffect(() => {
        let isActive = true;
        apiHandler.get<DailySummary>(_session.token, "attendance", "group", "dailylist", ...apiHandler.toStringArray(targetId, date.year, date.month, date.day))
            .then((response) => {
                if (isActive) {
                    setAttendanceSummary(response);
                }
            })
        return () => { isActive = false; }
    }
    )
    const result: DailyGroupSummary[] = [];
    for (let groupName in _attendanceSummary) {
        result.push(_attendanceSummary[groupName])
    }

    return <div className="group-overlay">{
        result.map(r => <GroupList date={date} targetId={0} exit={() => { }} />)
    }</div>
}

export default GroupOverlay;