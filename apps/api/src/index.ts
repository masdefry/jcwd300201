import express, { Express, NextFunction, Request, Response } from 'express'
import cors from 'cors'
import router from './router'
import dotenv from 'dotenv'
import { dbConnect } from './connection'

dotenv.config()
const port: string | undefined = process.env.PORT

/* Set Up express */
const app: Express = express()
app.use(express.json())

/* Cors */
const corsOption = {
    origin: '*',
    credentials: true
}
app.use(cors(corsOption))

/* Route */
app.use('/api', router)

/* Central Error */
interface IError extends Error {
    msg: string,
    status: number
}

app.use((error: IError, req: Request, res: Response, next: NextFunction) => {
    res.status(error?.status || 500).json({
        error: true,
        message: error?.msg || error?.message /* *Sementara, ganti jadi something went wrong */
    })
})

/* DB Connection */
dbConnect()

/* listen on port 5000 */
app.listen(port, () => {
    console.log(`on port ${5000}`)
})