import { ITableProduct } from "./types";

export default function TableContentProduct({ index, selectedItem, item, children }: ITableProduct) {
    return (
        <tr key={index} className="hover:bg-gray-100 border-b">
            <td className="py-3 px-6 text-center text-sm text-gray-600 break-words">{index + 1}</td>
            <td className="py-3 px-6 text-center text-sm text-gray-600 break-words">{selectedItem ? selectedItem?.itemName : 'Item not found'}</td>
            <td className="py-3 px-6 text-center text-sm text-gray-600 break-words">{item?.quantity ? item?.quantity : '0'}</td>
            <td className="py-3 px-6 text-center text-sm text-gray-600 break-words">{children}</td>
        </tr>
    );
}