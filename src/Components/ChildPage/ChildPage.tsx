
function ChildPage(props: { nav: JSX.Element }) {
    return <div className="main-component">
        {props.nav}
        <h1>Welcome to child page</h1>
    </div>
}

export default ChildPage;