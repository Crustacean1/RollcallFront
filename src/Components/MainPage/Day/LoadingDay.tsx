import { Loading, Loader } from '../../Common/Loading';

function LoadingDay() {
    return <div className="calendar-day">
        <Loading condition={false} target={<div></div>} loader={<Loader size="5vw" />} />
    </div>
}

export default LoadingDay;