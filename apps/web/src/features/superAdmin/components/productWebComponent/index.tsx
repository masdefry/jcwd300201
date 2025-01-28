import { IProductContent } from "./type";
import { ConfirmAlert } from "@/components/core/confirmAlertCustom";
import DialogUpdateProduct from "../dialogUpdateProductLaundry";
import { BsTrash } from "react-icons/bs";

export default function ProductWeb(
    { i, isPendingDelete, currentPage, entriesPerPage, handleUpdateItem, prod, handleDeleteItem, isPendingUpdate }: IProductContent
) {
    return (
        <tr className="hover:bg-gray-100 border-b" key={prod?.id || i}>
            <td className="py-3 px-6 text-sm text-gray-600 break-words">{(currentPage - 1) * entriesPerPage + i + 1}</td>
            <td className="py-3 px-6 text-sm text-gray-600 break-words">{prod?.itemName}</td>
            <td className="py-3 px-6 text-sm text-gray-600 break-words text-center">{new Date(prod?.createdAt).toLocaleDateString()}</td>
            <td className="py-3 px-6 text-sm text-blue-700 hover:text-blue-500 hover:underline break-words">
                <div className='flex gap-2'>
                    <ConfirmAlert disabled={isPendingDelete} caption="Apakah anda yakin ingin menghapus data ini?" description="Data akan dihapus secara permanen, harap berhati-hati." onClick={() => handleDeleteItem(prod?.id)}>
                        <button className="py-2 hover:bg-red-500 px-2 bg-red-600 rounded-xl"><BsTrash className="text-white" /> </button>
                    </ConfirmAlert>
                    <DialogUpdateProduct handleUpdateItem={handleUpdateItem} product={prod} isPendingUpdate={isPendingUpdate} />
                </div>
            </td>
        </tr>
    )
}