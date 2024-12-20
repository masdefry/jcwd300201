import { body } from "express-validator";

export const authRegisterValidation = [
    body(['email', 'firstName', 'lastName', 'phoneNumber']).notEmpty().withMessage('Harap diisi terlebih dahulu!'),
    body('email').isString().escape(),
    body('firstName').isString().escape(),
    body('lastName').isString().escape(),
    body('phoneNumber').isString().escape()
]

export const authLoginValidation = [
    body(['email', 'password']).notEmpty().withMessage('Harap diisi terlebih dahulu!'),
    body('email').isString().escape(),
    body('password').isString().escape(),
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