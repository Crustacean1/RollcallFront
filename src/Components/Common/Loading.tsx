import './Loading.css'

function TableLoader(props: { size: string }) {
    return <tbody><tr><td colSpan={4}><div className="spinner" style={{ "width": `${props.size}`, "height": `${props.size}` }}></div></td></tr></tbody>
}

function Loading(props: { condition: boolean, loader: JSX.Element, target: JSX.Element }) {
    return props.condition ? props.target : props.loader;
}

export { Loading, TableLoader };