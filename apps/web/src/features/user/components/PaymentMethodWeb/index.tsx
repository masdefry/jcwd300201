import ButtonCustom from "@/components/core/buttonCustom"
import Image from "next/image"
import { FaWallet } from "react-icons/fa6"
import { RiBankCardFill } from "react-icons/ri"
import { IPaymentMethodMobile } from "./type"

export default function PaymentMethodMobile({ isArrCardPayment, dataOrderNote, setIsPaymentMethod, isPaymentMethod, handlePaymmentOrder, setIsUploadDialogOpen, router }: IPaymentMethodMobile) {
    return (
        <div className="w-full md:w-1/2 space-y-4 pb-28">
            <h1 className="font-bold text-2xl text-gray-800">Metode Pembayaran</h1>
            <div className="w-full h-fit">
                <div className="flex justify-start w-full h-fit">
                    <div className="grid grid-cols-4 h-fit gap-2">
                        {isArrCardPayment.map((img: { img: string }, i: number) => (
                            <div key={i} className='w-fit h-fit flex justify-center'>
                                <Image
                                    className='w-fit h-10'
                                    width={500}
                                    height={500}
                                    alt='card'
                                    src={img?.img}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            {dataOrderNote?.order?.isPaid === false && !dataOrderNote?.order?.paymentMethod && !dataOrderNote?.order?.paymentProof ? (
                <>
                    <div className="space-y-4">
                        <label htmlFor="midtrans-mobile" className="flex items-center justify-between p-4 gap-2 w-full border rounded-lg cursor-pointer hover:bg-gray-50 transition">
                            <div className='flex gap-2 items-center'>
                                <FaWallet className="text-lg" />
                                <span className="text-gray-700 flex">Pembayaran Online <span className="text-xs mt-1 text-gray-500">(Verifikasi Otomatis)</span></span>
                            </div>
                            <input onChange={(e: React.ChangeEvent<HTMLInputElement>) => setIsPaymentMethod(e.target.value)} value='midtrans-mobile' type="radio" name="paymentMethod" id="midtrans-mobile" className="w-4 h-4 text-blue-600" />
                        </label>
                        <label htmlFor="manualTransfer-mobile" className="flex items-center justify-between p-4 gap-2 w-full border rounded-lg cursor-pointer hover:bg-gray-50 transition">
                            <div className='flex gap-2 items-center'>
                                <RiBankCardFill className="text-lg" />
                                <span className="text-gray-700 flex">Transfer Bank <span className="text-xs mt-1 text-gray-500">(Verifikasi Manual Admin)</span></span>
                            </div>
                            <input onChange={(e: React.ChangeEvent<HTMLInputElement>) => setIsPaymentMethod(e.target.value)} value='manualTransfer-mobile' type="radio" name="paymentMethod" id="manualTransfer-mobile" className="w-4 h-4 text-blue-600" />
                        </label>
                    </div>
                    <ButtonCustom type="button" btnColor="bg-blue-500 hover:bg-blue-500" disabled={!isPaymentMethod || dataOrderNote?.order?.laundryPrice === null || dataOrderNote?.order?.laundryPrice === 0} width="w-full" onClick={() => {
                        isPaymentMethod === 'midtrans' || isPaymentMethod === 'midtrans-mobile' ? handlePaymmentOrder(dataOrderNote?.order?.id) : setIsUploadDialogOpen(true)
                    }}>Bayar sekarang</ButtonCustom>
                </>
            ) : dataOrderNote?.order?.isPaid === false && dataOrderNote?.order?.paymentMethod === 'MIDTRANS' ?
                <div className="mt-5 flex flex-col w-full justify-center">
                    <div className="flex justify-center text-center">Anda telah memilih metode Pembayaran Online</div>
                    <div className="w-full"><ButtonCustom width="w-full" btnColor="bg-blue-500" txtColor="text-white" onClick={() => router.push(`${dataOrderNote?.order?.paymentProof}`)}>Lanjutkan Pembayaran</ButtonCustom></div>
                </div>
                : dataOrderNote?.order?.isPaid === true && (dataOrderNote?.order?.paymentMethod === 'MIDTRANS' || dataOrderNote?.order?.paymentMethod === 'TF_MANUAL') ?
                    <div className="text-lg mt-8 border-gray-300 p-4">
                        <h1 className="font-bold">Terima kasih,</h1>
                        <p>Anda Telah Melakukan Pembayaran,</p>
                        <p>Terima kasih!</p>
                    </div>
                    : <div className="text-lg mt-8 border-gray-300 p-4">
                        <h1 className="font-bold">Terima kasih,</h1>
                        <p>Anda Telah Melakukan Pembayaran!</p>
                        <p>Menunggu Verifikasi Admin!</p>
                    </div>
            }
        </div>
    )
}