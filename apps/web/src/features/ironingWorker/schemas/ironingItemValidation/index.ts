import * as Yup from 'yup'

export const ironingItemValidation = Yup.object().shape({
    itemName: Yup.string().required('Nama item wajib diisi'),
    quantity: Yup.number()
        .min(1, 'Quantity minimal 1 pcs')
        .max(100, 'Quantity maksimal 100 pcs')
        .required('Quantity wajib diisi'),
    items: Yup.array().min(1, 'wajib memasukkan minimal 1 item')
});