import { useState, useEffect } from 'react';

import './GroupDataPanel.css';

import apiHandler from '../../../Api/Api';
import { GroupDto } from '../../../Api/ApiTypes';
import { PreviewMode } from '../../Common/Types';

interface DataPanelProps {
    targetId: number;
    date: Date;
}

function GroupDataPanel(props: DataPanelProps) {
    let [_group, setGroup] = useState<GroupDto>();
    let [_loaded, setLoaded] = useState(false);

    useEffect(() => {
        setLoaded(false);
        var active = true;
        apiHandler.fetchGroup(props.targetId, props.date.getFullYear(), props.date.getMonth())
            .then((groupDto) => {
                if (active) {
                    setGroup(groupDto);
                }
            }, (error) => {
                console.log(error);
            });
        return () => { active = false; }
    }, [props.targetId, props.date])

    return <div className="data-panel">

    </div>
}

export default GroupDataPanel;