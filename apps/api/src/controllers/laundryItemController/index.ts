import { createLaundryItemsService, deleteLaundryItemsService, getLaundryItemsService, getListItemService, updateLaundryItemsService } from "@/services/laundryItemService";
import { NextFunction, Request, Response } from "express";


export const getListItem = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId } = req.body;
    const { dataItem } = await getListItemService({ userId })

    res.status(200).json({
      error: false,
      message: "Order berhasil didapatkan!",
      data: dataItem
    });
  } catch (error) {
    next(error)
  }
}

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