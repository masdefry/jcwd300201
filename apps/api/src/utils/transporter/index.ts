import nodemailer from 'nodemailer'
import dotenv from 'dotenv'

dotenv.config()
export const transporter = nodemailer.createTransport({
    service: process.env.TRANSPORTER_PROVIDER_SERVICE,
    auth: {
        user: process.env.TRANSPORTER_EMAIL_USER,
        pass: process.env.TRANSPORTER_PASSWORD_USER 
    },
    tls: {
        rejectUnauthorized: false
    }
})