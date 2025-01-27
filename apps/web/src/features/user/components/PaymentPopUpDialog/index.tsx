import { Dialog, DialogContent,DialogDescription, DialogFooter,DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Formik, Form, ErrorMessage } from "formik";
import { paymentValidationSchema } from "../../schemas/paymentValidationSchema";
import { Button } from "@/components/ui/button";
import { IPaymentPopUpDialog } from "./type";

export default function PaymentPopUpDialog({ isUploadDialogOpen, setIsUploadDialogOpen, isUploading, uploadPaymentProof }: IPaymentPopUpDialog) {
    return (
        <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Upload Bukti Pembayaran</DialogTitle>
                    <DialogDescription>
                        Silakan unggah bukti pembayaran Anda di bawah ini.
                    </DialogDescription>
                </DialogHeader>
                <Formik
                    initialValues={{ images: null }}
                    validationSchema={paymentValidationSchema}
                    onSubmit={(values: any) => {
                        const fd = new FormData();
                        fd.append("images", values.images);
                        uploadPaymentProof(fd)
                    }}>
                    {({ setFieldValue }) => (
                        <Form>
                            <div className="mt-4">
                                <label className="block mb-2 text-sm font-medium text-gray-600">
                                    Upload File
                                </label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(event: any) => setFieldValue("images", event.currentTarget.files[0])}
                                    className="block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                />
                                <ErrorMessage
                                    name="images"
                                    component="div"
                                    className="text-red-600 text-sm mt-1"
                                />
                            </div>
                            <DialogFooter>
                                <Button
                                    variant="secondary"
                                    type="button"
                                    onClick={() => setIsUploadDialogOpen(false)}
                                    disabled={isUploading}>
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    className="bg-blue-600 hover:bg-blue-700"
                                    disabled={isUploading}>
                                    {isUploading ? "Uploading..." : "Upload"}
                                </Button>
                            </DialogFooter>
                        </Form>
                    )}
                </Formik>
            </DialogContent>
        </Dialog>
    )
}