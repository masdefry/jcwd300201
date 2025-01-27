import { Formik, Form, Field, ErrorMessage } from "formik";
import { userComplaintValidationSchema } from "../../schemas/userComplaintValidationSchema";
import ButtonCustom from "@/components/core/buttonCustom";
import { IFormikComplaintMobile } from "./type";

export default function FormikComplaintMobile({ isPending, handleComplaint }: IFormikComplaintMobile) {
    return (
        <Formik
            initialValues={{
                complaintText: '',
            }}
            validationSchema={userComplaintValidationSchema}
            onSubmit={(values) => {
                handleComplaint({
                    complaintText: values.complaintText
                })
            }}
        >
            {({ setFieldValue }) => (
                <Form className="space-y-4">
                    <div>

                        <Field
                            as="textarea"
                            id="complaintText"
                            name="complaintText"
                            placeholder="Tuliskan komplain Anda"
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
                                setFieldValue('complaintText', e.target.value);
                            }}
                        />
                        <ErrorMessage
                            name="complaintText"
                            component="div"
                            className="text-red-500 text-sm mt-1"
                        />
                    </div>
                    <ButtonCustom
                        disabled={isPending}
                        btnColor="bg-blue-500 hover:bg-blue-600" type="submit" width="w-full"
                    >
                        {isPending ? 'Mengirim Komplain..' : 'Kirim Komplain'}
                    </ButtonCustom>
                </Form>
            )}
        </Formik>
    )
}