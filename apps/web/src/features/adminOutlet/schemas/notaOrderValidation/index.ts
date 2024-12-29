import * as Yup from 'yup'

export const notaOrderValidation = Yup.object().shape({
    itemName: Yup.string().required('Nama item wajib diisi'),
    quantity: Yup.number()
        .min(1, 'Quantity minimal 1')
        .required('Harga tiket wajib diisi'),
    totalWeight: Yup.number()
        .min(1, 'Berat minimal 1 kg')
        .required('Harga tiket wajib diisi'),
    items: Yup.array().min(1, 'wajib memasukkan minimal 1 item')
});