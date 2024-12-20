import dotenv from 'dotenv'
import jwt from 'jsonwebtoken'

dotenv.config()
const secret_key: string | undefined = process.env.JWT_SECRET as string

interface IToken {
    id: string,
    role: string
    storeId?: string
    expiresIn?: string
}

/* Set Token */
export const encodeToken = async ({ id, role, storeId, expiresIn = '24h' }: IToken) => {
    if (storeId) {
        return await jwt.sign({ data: { id, role, storeId } }, secret_key, { expiresIn: expiresIn })
    } else {
        return await jwt.sign({ data: { id, role } }, secret_key, { expiresIn: expiresIn })
    }
}

/* Bongkar Token */
export const decodeToken = async (token: string) => {
    return jwt.verify(token, secret_key)
}