import * as Yup from 'yup'

export const createAddressValidationSchema = Yup.object().shape({
    addressName: Yup.string()
        .trim() 
        .matches(/^[a-zA-Z0-9\s\-\,\.]+$/, "Jenis alamat tidak valid")
        .test('no-whitespace', 'Nama Alamat tidak boleh hanya terdiri dari spasi', (value: string | undefined) => {
            return value && !/^\s+$/.test(value) ? true : false;
        })
        .required("Nama Alamat harap diisi!"),

    addressDetail: Yup.string()
        .trim()
        .matches(/^[a-zA-Z0-9\s\-\,\.]+$/, "Alamat tidak valid")
        .test('no-whitespace', 'Alamat tidak boleh hanya terdiri dari spasi', (value: string | undefined) => {
            return value && !/^\s+$/.test(value) ? true : false;
        })
        .required("Alamat harap diisi!"),

    province: Yup.string()
        .trim()
        .test('no-whitespace', 'Provinsi tidak boleh hanya terdiri dari spasi', (value: string | undefined) => {
            return value && !/^\s+$/.test(value) ? true : false;
        })
        .required("Provinsi harap diisi!"),

    city: Yup.string()
        .trim()
        .matches(/^[a-zA-Z\s]+$/, "Kota tidak valid")
        .test('no-whitespace', 'Kota tidak boleh hanya terdiri dari spasi', (value: string | undefined) => {
            return value && !/^\s+$/.test(value) ? true : false;
        })
        .required("Kota harap diisi!"),

    zipCode: Yup.string()
        .trim()
        .matches(/^\d{5}$/, "Kode Pos maximal 5 angka")
        .test('no-whitespace', 'Kode Pos tidak boleh hanya terdiri dari spasi', (value: string | undefined) => {
            return value && !/^\s+$/.test(value) ? true : false;
        })
        .required("Kode Pos harap diisi!"),
});