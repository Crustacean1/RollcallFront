import { useState, useEffect } from 'react';

import './ChildDataPanel.css';

import apiHandler from '../../../Api/Api';
import { ChildDto } from '../../../Api/ApiTypes';
import { Loading, Loader } from '../../Common/Loading';
import { PreviewMode } from '../../Common/Types';

interface DataPanelProps {
    targetId: number;
}

function ChildDataPanel(props: DataPanelProps) {
    let [_child, setChild] = useState<ChildDto>();
    let [_loaded, setLoaded] = useState(false);

    useEffect(() => {
        setLoaded(false);
        let active = true;
        apiHandler.fetchChild(props.targetId)
            .then((childDto) => {
                if (active) {
                    setLoaded(true);
                    setChild(childDto);
                }
            });
        return () => { active = false; }
    }, [props.targetId])

    let content = <div><h2>{_child?.name} {_child?.surname}</h2></div>;

    return <div className="data-panel">
        <Loading condition={_loaded} target={content} loader={<Loader size="100px" />} />
    </div>
}

export default ChildDataPanel;