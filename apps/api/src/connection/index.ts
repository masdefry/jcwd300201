import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient()

export const dbConnect = async()=>{
    try {
        await prisma.$connect()
        console.log('Database Connect')
    } catch (error) {
        console.log(error, 'Database tidak terhubung')
    }
}

export default prisma