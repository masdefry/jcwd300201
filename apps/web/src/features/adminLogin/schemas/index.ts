import * as Yup from 'yup'

const loginAdminValidation = Yup.object({
    email: Yup.string().required('Email harap diisi!'),
    password: Yup.string().min(8, 'Password minimal 8 huruf').required('Password harap diisi!')
})

export { loginAdminValidation }