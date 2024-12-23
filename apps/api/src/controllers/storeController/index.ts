import { createStoreByAdminService, getAllStoreService, getStoreService } from '@/service/storeService';
import { Request, Response, NextFunction } from 'express'

export const getStore = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { dataStore } = await getStoreService()

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

        const limitTypes = typeof limit == 'string' ? limit : ''
        const searchTypes = typeof search == 'string' ? search : ''
        const sortTypes = typeof sort == 'string' ? sort : ''

        const { totalPage, findStore } = await getAllStoreService({ limit: limitTypes, search: searchTypes, sort: sortTypes, skip, take })

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

        await createStoreByAdminService({ storeName, address, city, province, zipCode, latitude, longitude })

        res.status(201).json({
            error: false,
            message: 'Selamat! Anda berhasil membuat outlet baru',
            data: {}
        })
    } catch (error) {
        next(error)
    }
}