'use client'
import ButtonCustom from "@/components/core/buttonCustom";
import { FaPlus } from "react-icons/fa6";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { ErrorMessage, Field, Form, Formik } from "formik";
import { createProductLaundryValidationSchema } from "@/features/superAdmin/schemas/createProductLaundryValidationSchema";


export default function DialogCreateProduct({ createProductItem, isPending }: { createProductItem: any, isPending: boolean }) {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <ButtonCustom rounded="rounded-2xl flex gap-2 items-center" btnColor="bg-orange-500"><FaPlus /> Buat Data Produk</ButtonCustom>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Buat item baru</DialogTitle>
                    <DialogDescription>
                        Harap masukan nama produk atau item yang ingin ditambahkan.
                    </DialogDescription>
                </DialogHeader>
                <div className="w-full">
                    <Formik
                        initialValues={{ itemName: '' }}
                        validationSchema={createProductLaundryValidationSchema}
                        onSubmit={(values, { resetForm }) => createProductItem({ itemName: values?.itemName }, {
                            onSuccess: () => {
                                resetForm()
                            }
                        })}>
                        <Form className="w-full">
                            <div className="space-y-2 flex flex-col relative">
                                <label htmlFor="itemName" className="font-semibold">Nama Produk <span className="text-red-500">*</span></label>
                                <Field name='itemName' placeholder="Masukan Nama Item.."
                                    className='border focus:outline-none py-2 px-4' />
                                <ErrorMessage component='div' className="text-red top-0 right-0 absolute text-xs text-red-500" name="itemName" />
                            </div>
                            <div className="py-2 w-full flex justify-end">
                                <ButtonCustom disabled={isPending} type="submit" rounded="rounded-2xl flex gap-2 items-center" btnColor="bg-orange-500 text-sm">Tambah</ButtonCustom>
                            </div>
                        </Form>
                    </Formik>
                </div>
            </DialogContent>
        </Dialog>
    );
}