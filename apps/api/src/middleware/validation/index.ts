import { body } from "express-validator";

export const authRegisterValidation = [
    body(['email', 'firstName', 'lastName', 'phoneNumber']).notEmpty().withMessage('Harap diisi terlebih dahulu!'),
    body('email').isEmail().withMessage('Format email tidak valid')
        .trim().escape(),
    body('firstName').isString().trim().escape(),
    body('lastName').isString().trim().escape(),
    body('phoneNumber').isString()
        .matches(/^[0-9]+$/).withMessage('Nomor telepon hanya boleh berisi angka')
        .isLength({ min: 10, max: 15 }).withMessage('Nomor telepon harus memiliki panjang 10-15 digit')
        .trim().escape()
]

export const authLoginValidation = [
    body(['email', 'password']).notEmpty().withMessage('Harap diisi terlebih dahulu!'),
    body('email').isEmail().withMessage('Format email tidak valid').trim().escape(),
    body('password').isString().isLength({ min: 8 }).withMessage('Password minimal 8 karakter').trim().escape(),
]

export const createWorkerValidation = [
    body(['email', 'firstName', 'lastName', 'phoneNumber', 'identityNumber', 'storeId', 'workerRole']).notEmpty().withMessage('Harap diisi terlebih dahulu!'),
    body('email').isString().escape(),
    body('firstName').isString().escape(),
    body('lastName').isString().escape(),
    body('phoneNumber').isString().escape(),
    body('identityNumber').isString().escape(),
    body('storeId').isString().escape(),
    body('workerRole').isString().escape(),
]

export const resendSetPasswordValidation = [
    body(['email']).notEmpty().withMessage('Harap diisi terlebih dahulu!'),
    body('email').isString().escape(),
]

export const forgotPasswordUserValidation = [
    body(['email']).notEmpty().withMessage('Harap diisi terlebih dahulu!'),
    body('email').isString().escape(),
]

export const setPasswordValidation = [
    body(['password']).notEmpty().withMessage('Harap diisi terlebih dahulu!'),
    body('password').isString().escape(),
]

export const productLaundryValidation = [
    body(['itemName']).notEmpty().withMessage('Harap diisi terlebih dahulu!'),
    body('itemName').isString().escape(),
]

export const updateProfileWorkerValidation = [
    body(['email', 'firstName', 'lastName', 'phoneNumber']).notEmpty().withMessage('Harap diisi terlebih dahulu!'),
    body('email').isString().escape(),
    body('firstName').isString().escape(),
    body('lastName').isString().escape(),
    body('phoneNumber').isString().escape(),
]

export const changePasswordWorkerValidation = [
    body(['password', 'existingPassword']).notEmpty().withMessage('Harap diisi terlebih dahulu!'),
    body('password').isString().escape(),
    body('existingPassword').isString().escape(),
]

export const updateProfileUserValidation = [
    body(['email', 'firstName', 'lastName', 'phoneNumber']).notEmpty().withMessage('Harap diisi terlebih dahulu!'),
    body('email').isString().escape(),
    body('firstName').isString().escape(),
    body('lastName').isString().escape(),
    body('phoneNumber').isString().escape(),
]

export const changePasswordUserValidation = [
    body(['password', 'existingPassword']).notEmpty().withMessage('Harap diisi terlebih dahulu!'),
    body('password').isString().escape(),
    body('existingPassword').isString().escape(),
]

export const changePasswordGoogleValidation = [
    body(['password']).notEmpty().withMessage('Harap diisi terlebih dahulu!'),
    body('password').isString().escape(),
]

export const createContactValidation = [
    body(['email', 'phoneNumber', 'textHelp', 'name']).notEmpty().withMessage('Harap diisi terlebih dahulu'),
    body('email').isString().escape(),
    body('phoneNumber').isString().escape(),
    body('textHelp').isString().escape(),
    body('name').isString().escape(),
]

export const formAddressValidation = [
    body(["addressName", "addressDetail", "province", "city", "zipCode"]).notEmpty().withMessage('Harap diisi terlebih dahulu'),
    body('addressName').isString().escape(),
    body('addressDetail').isString().escape(),
    body('province').isString().escape(),
    body('city').isString().escape(),
    body('zipCode').isNumeric().withMessage('Kode pos harus berupa angka').isLength({ min: 4 }).withMessage('Kode pos minimal 4 digit').escape(),
]

export const requestPickUpValidation = [
    body(['orderTypeId', 'userAddressId']).notEmpty().withMessage('Harap diisi terlebih dahulu'),
    body('orderTypeId').isString().escape(),
    body('userAddressId').isString().escape(),
]

export const createOutletValidation = [
    body(["storeName", 'address', 'city', 'province', 'latitude', 'longitude', 'zipCode']).notEmpty().withMessage('Harap diisi terlebih dahulu'),
    body("storeName").trim().isString().matches(/^[A-Za-z0-9\s\-]+$/).withMessage("Nama Outlet hanya berisi huruf").escape(),
    body("address").trim().isString().matches(/^[A-Za-z0-9\s.,-]+$/).withMessage("Format alamat tidak valid").escape(),
    body("city").trim().isString().escape(),
    body("province").trim().isString().escape(),
    body("zipCode").trim().matches(/^[0-9]+$/).withMessage("Kode Pos hanya berisi angka").escape(),
    body("latitude").isFloat().withMessage("Latitude harus berupa angka desimal").escape(),
    body("longitude").isFloat().withMessage("Longitude harus berupa angka desimal").escape(),
];
