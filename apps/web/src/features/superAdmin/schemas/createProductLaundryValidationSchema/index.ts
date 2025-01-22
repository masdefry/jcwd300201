import * as Yup from 'yup'

export const createProductLaundryValidationSchema = Yup.object().shape({
    itemName: Yup.string()
        .min(3, 'Harap masukan nama yang valid')
        .required('harap diisi terlebih dahulu')
        .trim()
        .test('no-whitespace', 'Email tidak boleh hanya terdiri dari spasi', (value: string | undefined) => !!value && !/^\s+$/.test(value))
})
