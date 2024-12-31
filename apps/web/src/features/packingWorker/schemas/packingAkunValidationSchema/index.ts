import * as Yup from 'yup'


export const packingAkunValidation =
    Yup.object().shape({
        firstName: Yup.string().required('Nama wajib diisi'),
        lastName: Yup.string().required('Nama wajib diisi'),
        phoneNumber: Yup.string().required('Nomor Telepon wajib diisi')
    })
