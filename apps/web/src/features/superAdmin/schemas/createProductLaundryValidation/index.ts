import * as Yup from 'yup'

export const createProductLaundryValidation = Yup.object().shape({
    itemName: Yup.string()
        .min(3, 'Harap masukan nama yang valid')
        .required('harap diisi terlebih dahulu')
        .matches(/^[A-Za-z]+$/, 'Format nama tidak valid')
        .trim()
        .test('no-whitespace', 'Email tidak boleh hanya terdiri dari spasi', (value: any) => value && !/^\s+$/.test(value))
})
