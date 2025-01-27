'use client'

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { ErrorMessage, Field, Form, Formik } from "formik";
import { createProductLaundryValidationSchema } from "@/features/superAdmin/schemas/createProductLaundryValidationSchema";
import { BsPencil } from "react-icons/bs";
import ButtonCustom from "@/components/core/buttonCustom";

export default function DialogUpdateProduct({ product, handleUpdateItem, isPendingUpdate }: { product: any, handleUpdateItem: any, isPendingUpdate: boolean }) {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <button className="py-2 hover:bg-blue-500 px-2 bg-blue-600 rounded-xl"><BsPencil className="text-white" /> </button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Edit item</DialogTitle>
                    <DialogDescription>
                        Harap masukan nama produk atau item yang ingin ditambahkan.
                    </DialogDescription>
                </DialogHeader>
                <div className="w-full">
                    <Formik
                        initialValues={{ itemName: product?.itemName || '' }}
                        validationSchema={createProductLaundryValidationSchema}
                        onSubmit={(values, { resetForm }) => handleUpdateItem({ id: product?.id, itemName: values?.itemName }, {
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
                                <ButtonCustom disabled={isPendingUpdate} type="submit" rounded="rounded-2xl flex gap-2 items-center" btnColor="bg-orange-500 text-sm">Ubah</ButtonCustom>
                            </div>
                        </Form>
                    </Formik>
                </div>
            </DialogContent>
        </Dialog>
    );
}