import prisma from "@/connection";
import { IGetLaundryItems } from "./types";

export const getListItemService = async ({ userId }: { userId: string }) => {
    const worker = await prisma.worker.findFirst({
        where: {
            id: userId,
        },
        select: { storeId: true },
    })

    if (!worker) throw { msg: "Driver tidak tersedia", status: 404 }


    const dataItem = await prisma.laundryItem.findMany({
        where: {
            deletedAt: null
        }
    })

    return { dataItem }
}

export const createLaundryItemsService = async ({ itemName }: { itemName: string }) => {
    const findName = await prisma.laundryItem.findFirst({ where: { itemName } })
    if (findName) throw { msg: 'Data sudah tersedia', status: 406 }
    await prisma.laundryItem.create({ data: { itemName } })
}

export const getLaundryItemsService = async ({ limit, page, search, sort }: IGetLaundryItems) => {
    const take = parseInt(limit as string)
    const skip = (parseInt(page as string) - 1) * take
    let whereClause;

    if (search) {
        whereClause = {
            OR: [
                { itemName: { contains: search as string } },
            ]
        }
    }
    let findItem: any


    const totalData = await prisma.laundryItem.count({
        where: whereClause
    })

    if (sort == 'name-asc') {
        findItem = await prisma.laundryItem.findMany({
            where: whereClause, take, skip, orderBy: { itemName: 'asc' }

        })
    } else if (sort == 'name-desc') {
        findItem = await prisma.laundryItem.findMany({
            where: whereClause, take, skip, orderBy: { itemName: 'desc' }
        })
    } else if (sort == 'latest-item') {
        findItem = await prisma.laundryItem.findMany({
            where: whereClause, take, skip, orderBy: { createdAt: 'desc' }
        })
    } else if (sort == 'oldest-item') {
        findItem = await prisma.laundryItem.findMany({
            where: whereClause, take, skip, orderBy: { createdAt: 'asc' }
        })
    } else {
        findItem = await prisma.laundryItem.findMany({
            where: whereClause, take, skip
        })
    }

    if (findItem?.length === 0) throw { msg: 'Data item tidak tersedia', status: 404 }
    const totalPage = Math.ceil(totalData / Number(limit))

    return { findItem, totalPage }
}

export const deleteLaundryItemsService = async ({ id }: { id: string }) => {
    const findItem = await prisma.laundryItem.findFirst({ where: { id: Number(id) } })
    if (!findItem) throw { msg: 'Data sudah tidak tersedia atau sudah terhapus', status: 404 }
    await prisma.laundryItem.delete({ where: { id: Number(id) } })
}

export const updateLaundryItemsService = async ({ id, itemName }: { id: string, itemName: string }) => {
    const findData = await prisma.laundryItem.findFirst({ where: { id: Number(id) } })
    if (!findData) throw { msg: "Data tidak tersedia", status: 404 }

    const findItem = await prisma.laundryItem.findFirst({ where: { itemName } })
    if (findItem) throw { msg: 'Data sudah tersedia', status: 406 }

    await prisma.laundryItem.update({ data: { itemName }, where: { id: Number(id) } })
}