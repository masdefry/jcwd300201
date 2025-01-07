import * as Yup from 'yup'

const updateOutletValidationSchema = Yup.object().shape({
    storeName: Yup.string()
        .strict()
        .trim()
        .matches(/^[^<>]*$/, "Nama tidak valid.")
        .required("Nama Toko wajib diisi"),
    address: Yup.string()
        .strict()
        .trim()
        .matches(/^[^<>]*$/, "Alamat tidak valid.")
        .required("Alamat wajib diisi"),
    province: Yup.string()
        .strict()
        .trim()
        .matches(/^[^<>]*$/, "Provinsi tidak valid.")
        .required("Provinsi wajib diisi"),
    city: Yup.string()
        .strict()
        .trim()
        .matches(/^[^<>]*$/, "Kota tidak valid.")
        .required("Kota wajib diisi"),
    zipCode: Yup.string()
        .strict()
        .trim()
        .matches(/^[0-9]+$/, "Kode Pos tidak valid.")
        .required("Kode Pos wajib diisi"),
})

export { updateOutletValidationSchema }