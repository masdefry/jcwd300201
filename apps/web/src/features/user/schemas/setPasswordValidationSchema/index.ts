import * as Yup from 'yup'

const setPasswordValidationSchema = Yup.object().shape({
    password: Yup.string().min(8, 'Password minimal 8 huruf').required('Password harap diisi!')
        .min(8, 'Password minimal 8 karakter')
        .trim()
        .matches(/[A-Z]/, 'Password harus memiliki satu huruf besar')
        .matches(/[a-z]/, 'Password harus memiliki satu huruf kecil')
        .matches(/[0-9]/, 'Password harus memiliki satu angka')
        .matches(/[@$!%*?&#]/, 'Password harus memiliki satu karakter')
        .matches(/^[A-Za-z0-9@$!%*?&#]+$/, 'Karakter tidak valid'),
    confirmPassword: Yup.string().oneOf([Yup.ref('password'), ''], 'Password tidak sama'),
})

export { setPasswordValidationSchema }