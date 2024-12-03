import {PrismaClient} from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    await prisma.worker.create({
        data: {
            
        }
    })
}

main().catch(()=>{

})