import prisma from "@/connection"
import { ICreateStore, IGetAllStore, IStoreMap } from "./types"
import axios from "axios"

const rajaOngkirApiKey: string | undefined = process.env.RAJAONGKIR_API_KEY as string
export const getStoreService = async () => {
    const findStore = await prisma.store.findMany()
    const dataStore = findStore?.map((store: IStoreMap) => {
        return {
            storeId: store?.id,
            storeName: store?.storeName
        }
    })

    return { dataStore }
}

export const getAllStoreService = async ({ search, sort, take, skip, limit }: IGetAllStore) => {
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

    return { totalPage, findStore }
}

export const createStoreByAdminService = async ({ storeName, address, province, city, zipCode, latitude, longitude }: ICreateStore) => {
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
}