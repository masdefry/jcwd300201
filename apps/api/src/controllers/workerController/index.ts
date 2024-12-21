import prisma from "@/connection";
import { validateEmail } from "@/middleware/validation/emailValidation";
import { phoneNumberValidation } from "@/middleware/validation/phoneNumberValidation";
import fs, { rmSync } from 'fs'
import { comparePassword, hashPassword } from "@/utils/passwordHash";
import dotenv from 'dotenv'
import { Prisma } from "@prisma/client";
import { Status } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import { changePasswordWorkerService, createLaundryItemsService, createNotesService, deleteDataWorkerByIdService, deleteLaundryItemsService, deleteProfilePictureWorkerService, getAllWorkerService, getLaundryItemsService, updateLaundryItemsService, updateProfileWorkerService } from "@/service/workerService";

dotenv.config()
const profilePict: string | undefined = process.env.PROFILE_PICTURE as string


// updateProfile Worker
export const updateProfileWorker = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const imageUploaded: any = req.files
    const { userId, email, phoneNumber, firstName, lastName } = req.body

    await updateProfileWorkerService({ userId, email, phoneNumber, firstName, lastName, imageUploaded })

    res.status(200).json({
      error: false,
      message: 'Berhasil mengubah data',
      data: {}
    })
  } catch (error) {
    next(error)
  }
}

// get single data worker
export const getSingleDataWorker = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId } = req.body
    const findWorker = await prisma.worker.findFirst({ where: { id: userId } })

    res.status(200).json({
      error: false,
      message: 'Berhasil mendapatkan data',
      data: findWorker
    })
  } catch (error) {
    next(error)
  }
}

// change password worker
export const changePasswordWorker = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId, password, existingPassword } = req?.body
    await changePasswordWorkerService({ userId, password, existingPassword })

    res.status(200).json({
      error: false,
      message: 'Password berhasil diubah',
      data: {}
    })

  } catch (error) {
    next(error)
  }
}

// delete foto profile worker
export const deleteProfilePictureWorker = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId } = req.body

    await deleteProfilePictureWorkerService({ userId })

    res.status(200).json({
      error: false,
      message: 'Berhasil menghapus foto profil',
      data: {}
    })

  } catch (error) {
    next(error)
  }
}

/* create notes */
export const createNotes = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { orderId } = req.params;
    const { email, notes } = req.body;

    const { note } = await createNotesService({ email, notes, orderId })

    res.status(200).json({
      error: false,
      message: 'Berhasil melakukan approve untuk melanjutkan proses',
      data: note
    })

  } catch (error) {
    next(error)
  }
}


/* top - super admin ---..*/

/* get all worker */
export const getAllWorker = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { search = '', sort = '', page = '1', limit = '5' } = req.query;

    const take = parseInt(limit as string)
    const skip = (parseInt(page as string) - 1) * take

    let whereClause: any = {}

    if (search) {
      whereClause = {
        OR: [
          { id: { contains: search as string } },
          { firstName: { contains: search as string } },
          { lastName: { contains: search as string } },
          { email: { contains: search as string } }
        ]
      }
    } else if (typeof sort === 'string') {
      const roles = ['super_admin', 'driver', 'washing_worker', 'ironing_worker', 'packing_worker', 'outlet_admin'] as string[]
      if (roles.includes(sort)) {
        whereClause.workerRole = sort.toUpperCase()
      }
    }

    const { findWorker, totalPages } = await getAllWorkerService({ whereClause, take, skip })

    res.status(200).json({
      error: false,
      message: 'Berhasil mendapatkan data pekerja',
      data: { findWorker, totalPages, currentPage: page, entriesPerPage: limit }
    })
  } catch (error) {
    next(error)
  }
}

/* get single worker */
export const getSingleWorkerById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params

    const findUser = await prisma.worker.findFirst({ where: { id } })
    if (!findUser) throw { msg: 'User tidak tersedia', status: 404 }

    res.status(200).json({
      error: false,
      message: 'Berhasil mendapatkan data worker',
      data: findUser
    })

  } catch (error) {
    next(error)
  }
}

/* delete data worker */
export const deleteDataWorkerById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params

    await deleteDataWorkerByIdService({ id })

    res.status(200).json({
      error: false,
      message: 'Berhasil menghapus data',
      data: {}
    })
  } catch (error) {
    next(error)
  }
}

/* get laundry items */
export const getLaundryItems = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { page = '1', limit = '5', search = '', sort } = req.query

    const pageTypes = typeof page != "string" ? "" : page
    const limitTypes = typeof limit != 'string' ? '' : limit
    const searchTypes = typeof search != 'string' ? '' : search
    const sortTypes = typeof sort != 'string' ? '' : sort

    const { findItem, totalPage } = await getLaundryItemsService({ page: pageTypes, limit: limitTypes, search: searchTypes, sort: sortTypes })

    res.status(200).json({
      error: false,
      message: "Data berhasil didapat!",
      data: { findItem, totalPage, currentPage: page, entriesPerPage: limit }
    })

  } catch (error) {
    next(error);
  }
}

/* create product laundry items */
export const createLaundryItems = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { itemName } = req.body

    await createLaundryItemsService({ itemName })

    res.status(200).json({
      error: false,
      message: 'Berhasil membuat produk',
      data: {}
    })

  } catch (error) {
    next(error)
  }
}

/* delete laundryItems */
export const deleteLaundryItems = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params

    await deleteLaundryItemsService({ id })

    res.status(200).json({
      error: false,
      message: 'Berhasil menghapus data',
      data: {}
    })
  } catch (error) {
    next(error)
  }
}

/* update laundry items */
export const updateLaundryItems = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { itemName } = req.body
    const { id } = req.params

    await updateLaundryItemsService({ itemName, id })

    res.status(200).json({
      error: false,
      message: 'Berhasil mengubah data',
      data: {}
    })
  } catch (error) {
    next(error)
  }
}

/* ..---- bottom - super admin */