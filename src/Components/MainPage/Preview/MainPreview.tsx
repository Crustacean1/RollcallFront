import './MainPreview.css';
import GroupPreview from './GroupPreview';
import ChildPreview from './ChildPreview';
import { PreviewMode } from '../../Common/Types';

interface MainPreviewProps {
    panelComponent: JSX.Element;
    setMode: (update: (mode: PreviewMode) => PreviewMode) => void;
    mode: PreviewMode;
}

function MainPreview(props: MainPreviewProps) {
    return <div className="main-preview">
        {props.panelComponent}
        <GroupPreview setMode={props.setMode} />
        <ChildPreview setMode={props.setMode} mode={props.mode} />
    </div>
}

export default MainPreview;