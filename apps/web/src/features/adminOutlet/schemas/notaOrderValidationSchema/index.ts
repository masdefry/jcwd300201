import * as Yup from 'yup'

export const notaOrderValidationSchema = Yup.object().shape({
    quantity: Yup.number()
        .min(1, 'Quantity minimal 1 pcs')
        .required('Quantity wajib diisi')
        .max(100, 'Quantity maksimal 100 pcs'),
    totalWeight: Yup.number()
        .min(1, 'Berat minimal 1 kg')
        .required('Total berat wajib wajib diisi')
        .max(200, 'Berat maksimal 200 kg'),
    items: Yup.array().min(1, 'wajib memasukkan minimal 1 item')
});