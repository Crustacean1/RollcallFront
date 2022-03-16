import './Table.css';
import { Loading, TableLoader } from './Loading';

interface TableProps<SourceType> {
    headers: string[];
    source: SourceType[];
    loading: boolean;
    class: string;
    height: string;
    displayFunc: (source: SourceType) => JSX.Element;
}

function BasicTable<T>(props: TableProps<T>) {
    let body = (<tbody>
        {props.source.map(src => props.displayFunc(src))}
    </tbody>)
    return (<div style={{
        "maxHeight": `${props.height}`,
        "height": `${props.height}`
    }} className={`basic-table-container ${props.class}`}>
        <table
            className={`basic-table`}>
            <thead>
                < tr >
                    {props.headers.map(header => <th>{header}</th>)}
                </ tr>
            </thead>
            {<Loading condition={!props.loading} target={body} loader={<TableLoader span={props.headers.length} size="100px" />} />}
        </table >
    </div>);
}

export default BasicTable;
export type { TableProps };