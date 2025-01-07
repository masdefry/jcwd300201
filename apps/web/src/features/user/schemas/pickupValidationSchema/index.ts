import * as Yup from 'yup'

export const pickupValidationSchema = Yup.object({
    deliveryFee: Yup.number().required().positive().integer(),
    outletId: Yup.string().required(),
    orderTypeId: Yup.string().required('Silahkan pilih tipe laundry'),
    userAddressId: Yup.string().required(),
});