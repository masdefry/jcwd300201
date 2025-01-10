import * as Yup from 'yup'

export const userComplaintValidationSchema = Yup.object({
    complaintText: Yup.string()
        .required('Komplain wajib diisi')
        .min(10, 'Komplain harus lebih dari 10 karakter'),
})