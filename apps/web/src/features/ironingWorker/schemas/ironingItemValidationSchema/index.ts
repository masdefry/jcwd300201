import * as Yup from 'yup'

export const ironingItemValidationSchema = Yup.object().shape({
    itemName: Yup.string().when('items', (items: any[], schema: Yup.StringSchema) => {
        return Array.isArray(items) && items.length === 0
            ? schema.required('Nama item wajib diisi')
            : schema;
    }),
    quantity: Yup.number()
        .min(1, 'Quantity minimal 1 pcs')
        .max(100, 'Quantity maksimal 100 pcs')
        .required('Quantity wajib diisi'),
    items: Yup.array().min(1, 'wajib memasukkan minimal 1 item')
});