import prisma from "@/connection";
import dotenv from 'dotenv'
import { NextFunction, Request, Response } from "express";
import { changePasswordWorkerService, createNotesService, deleteDataWorkerByIdService, deleteProfilePictureWorkerService, getAllWorkerService, updateProfileWorkerService } from "@/service/workerService";

dotenv.config()
const profilePict: string | undefined = process.env.PROFILE_PICTURE as string

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