import * as Yup from 'yup'

export const createUserValidationSchema = Yup.object().shape({
    email: Yup.string()
        .matches(/^[\w.%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/, 'Email tidak valid')
        .email('Harap masukan email yang valid')
        .required('Harap diisi')
        .trim(),

    firstName: Yup.string()
        .matches(/^[a-zA-Z\s]+$/, 'Nama depan hanya boleh mengandung huruf dan spasi')
        .required('Harap diisi')
        .trim(),

    lastName: Yup.string()
        .matches(/^[a-zA-Z\s]+$/, 'Nama belakang hanya boleh mengandung huruf dan spasi')
        .required('Harap diisi')
        .trim(),

    phoneNumber: Yup.string()
        .matches(/^(?:\+62|0)[2-9][0-9]{7,10}$/, 'Nomor telepon tidak valid')
        .required('Harap diisi')
        .trim(),
        
    workerRole: Yup.string()
        .required('Harap diisi')
        .trim(),

    identityNumber: Yup.string()
        .matches(/^\d{16}$/, 'Harus memiliki 16 angka')
        .required('Harap diisi')
        .trim(),

    outletId: Yup.string()
        .required('Harap diisi')
        .trim(),

    shiftId: Yup.string()
        .required('Harap diisi')
        .trim(),
})