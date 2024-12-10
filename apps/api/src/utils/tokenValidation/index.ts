import dotenv from 'dotenv'
import jwt from 'jsonwebtoken'

dotenv.config()
const secret_key: string | undefined = process.env.JWT_SECRET as string

interface IToken {
    id: string,
    role: string
    storesId?: string
}

/* Set Token */
export const encodeToken = async ({ id, role, storesId }: IToken) => {
    if (storesId) {
        return await jwt.sign(
            { data: { id, role, storesId } }, secret_key, { expiresIn: '24h' })
    } else {
        return await jwt.sign({ data: { id, role } }, secret_key, { expiresIn: '24h' })
    }
}

/* Bongkar Token */
export const decodeToken = async (token: string) => {
    return jwt.verify(token, secret_key)
}