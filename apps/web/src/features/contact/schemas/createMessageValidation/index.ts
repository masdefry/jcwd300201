import * as Yup from 'yup'

export const createMessageValidation = Yup.object().shape({
    email: Yup.string()
        .email('Harap masukan email yang valid')
        .required('Harap diisi terlebih dahulu')
        .matches(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, 'Format email tidak valid')
        .test('no-whitespace', 'Email tidak boleh hanya terdiri dari spasi', (value: string | undefined) => !!value && !/^\s+$/.test(value)),

    textHelp: Yup.string()
        .max(255, 'Teks laporan tidak boleh lebih dari 255 karakter.')
        .required('Harap diisi terlebih dahulu')
        .matches(/^[a-zA-Z0-9\s.,!?'-]+$/, 'Harap masukan format yang benar')
        .test('no-whitespace', 'Harap diisi terlebih dahulu', (value: string | undefined) => !!value && !/^\s+$/.test(value)),

    phoneNumber: Yup.string().matches(/^[0-9]+$/, 'Nomor telepon hanya boleh berisi angka')
        .min(10, 'Minimal 10 angka')
        .max(15, 'Maximal 15 angka')
        .required('Harap diisi terlebih dahulu')
        .test('no-whitespace', 'Nomor telepon tidak boleh hanya terdiri dari spasi', (value: string | undefined) => !!value && !/^\s+$/.test(value)),

    name: Yup.string()
        .matches(/^[a-zA-Z\s]+$/, 'Harap masukan format dengan benar')
        .required('Harap diisi terlebih dahulu')
        .test('no-whitespace', 'Nama tidak boleh hanya terdiri dari spasi', (value: string | undefined) => !!value && !/^\s+$/.test(value))
})