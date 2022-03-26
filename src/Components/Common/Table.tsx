import { useState, useEffect } from 'react';
import './Table.css';
import { Loading, TableLoader } from './Loading';

interface TableHeader {
    title: string;
    name: string;
}

interface TableProps<SourceType> {
    headers: TableHeader[];
    source: SourceType[];
    loading: boolean;
    class: string;
    height: string;
    displayFunc: (source: SourceType) => JSX.Element;
}

function BasicTable<T>(props: TableProps<T>) {
    let [_sorting, setSorting] = useState("");
    let [_sortDirection,setSortDirection] = useState(-1);

    let sortString = (a: string, b: string) => {
        if (a < b) {
            return _sortDirection;
        }
        if (a == b) {
            return 0;
        }
        return -_sortDirection;
    }

    let body = _sorting == "" ?
        (<tbody>
            {props.source.map(src => props.displayFunc(src))}
        </tbody>) :
        (<tbody>
            {props.source.sort((a, b) => sortString((a as any)[_sorting], (b as any)[_sorting])).map(src => props.displayFunc(src))}
        </tbody>)
    let setSortingColumn = (name: string) => {
        if(_sorting == name){
            setSortDirection(-_sortDirection);
        }
        else{
            setSorting(name);
        }
    }
    let activeHeaderName = _sortDirection == -1 ? "sort-desc" : "sort-asc";

    return (<div style={{
        "maxHeight": `${props.height}`,
        "height": `${props.height}`
    }} className={`basic-table-container ${props.class}`}>
        <table
            className={`basic-table`}>
            <thead>
                < tr >
                    {props.headers.map(header => header.name != "" ?
                        <th onClick={e => setSortingColumn(header.name)} className={"active-header " + (_sorting === header.name ? activeHeaderName : "")}>{header.title}</th> :
                        <th className="active-header">{header.title}</th>)}
                </ tr>
            </thead>
            {<Loading condition={!props.loading} target={body} loader={<TableLoader span={props.headers.length} size="100px" />} />}
        </table >
    </div>);
}

export default BasicTable;
export type { TableProps };