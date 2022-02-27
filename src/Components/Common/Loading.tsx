import './Loading.css'

function TableLoader(props: { size: string }) {
    return <tbody><tr><td colSpan={6}><div className="spinner" style={{ "width": `${props.size}`, "height": `${props.size}` }}></div></td></tr></tbody>
}

function Loader(props: { size: string }) {
    return <div className="spinner" style={{ "width": `${props.size}`, "height": `${props.size}` }}></div>

}

function Loading(props: { condition: boolean, loader: JSX.Element, target: JSX.Element }) {
    return props.condition ? props.target : props.loader;
}

export { Loading, TableLoader, Loader };