import * as Yup from 'yup'

export const resendEmailValidationSchema = Yup.object().shape({
    email: Yup.string()
        .required('Email harap diisi!')
        .matches(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, 'Format email tidak valid')
        .trim()
        .test('no-whitespace', 'Email tidak boleh hanya terdiri dari spasi',
            (value: string | undefined) => !!value && !/^\s+$/.test(value))
})