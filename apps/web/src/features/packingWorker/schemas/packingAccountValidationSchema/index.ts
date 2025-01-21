import * as Yup from 'yup'

export const packingAccountValidationSchema = Yup.object().shape({
    firstName: Yup.string()
        .matches(/^[a-zA-Z\s]+$/, 'Nama hanya boleh mengandung huruf dan spasi')
        .required('Nama wajib diisi')
        .trim(),

    email: Yup.string()
        .required('Email harap diisi!')
        .matches(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, 'Format email tidak valid')
        .test('no-whitespace', 'Email tidak boleh hanya terdiri dari spasi', (value: string | undefined) => !!value && !/^\s+$/.test(value)),

    lastName: Yup.string()
        .matches(/^[a-zA-Z\s]+$/, 'Nama hanya boleh mengandung huruf dan spasi')
        .required('Nama wajib diisi')
        .trim(),

    phoneNumber: Yup.string()
        .matches(/^\d{10,15}$/, 'Nomor telepon harus berupa angka 10-15 digit')
        .required('Nomor Telepon wajib diisi')
        .trim()
})