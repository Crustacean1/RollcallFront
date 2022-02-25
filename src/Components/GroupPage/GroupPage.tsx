import './GroupPage.css';

function GroupPage(props: {nav: JSX.Element}) {
    return <div className="main-component">
        {props.nav}
        <h1>Welcome to the group page</h1>
    </div>
}

export default GroupPage;