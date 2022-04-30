
function DisabledDay(props: { date: Date }) {
    return <div className="calendar-day disabled-day">
        <h4>{props.date.getDate()}</h4>
    </div>
}

export default DisabledDay;