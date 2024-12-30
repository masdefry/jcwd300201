import * as Yup from 'yup'


export const packingChangePasswordValidation =
    Yup.object().shape({
        existingPassword: Yup.string().required('Password lama harus diisi'),
        password: Yup.string().required('Password baru harus diisi'),
        confirmPassword: Yup.string().required('Konfirmasi password harus diisi').oneOf([Yup.ref('password')], 'Konfirmasi password tidak cocok')
    })
