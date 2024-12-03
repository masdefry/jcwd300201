import bcrypt from 'bcrypt'

/* Hash password user */
export const hashPassword = async (password:string) => {
    const saltRound = 10
    return await bcrypt.hash(password, saltRound)
}

/* Compare db password user */
export const comparePassword = async (passwordInput: string, passwordDb: string) => {
    return await bcrypt.compare(passwordInput, passwordDb)
}