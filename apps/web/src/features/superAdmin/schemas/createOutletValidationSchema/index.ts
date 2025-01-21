import * as Yup from 'yup'

export const createOutletValidationSchema = Yup.object().shape({
    storeName: Yup.string()
        .matches(/^[A-Za-z0-9\s\-]+$/, "Format nama tidak valid")
        .required("Nama outlet harap diisi!")
        .test("not-only-spaces", "Nama Outlet tidak boleh kosong",
            (value: string | undefined) => !!value && value.trim() !== ""
        ).trim(),
    address: Yup.string()
        .matches(/^[A-Za-z0-9\s.,-]+$/, "Format alamat tidak valid")
        .required("Alamat harap diisi!")
        .test("not-only-spaces", "Nama alamat tidak boleh kosong",
            (value: string | undefined) => !!value && value.trim() !== ""
        ).trim(),
    province: Yup.string().required("Provinsi harap diisi!"),
    city: Yup.string().required("Kota harap diisi!"),
    zipCode: Yup.string()
        .matches(/^[0-9]+$/, "Kode Pos hanya berisi angka")
        .max(5, 'Maximal 5 angka')
        .required("Kode Pos harap diisi!")
        .test("not-only-spaces", "Kode pos tidak boleh kosong",
            (value: string | undefined) => !!value && value.trim() !== ""
        ).trim(),
})