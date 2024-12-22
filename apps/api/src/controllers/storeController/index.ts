import prisma from '@/connection';
import axios from 'axios';
import { Request, Response, NextFunction } from 'express'

interface IStoreMap {
    id: string
    storeName: string
    address: string
    city: string
    province: string
    country: string
    zipCode: string
    latitude: number
    longitude: number
    createdAt: Date
    updatedAt: Date
    deletedAt: Date | null
}

const rajaOngkirApiKey: string | undefined = process.env.RAJAONGKIR_API_KEY as string
export const getStore = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const findStore = await prisma.store.findMany()
        const dataStore = findStore?.map((store: IStoreMap) => {
            return {
                storeId: store?.id,
                storeName: store?.storeName
            }
        })

        res.status(201).json({
            error: false,
            message: "Data store berhasil didapat!",
            data: dataStore,
        });
    } catch (error) {
        next(error)
    }
};

export const getAllStore = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { page = '1', limit = '5', search = '', sort = '' } = req.query

        const take = parseInt(limit as string)
        const skip = (parseInt(page as string) - 1) * take
        let whereClause;

        if (search) {
            whereClause = {
                OR: [
                    { storeName: { contains: search as string } },
                    { city: { contains: search as string } },
                    { province: { contains: search as string } },
                ]
            }
        }

        let findStore
        if (sort == 'name-asc') {
            findStore = await prisma.store.findMany({
                where: whereClause, take, skip, orderBy: { storeName: 'asc' }

            })
        } else if (sort == 'name-desc') {
            findStore = await prisma.store.findMany({
                where: whereClause, take, skip, orderBy: { storeName: 'desc' }
            })
        } else {
            findStore = await prisma.store.findMany({
                where: whereClause, take, skip
            })
        }

        const totalData = await prisma.store.count({
            where: whereClause
        })

        const totalPage = Math.ceil(totalData / Number(limit))
        if (findStore?.length == 0) throw { msg: 'Data outlet belum tersedia', status: 404 }

        res.status(200).json({
            error: false,
            message: 'Berhasil mendapatkan data outlet',
            data: { totalPage, findStore }
        })
    } catch (error) {
        next(error)
    }
}

export const createStoreByAdmin = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { storeName, address, city, province, zipCode, latitude, longitude } = req.body
        const responseApi: any = await axios.get(`https://api.rajaongkir.com/starter/province?id=${province}`, {
            headers: { key: rajaOngkirApiKey }
        })

        if (!responseApi) throw { msg: 'Gagal mendapatkan data provinsi', status: 400 }
        const provinceName: string = responseApi?.data?.rajaongkir?.results?.province

        const findExistingStore = await prisma.store.findFirst({
            where: {
                AND: [
                    { storeName },
                    { address },
                    { province: provinceName },
                ]
            }
        })

        if (findExistingStore) throw { msg: 'Outlet sudah tersedia harap tambah tempat lain', status: 400 }
        await prisma.store.create({
            data: {
                storeName,
                address,
                city,
                province: provinceName,
                country: 'Indonesia',
                zipCode,
                latitude: parseFloat(latitude),
                longitude: parseFloat(longitude)
            }
        })

        res.status(201).json({
            error: false,
            message: 'Selamat! Anda berhasil membuat outlet baru',
            data: {}
        })
    } catch (error) {
        next(error)
    }
}