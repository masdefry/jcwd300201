import React from "react";
import { ITableHeaderProps } from "./type";

const TableHeaderWeb = ({ columns }: ITableHeaderProps) => {
    return (
        <thead className="bg-gray-200">
            <tr>
                {columns.map((column, index) => (
                    <th
                        key={index}
                        className={`py-3 px-6 text-left text-sm font-bold text-gray-600 uppercase`}
                    >
                        {column}
                    </th>
                ))}
            </tr>
        </thead>
    );
};


export default TableHeaderWeb;
