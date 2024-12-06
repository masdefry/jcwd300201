import { body } from "express-validator";

export const authCustomerValidation = [
    body(['email', 'password', 'firstName', 'lastName', 'phoneNumber']).notEmpty().withMessage('Harap diisi terlebih dahulu!'),
    body('email').isString().escape(),
    body('password').isString().escape(),
    body('firstName').isString().escape(),
    body('lastName').isString().escape(),
    body('phoneNumber').isString().escape()
]

export const authLoginValidation = [
    body(['email', 'password']).notEmpty().withMessage('Harap diisi terlebih dahulu!'),
    body('email').isString().escape(),
    body('password').isString().escape(),
]