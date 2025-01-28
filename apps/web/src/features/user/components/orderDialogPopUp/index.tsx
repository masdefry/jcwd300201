import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import ButtonCustom from "@/components/core/buttonCustom";
import HorizontalTimeline from "@/components/core/timelineUserCustom"
import Link from "next/link";
import { FaWhatsapp } from "react-icons/fa6";
import Loading from "@/components/core/loadingCustom";
import { ConfirmAlert } from "@/components/core/confirmAlertCustom"
import { IOrderPopUpDialog } from "./type";

export default function OrderPopUpDialog({ openDialog, orderData, setOpenDialog, router, handleOrderConfirmation, handleOrderConfirmationPending, handleSolveComplaint, handleSolveComplaintPending }: IOrderPopUpDialog) {
    return (
        <Dialog open={openDialog} onOpenChange={(isOpen) => setOpenDialog(isOpen)}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Detail Order</DialogTitle>
                </DialogHeader>
                {orderData ? (
                    <>
                        <div className="grid gap-4 py-2 border-b border-neutral-400">
                            <div className="flex justify-between items-center">
                                <div className="w-2/3 flex flex-col">
                                    <h2 className="text-base font-semibold">{orderData?.order?.id}</h2>
                                    <h2 className="text-base">{orderData?.order?.OrderType?.type}</h2>

                                    {orderData?.order?.isPaid ?
                                        <div className="border w-fit px-1 mt-1 rounded-md bg-green-200 border-green-600 text-green-600">
                                            Pembayaran Berhasil
                                        </div>
                                        : !orderData?.order?.isPaid && orderData?.order?.laundryPrice ?
                                            <div className="border w-fit px-1 rounded-md bg-red-200 border-red-600 text-red-600">
                                                Menunggu Pembayaran
                                            </div>
                                            : ""
                                    }
                                </div>
                                <div className="w-1/3 flex flex-col items-end">
                                    <p className="text-sm text-gray-500">{orderData?.order?.createdAt.split('T')[0]} </p>
                                    <p className="text-sm text-gray-500">{orderData?.order?.createdAt.split('T')[1].slice(0, 5)} </p>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col justify-between">
                            <div>
                                Proses: <HorizontalTimeline orderStatus={orderData?.orderStatus} />
                            </div>
                            <div className="space-y-3 my-3">
                                <div className="border rounded-lg border-gray-700 p-2 shadow-md">
                                    <div className="font-semibold">Driver Pickup:</div>
                                    <div>
                                        {orderData?.orderStatus[1]?.status === "DRIVER_TO_OUTLET" ? (
                                            <>
                                                <Link href={`https://wa.me/${orderData?.orderStatus[1]?.Worker?.phoneNumber}`} className="text-black">
                                                    <div>
                                                        {`${orderData?.orderStatus[1]?.Worker?.firstName ?? ''} ${orderData?.orderStatus[1]?.Worker?.lastName ?? ''}`}
                                                    </div>
                                                    <div className="flex gap-1 items-center">
                                                        <FaWhatsapp color="green" />{orderData?.orderStatus[1]?.Worker?.phoneNumber ?? 'No phone number available'}
                                                    </div>
                                                </Link>
                                            </>
                                        ) : (
                                            "Menunggu Driver"
                                        )}
                                    </div>
                                </div>
                                <div className="border rounded-lg border-gray-700 p-2 shadow-md">
                                    <div className="font-semibold">Delivery Driver:</div>
                                    <div>
                                        {orderData?.orderStatus[7]?.status === "DRIVER_TO_CUSTOMER" ? (
                                            <>
                                                <Link href={`https://wa.me/${orderData?.orderStatus[7]?.Worker?.phoneNumber}`} className="text-black">
                                                    <div>
                                                        {`${orderData?.orderStatus[7]?.Worker?.firstName ?? ''} ${orderData?.orderStatus[7]?.Worker?.lastName ?? ''}`}
                                                    </div>
                                                    <div className="flex gap-1 items-center">
                                                        <FaWhatsapp color="green" />{orderData?.orderStatus[7]?.Worker?.phoneNumber ?? 'No phone number available'}
                                                    </div>
                                                </Link>
                                            </>

                                        ) : orderData?.orderStatus[8]?.status === "DRIVER_TO_CUSTOMER" ? (
                                            <>
                                                <Link href={`https://wa.me/${orderData?.orderStatus[8]?.Worker?.phoneNumber}`} className="text-black">
                                                    <div>
                                                        {`${orderData?.orderStatus[8]?.Worker?.firstName ?? ''} ${orderData?.orderStatus[8]?.Worker?.lastName ?? ''}`}
                                                    </div>
                                                    <div className="flex gap-1 items-center">
                                                        <FaWhatsapp color="green" />{orderData?.orderStatus[8]?.Worker?.phoneNumber ?? 'No phone number available'}
                                                    </div>
                                                </Link>

                                            </>
                                        ) : (
                                            "Belum Ada Driver"
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-between">
                            <span className="font-medium">Biaya Kirim:</span>
                            <span>Rp{orderData?.order?.deliveryFee?.toLocaleString("id-ID")}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Harga Laundry:</span>
                            <span>{orderData?.order?.laundryPrice
                                ? `Rp${orderData.order.laundryPrice.toLocaleString("id-ID")}`
                                : "Menunggu Pembuatan Invoice"}</span>
                        </div>
                        <div className="flex justify-between font-semibold">
                            <span>Total Harga:</span>
                            <span>Rp{(orderData?.order?.deliveryFee + orderData?.order?.laundryPrice)?.toLocaleString("id-ID")}</span>
                        </div>
                    </>
                ) : (
                    <div><Loading /></div>
                )}
                {orderData?.order?.isPaid === true && orderData?.order?.isConfirm === false && orderData?.order?.isDone === true && orderData?.order?.isReqDelivery === true && orderData?.order?.isComplain === false ?
                    <div className="flex w-full justify-center gap-2">
                        <ConfirmAlert
                            colorConfirmation="blue"
                            caption="Konfirmasi Komplain"
                            description="Apakah Anda yakin ingin mengajukan komplain? Tindakan ini tidak dapat dibatalkan dan akan diteruskan untuk ditindaklanjuti oleh tim kami."
                            onClick={() => {
                                router.push(`/user/dashboard/order/complaint/${orderData?.order?.id}`)
                                setOpenDialog(false)
                            }}>
                            <ButtonCustom btnColor="bg-red-500" txtColor="text-white">Laporkan Masalah</ButtonCustom>
                        </ConfirmAlert>
                        <ConfirmAlert
                            colorConfirmation="blue"
                            disabled={handleOrderConfirmationPending}
                            caption="Apakah anda yakin ingin mengkonfirmasi order laundry berikut?"
                            description="Pastikan laundry telah sampai di lokasi anda"
                            onClick={() => {
                                handleOrderConfirmation(orderData?.order?.id)
                            }}>
                            <div className="flex">
                                <ButtonCustom disabled={handleOrderConfirmationPending} btnColor="bg-blue-500" txtColor="text-white">Konfirmasi Laundry</ButtonCustom>
                            </div>
                        </ConfirmAlert>
                    </div>
                    : orderData?.order?.isPaid === true && orderData?.order?.isConfirm === false && orderData?.order?.isDone === true && orderData?.order?.isReqDelivery === true && orderData?.order?.isComplain === true ?
                        <div className="flex w-full justify-center gap-2">
                            <ConfirmAlert
                                colorConfirmation="blue"
                                disabled={handleSolveComplaintPending}
                                caption="Selesaikan Masalah & Konfirmasi Laundry"
                                description="Apakah Anda yakin masalah ini telah diselesaikan? Tindakan ini akan menutup keluhan Anda secara permanen serta mengkonfirmasi bahwa laundry anda telah sampai."
                                onClick={() => {
                                    handleSolveComplaint(orderData?.order?.id)
                                    setOpenDialog(false);
                                }}>
                                <ButtonCustom btnColor="bg-blue-500" width="w-full" txtColor="text-white">Masalah Teratasi & Konfirmasi Laundry</ButtonCustom>
                            </ConfirmAlert>
                        </div>
                        : orderData?.order?.isPaid === false && orderData?.order?.isConfirm === false && orderData?.order?.laundryPrice > 1 && !orderData?.order?.paymentProof ?
                            <div className="flex justify-center">
                                <ButtonCustom width="w-full" btnColor="bg-blue-500" txtColor="text-white" onClick={() => router.push(`/user/dashboard/payment/${orderData?.order?.id}`)}
                                    disabled={orderData?.order?.laundryPrice === null || orderData?.order?.laundryPrice === 0}>Bayar Sekarang
                                </ButtonCustom>
                            </div>
                            : orderData?.order?.isPaid === false && orderData?.order?.isConfirm === false && orderData?.order?.paymentProof && orderData?.order?.paymentMethod === "TF_MANUAL" ?
                                <div className="flex justify-center">
                                    <ButtonCustom btnColor="bg-white" txtColor="text-black">Pembayaran Menunggu Verifikasi Admin</ButtonCustom>
                                </div>
                                : orderData?.order?.isPaid === false && orderData?.order?.isConfirm === false && orderData?.order?.paymentProof && orderData?.order?.paymentMethod === "MIDTRANS" ?
                                    <div className="flex justify-center">
                                        <ButtonCustom btnColor="bg-blue-500" txtColor="text-white" onClick={() => router.push(`${orderData?.order?.paymentProof}`)}>Lanjutkan Pembayaran</ButtonCustom>
                                    </div>
                                    : ''}
            </DialogContent>
        </Dialog>
    )
}