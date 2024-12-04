import { PrismaClient } from "@prisma/client";
import { dbConnected } from "@/utils/asciiText/dbConnect";

const prisma = new PrismaClient()

export const dbConnect = async (): Promise<void> =>{
    try {
        await prisma.$connect()
        console.log(dbConnected)
    } catch (error) {
        console.log(error, 'Database tidak terhubung')
    }
}

export default prisma