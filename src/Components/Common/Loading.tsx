import './Loading.css'

function TableLoader(props: { span: number, size: string }) {
    return <tbody>
        <tr>
            <td colSpan={props.span}>
                <div className="loader">
                    <div className="spinner" style={{ "width": `${props.size}`, "height": `${props.size}` }}>
                    </div>
                </div>
            </td>
        </tr>
    </tbody>
}

function MiniLoader(props: { size: string }) {
    return <div className="spinner" style={{ "width": `${props.size}`, "height": `${props.size}` }}></div>

}
function Loader(props: { size: string }) {
    return <div className="loader">
        <div className="spinner" style={{ "width": `${props.size}`, "height": `${props.size}` }}></div>
    </div>

}

function Loading(props: { condition: boolean, loader: JSX.Element, target: JSX.Element }) {
    return props.condition ? props.target : props.loader;
}

export { Loading, MiniLoader, TableLoader, Loader };