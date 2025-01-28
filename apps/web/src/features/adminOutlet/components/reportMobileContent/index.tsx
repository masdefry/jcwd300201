import Link from "next/link";
import { IReportContent } from "./type";
import { FaWhatsapp } from "react-icons/fa6";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Formik, Form, Field, ErrorMessage } from "formik";
import { notesSchema } from "../../schemas/notesSchema";
import ButtonCustom from "@/components/core/buttonCustom";

export default function ReportContentMobile(
    { order, handleLaundryProblem, isPending, isDisableSuccess }: IReportContent
) {
    return (
        <section key={order.id} className="flex justify-between items-center border-b py-4">
            {order?.notes && (order?.isSolved as true | false) === true ?
                <Dialog>
                    <DialogTrigger asChild>
                        <div className="flex items-center">
                            <div className="px-2">
                                <h2 className="font-medium text-gray-900">{order?.id}</h2>
                                <h2 className="font-medium text-gray-900">{order?.User?.firstName} {order?.User?.lastName}</h2>
                                <div className="text-xs text-gray-500">{order?.orderStatus[0]?.status === 'AWAITING_PAYMENT' && order?.isSolved === false && order?.notes ? 'Terjadi Masalah' : ''}</div>
                                <div className="text-xs text-gray-500">{order.createdAt.split('T')[0]} {order.createdAt.split('T')[1].split('.')[0]}</div>
                            </div>
                        </div>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>Ringkasan Masalah</DialogTitle>
                            <textarea
                                disabled
                                name="notes"
                                rows={4}
                                value={order?.notes}
                                className="w-full p-2 border rounded mt-2"
                            />
                        </DialogHeader>
                    </DialogContent>
                </Dialog>
                :
                <Dialog>
                    <DialogTrigger asChild>
                        <div className="flex items-center">
                            <div className="px-2">
                                <h2 className="font-medium text-gray-900">{order?.id}</h2>
                                <h2 className="font-medium text-gray-900">{order?.User?.firstName} {order?.User?.lastName}</h2>
                                <div className="text-xs text-gray-500">{order?.orderStatus[0]?.status === 'AWAITING_PAYMENT' && order?.isSolved === false && order?.notes ? 'Terjadi Masalah' : ''}</div>
                                <div className="text-xs text-gray-500">{order.createdAt.split('T')[0]} {order.createdAt.split('T')[1].split('.')[0]}</div>
                            </div>
                        </div>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>Buat Catatan</DialogTitle>
                            <DialogDescription>
                                Beri catatan untuk memproses data pesanan pengguna.
                            </DialogDescription>
                        </DialogHeader>
                        <Formik initialValues={{ notes: '' }} validationSchema={notesSchema} onSubmit={(values) => {
                            handleLaundryProblem({ notes: values.notes, orderId: order?.id })
                        }}>
                            <Form className='relative py-2 pt-5'>
                                <Field
                                    as="textarea"
                                    name="notes"
                                    rows={4}
                                    placeholder="Enter your notes"
                                    className="w-full p-2 border rounded"
                                />
                                <ErrorMessage name="notes" component="div" className="text-red-500 text-xs absolute top-[-2px]" />
                                <DialogFooter>
                                    <ButtonCustom disabled={isPending || isDisableSuccess} width="w-full" btnColor='bg-orange-500 hover:bg-orange-500' type="submit">Lanjutkan Proses</ButtonCustom>
                                </DialogFooter>
                            </Form>
                        </Formik>
                    </DialogContent>
                </Dialog>}
            <div className="flex gap-1">
                <Link href={`https://wa.me/${order?.User?.phoneNumber}`} className="flex items-center h-fit space-x-2 px-3 py-3 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg">
                    <FaWhatsapp />
                </Link>
            </div>
        </section>
    )
}