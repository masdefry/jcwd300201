import * as Yup from 'yup'

export const createUserValidation = Yup.object().shape({
    email: Yup.string().email('Harap masukan email yang valid').required('Harap diisi'),
    firstName: Yup.string().required('Harap diisi'),
    lastName: Yup.string().required('Harap diisi'),
    phoneNumber: Yup.string().required('Harap diisi'),
    workerRole: Yup.string().required('Harap diisi'),
    identityNumber: Yup.string().required('Harap diisi'),
    storeId: Yup.string().required('Harap diisi'),
})