import { useState } from 'react';
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

function TableRow<T>(props: { source: T, displayFunc: (source: T) => JSX.Element }) {
    return props.displayFunc(props.source);
}

function BasicTable<T>(props: TableProps<T>) {
    const [_sorting, setSorting] = useState("");
    const [_sortDirection, setSortDirection] = useState(-1);

    const sortString = (a: string, b: string) => {
        if (a < b) {
            return _sortDirection;
        }
        if (a === b) {
            return 0;
        }
        return -_sortDirection;
    }

    const body = _sorting === "" ?
        (<tbody>
            {props.source.map((a, index) => <TableRow source={a} displayFunc={props.displayFunc} key={index} />)}
        </tbody>) :
        (<tbody>
            {props.source.sort(
                (a, b) => sortString((a as any)[_sorting], (b as any)[_sorting]))
                .map((a, index) => <TableRow source={a} displayFunc={props.displayFunc} key={index} />)}
        </tbody>)

    const setSortingColumn = (name: string) => {
        if (_sorting === name) {
            setSortDirection(-_sortDirection);
        }
        else {
            setSorting(name);
            setSortDirection(-1);
        }
    }
    const activeHeaderName = _sortDirection === -1 ? "sort-desc" : "sort-asc";

    return (<div style={{
        "maxHeight": `${props.height}`,
        "height": `${props.height}`
    }} className={`basic-table-container ${props.class}`}>
        <table
            className={`basic-table`}>
            <thead>
                < tr >
                    {props.headers.map((header, index) => header.name !== "" ?
                        <th key={index} onClick={e => setSortingColumn(header.name)} className={"active-header " + (_sorting === header.name ? activeHeaderName : "")}>{header.title}</th> :
                        <th key={index} className="active-header">{header.title}</th>)}
                </ tr>
            </thead>
            {<Loading condition={true} target={body} loader={<TableLoader span={props.headers.length} size="100px" />} />}
        </table >
    </div>);
}

export default BasicTable;
export type { TableProps };