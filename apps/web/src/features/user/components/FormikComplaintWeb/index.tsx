import { Formik, Form, Field, ErrorMessage } from "formik";
import { userComplaintValidationSchema } from "../../schemas/userComplaintValidationSchema";
import ButtonCustom from "@/components/core/buttonCustom";
import { IFormikComplaintWeb } from "./type";

export default function FormikComplaintWeb({ isPending, handleComplaint }: IFormikComplaintWeb) {
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
            {({ setFieldValue, values }) => (
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
                        disabled={isPending || !values.complaintText}
                        btnColor="bg-blue-500 hover:bg-blue-600" type="submit" width="w-full"
                    >
                        {isPending ? 'Memproses Komplain..' : 'Kirim Komplain'}
                    </ButtonCustom>
                </Form>
            )}
        </Formik>
    )
}