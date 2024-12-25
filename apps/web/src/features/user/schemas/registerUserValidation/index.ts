import * as Yup from 'yup'

export const registerUserValidation = Yup.object().shape({
    email: Yup.string()
        .required('Email harap diisi!')
        .matches(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, 'Format email tidak valid')
        .test('no-whitespace', 'Email tidak boleh hanya terdiri dari spasi', (value: any) => value && !/^\s+$/.test(value))
        .trim(),

    firstName: Yup.string()
        .required('Nama depan harap diisi!')
        .matches(/^[A-Za-z]+$/, 'Format nama tidak valid')
        .test('no-whitespace', 'Harap diisi terlebih dahulu', (value: any) => value && !/^\s+$/.test(value))
        .trim(),

    lastName: Yup.string()
        .required('Nama belakang harap diisi!')
        .matches(/^[A-Za-z]+$/, 'Format nama tidak valid')
        .test('no-whitespace', 'Harap diisi terlebih dahulu', (value: any) => value && !/^\s+$/.test(value))
        .trim(),

    phoneNumber: Yup.string()
        .required('Nomor telepon harap diisi!')
        .matches(/^[0-9]+$/, 'Nomor telepon hanya boleh berisi angka')
        .test('no-whitespace', 'Nomor telepon tidak boleh hanya terdiri dari spasi', (value: any) => value && !/^\s+$/.test(value))
        .trim(),
});