import nodemailer from 'nodemailer'
export const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'tiketbox88@gmail.com',
        pass: 'huobxyafyutvorwm' 
    },
    tls: {
        rejectUnauthorized: false
    }
})