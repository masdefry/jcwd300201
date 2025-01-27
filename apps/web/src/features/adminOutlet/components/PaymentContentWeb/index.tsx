import { ConfirmAlert } from "@/components/core/confirmAlertCustom";
import { IOrderContentWeb } from "./type";
import { FaArrowUpRightFromSquare, FaCheck, FaWhatsapp } from "react-icons/fa6";
import Link from "next/link";

export default function PaymentContentWeb(
    { order, page, handleConfirmPayment, i, entriesPerPage }: IOrderContentWeb
) {
    return (
        <tr className="hover:bg-gray-100 border-b" key={order?.id || i}>
            <td className="py-4 px-6 text-sm text-gray-600 break-words">{(page - 1) * entriesPerPage + i + 1}</td>
            <td className="py-4 px-6 text-sm text-gray-600 break-words">{order?.id}</td>
            <td className="py-4 px-6 text-sm text-gray-600 break-words">{order?.User?.firstName} {order?.User?.lastName}</td>
            <td className="py-4 px-6 text-sm text-gray-600 break-words">Rp. {order?.totalPrice?.toLocaleString('id-ID')}</td>
            <td className="py-4 px-6 text-sm text-gray-600 break-words">{order?.OrderType?.type === 'Wash Only' ? 'Layanan Mencuci' : order?.OrderType?.type === 'Iron Only' ? 'Layanan Setrika' : 'Mencuci dan Setrika'}</td>
            <td className="py-4 px-6 text-sm text-center">

                {order?.isPaid === false && order?.paymentMethod === 'TF_MANUAL' && order?.paymentProof ?
                    <div className="flex gap-4 items-center">
                        <Link href={`${order.paymentProof}`}
                            target="_blank" className="text-blue-700 hover:text-blue-500 relative group">
                            <FaArrowUpRightFromSquare />
                            <span className="absolute z-20 bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full opacity-0 group-hover:opacity-100 bg-gray-800 text-white text-xs rounded-md px-2 py-1 mt-1 transition-opacity duration-200">
                                Lihat Bukti Pembayaran
                            </span>
                        </Link>

                        <ConfirmAlert colorConfirmation="blue" caption="Apakah anda yakin ingin melakukan verifikasi pembayaran pada order berikut?"
                            description="Mohon periksa kembali bukti pembayaran, hati-hati terhadap penipuan"
                            onClick={() => handleConfirmPayment(order?.id)}>
                            <button className="text-green-600 hover:text-green-400 relative group">
                                <FaCheck />
                                <span className="absolute bottom-0 z-20 left-1/2 transform -translate-x-1/2 translate-y-full opacity-0 group-hover:opacity-100 bg-gray-800 text-white text-xs rounded-md px-2 py-1 mt-1 transition-opacity duration-200">
                                    Verifikasi Pembayaran
                                </span>
                            </button>
                        </ConfirmAlert>
                    </div>
                    : order?.isPaid === false ?
                        <div className="flex gap-1 justify-start">
                            <Link href={`https://wa.me/${order?.User?.phoneNumber}`} className="flex text-lg items-center h-fit space-x-2 px-1 py-1 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg">
                                <FaWhatsapp />
                            </Link>
                        </div>
                        : ''
                }
            </td>
        </tr>
    )
}