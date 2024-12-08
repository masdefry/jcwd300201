import { body } from "express-validator";

export const authCustomerValidation = [
    body(['email', 'password', 'firstName', 'lastName', 'phoneNumber']).notEmpty().withMessage('Harap diisi terlebih dahulu!'),
    body('email').isString().escape(),
    body('password').isString().isLength({ min: 6 }).withMessage('Password harus memiliki minimal 6 karakter!').escape(),
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
    body(['email', 'firstName', 'lastName', 'phoneNumber', 'identityNumber', 'storesId', 'workerRole']).notEmpty().withMessage('Harap diisi terlebih dahulu!'),
    body('email').isString().escape(),
    body('firstName').isString().escape(),
    body('lastName').isString().escape(),
    body('phoneNumber').isString().escape(),
    body('identityNumber').isString().escape(),
    body('storesId').isString().escape(),
    body('workerRole').isString().escape(),
]
