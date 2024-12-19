import prisma from '@/connection';
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

export const getStore = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const findStore = await prisma.store.findMany()
        const dataStore = findStore?.map((store: IStoreMap)=> {
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