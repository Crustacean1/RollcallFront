import './Day.css';
import { AttendanceDto, MaskDto } from '../../Api/ApiTypes';
import apiHandler from '../../Api/Api';

interface ChildDayProps {
    date: { day: number, month: number, year: number };
    attendance: AttendanceDto;
    mask: MaskDto;
}

function fetchChildAttendance(childId: number, year: number, month: number, token: string): Promise<AttendanceDto[]> {
    return apiHandler.fetchChildAttendanceCount(childId, year, month, token);
}
function fetchChildMasks(groupId: number, year: number, month: number, token: string): Promise<MaskDto[]> {
    return apiHandler.fetchChildAttendanceMasks(groupId, year, month, token);
}

function ChildDay(props: ChildDayProps) {
    let mapProperties = (meals: AttendanceDto) => {
        var result = [] as JSX.Element[];
        for (var meal in meals) {
            result.push(<div className="child-day-field">{meal} : {(meals as any)[meal]}</div>)
        }
        return result;
    }
    return <div className="calendar-day child-day">
        <h4>{props.date.day}</h4>
        {mapProperties(props.attendance)}
    </div>
}

export default ChildDay;
export { fetchChildAttendance, fetchChildMasks };

