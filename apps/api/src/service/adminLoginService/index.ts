import prisma from "@/connection"
import { validateEmail } from "@/middleware/validation/emailValidation"
import { comparePassword } from "@/utils/passwordHash"
import { encodeToken } from "@/utils/tokenValidation"
import { ILoginBody } from "./types"

export const adminLoginService = async ({ email, password }: ILoginBody) => {

    if (!validateEmail(email)) throw { msg: 'Harap masukan format email dengan benar', status: 400 }

    const findAdmin = await prisma.worker.findFirst({
        where: { email }
    })

    if (!findAdmin) throw { msg: 'User admin tidak tersedia', status: 404 }

    const match = await comparePassword(password, findAdmin?.password)
    if (!match) throw { msg: 'Password anda salah!', status: 401 }

    const token = await encodeToken({ id: findAdmin?.id, role: findAdmin?.workerRole })

    return { token, findAdmin }
}