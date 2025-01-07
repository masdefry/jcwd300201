import * as Yup from 'yup'


export const driverChangePasswordValidationSchema =
    Yup.object().shape({
        existingPassword: Yup.string().required('Password harus diisi'),
        password: Yup.string().min(8, 'Password minimal 8 huruf').required('Password harap diisi!')
            .min(8, 'Password minimal 8 karakter')
            .trim()
            .matches(/[A-Z]/, 'Password harus memiliki satu huruf besar')
            .matches(/[a-z]/, 'Password harus memiliki satu huruf kecil')
            .matches(/[0-9]/, 'Password harus memiliki satu angka')
            .matches(/[@$!%*?&#]/, 'Password harus memiliki satu karakter')
            .matches(/^[A-Za-z0-9@$!%*?&#]+$/, 'Karakter tidak valid'),
        confirmPassword: Yup.string().required('Password harus diisi').oneOf([Yup.ref('password')], 'Konfirmasi password tidak cocok')
    })
