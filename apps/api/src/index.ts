import express, { Express, NextFunction, Request, Response } from 'express'
import cors from 'cors'
import router from './routes'
import dotenv from 'dotenv'
import { dbConnect } from './connection'
import { portConnect } from './utils/asciiText/dbConnect'
import fs from 'fs'

dotenv.config()
const port: string | undefined = process.env.PORT as string

const app: Express = express()
app.use(express.json())

const corsOption = {
    origin: '*',
    credentials: true
}
app.use(cors(corsOption))
app.use('/api', router)

interface IError extends Error {
    msg: string,
    status: number
}


interface UploadedFiles {
    images?: { path: string }[];
}



app.use((error: IError, req: Request, res: Response, next: NextFunction) => {
    // const imagesUpload = req.files as UploadedFiles | undefined;
    // if (imagesUpload?.images?.length != 0 || imagesUpload?.images?.length != undefined) {
    //     imagesUpload?.images?.forEach((img) => {
    //         fs.rmSync(`${img?.path}`)
    //     });
    // }

    if (error?.message === 'jwt expired') throw { msg: 'jwt expired', status: 401 }
    res.status(error?.status || 500).json({
        error: true,
        message: error?.msg || error?.message,
        data: {}
    })
})

dbConnect()
app.listen(port, () => console.log(portConnect))