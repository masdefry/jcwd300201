import { IReportContent } from "./type";
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

export default function ReportContentWeb(
    { order, handleLaundryProblem, isPending, isDisableSuccess, page, i }: IReportContent
) {
    return (
        <tr className="hover:bg-gray-100 border-b" key={order?.id || i}>
            <td className="py-4 px-6 text-sm text-gray-600 break-words">{(page - 1) * page + i + 1}</td>
            <td className="py-4 px-6 text-sm text-gray-600 break-words">{order?.id}</td>
            <td className="py-4 px-6 text-sm text-gray-600 break-words">{order?.User?.firstName}</td>
            <td className="py-4 px-6 text-sm text-gray-600 break-words">{order?.isSolved === true ? 'Terselesaikan' : 'Masih terjadi masalah'}</td>
            <td className="py-4 px-6 text-sm hover:underline break-words">
                {order?.notes && order?.isSolved === true ?
                    <Dialog>
                        <DialogTrigger asChild>
                            <button className="text-blue-700 hover:text-blue-500 disabled:text-neutral-400">View</button>
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
                            <button className='text-blue-700 hover:text-blue-500 disabled:text-neutral-400'>View</button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                                <DialogTitle>Buat Catatan</DialogTitle>
                                <DialogDescription>
                                    Beri catatan untuk memproses data pesanan pengguna.
                                </DialogDescription>
                            </DialogHeader>
                            <Formik initialValues={{ notes: order?.notes || '' }} validationSchema={notesSchema} onSubmit={(values) => {
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
                                        <ButtonCustom disabled={isPending} width="w-full" btnColor='bg-orange-500 hover:bg-orange-500' type="submit">Lanjutkan Proses</ButtonCustom>
                                    </DialogFooter>
                                </Form>
                            </Formik>
                        </DialogContent>
                    </Dialog>}
            </td>
        </tr>
    )
}