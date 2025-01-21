import * as Yup from 'yup'

const loginUserValidationSchema = Yup.object().shape({
    email: Yup.string()
        .required('Email harap diisi!')
        .matches(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, 'Format email tidak valid')
        .test('no-whitespace', 'Email tidak boleh hanya terdiri dari spasi', (value: string | undefined) => !!value && !/^\s+$/.test(value)),

    password: Yup.string().min(8, 'Password minimal 8 karakter').required('Password harap diisi!')
})

export { loginUserValidationSchema }