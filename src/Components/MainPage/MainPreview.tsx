import './MainPreview.css';
import GroupPreview from './GroupPreview';
import ChildPreview from './ChildPreview';
import { PreviewMode } from '../Common/Types';

interface MainPreviewProps {
    token: string;
    setMode: (mode: PreviewMode) => void;
    mode: PreviewMode;
}

function MainPreview(props: MainPreviewProps) {
    return <div className="main-preview">
        <GroupPreview token={props.token} setMode={props.setMode} />
        <ChildPreview token={props.token} mode={props.mode} />
    </div>
}

export default MainPreview;