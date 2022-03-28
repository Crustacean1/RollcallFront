import './Overlay.css';

function Overlay(props: { class: string, target: JSX.Element, exit: () => void }) {
    return <div className={`full-overlay ${props.class}`} onClick={e => { e.stopPropagation(); props.exit() }}>{props.target}</div>
}

export default Overlay;