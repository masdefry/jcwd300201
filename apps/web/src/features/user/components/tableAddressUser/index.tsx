import { ConfirmAlert } from "@/components/core/confirmAlertCustom";
import Link from "next/link";
import { BsPencil, BsTrash } from "react-icons/bs";
import { ITableAddress } from "./types";

export default function TableAddressUser({ address, currentPage, entriesPerPage, i, onChangeMainAddress, isPendingDelete, onDeleteAddress }: ITableAddress) {
    return (
        <tr className="hover:bg-gray-100 border-b">
            <td className="py-3 px-6 text-sm text-gray-600 break-words">{(currentPage - 1) * entriesPerPage + i + 1}</td>
            <td className="py-3 px-6 text-sm text-gray-600 break-words">{address?.addressDetail}, {address?.city}, {address?.province}, {address?.country}, {address?.zipCode}</td>
            <td className="py-3 px-6 text-sm text-gray-600 break-words">
                <ConfirmAlert caption='Apakah yakin anda ingin mengganti alamat utama?' onClick={onChangeMainAddress}
                    description='Halaman utama akan diganti sesuai yang anda pilih'>
                    <button>{address?.isMain ? 'Utama' : 'Lainnya'}</button>
                </ConfirmAlert>
            </td>
            <td className="py-3 px-6 text-sm text-blue-700 hover:text-blue-500 hover:underline break-words">
                <div className='flex gap-2'>
                    <ConfirmAlert disabled={isPendingDelete} caption="Apakah anda yakin ingin menghapus alamat anda?" description="Data akan dihapus secara permanen, harap berhati-hati." onClick={onDeleteAddress}>
                        <button className="py-2 hover:bg-red-500 px-2 bg-red-600 rounded-xl"><BsTrash className="text-white" /></button>
                    </ConfirmAlert>
                    <Link href={`/user/dashboard/settings/address/e/${address?.id}CNC${Date.now()}`} className="py-2 hover:bg-blue-500 px-2 bg-blue-600 rounded-xl"><BsPencil className="text-white" /></Link>
                </div>
            </td>
        </tr>
    );
}