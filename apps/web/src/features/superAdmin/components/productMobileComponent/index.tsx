import { IProductContent } from "./type";
import { ConfirmAlert } from "@/components/core/confirmAlertCustom";
import DialogUpdateProduct from "../dialogUpdateProductLaundry";
import { BsTrash } from "react-icons/bs";

export default function ProductMobile(
    { i, isPendingDelete, handleUpdateItem, prod, handleDeleteItem, isPendingUpdate }: IProductContent
) {
    return (
        <div key={i} className="flex items-center justify-between bg-white py-4 px-2 rounded-lg shadow-sm transition-all duration-200 hover:bg-gray-100">
            <div className="flex items-center">
                <div className="ml-2">
                    <h2 className="font-medium text-gray-900">{prod?.itemName}</h2>
                    <p className="text-xs text-gray-500">{new Date(prod?.createdAt).toLocaleDateString()}</p>
                </div>
            </div>

            <div className="flex space-x-1">
                <DialogUpdateProduct handleUpdateItem={handleUpdateItem} product={prod} isPendingUpdate={isPendingUpdate} />
                <ConfirmAlert disabled={isPendingDelete} caption="Apakah anda yakin ingin menghapus data ini?" description="Data akan dihapus secara permanen, harap berhati-hati." onClick={() => handleDeleteItem(prod?.id)}>
                    <button className="py-2 hover:bg-red-500 px-2 bg-red-600 rounded-xl"><BsTrash className="text-white" /> </button>
                </ConfirmAlert>
            </div>
        </div>
    )
}