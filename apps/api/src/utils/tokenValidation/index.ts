import dotenv from 'dotenv'
import jwt from 'jsonwebtoken'

dotenv.config()
const secret_key: string | undefined = process.env.JWT_SECRET as string

interface IToken {
    id: string,
    role: string
}

/* Set Token */
export const encodeToken = async ({ id, role }: IToken) => {
    return await jwt.sign(
        { data: { id, role } },
        secret_key
        , { expiresIn: '24h' })
}

/* Bongkar Token */
export const decodeToken = async (token: string) => {
    return jwt.verify(token, secret_key)
}
