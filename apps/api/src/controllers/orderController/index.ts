import prisma from "@/connection"
import { NextFunction, Request, Response } from "express";
const axios = require('axios');
import { getCreateNoteOrderService, ironingProcessDoneService, getOrdersForPackingService, getOrdersForIroningService, getOrdersForWashingService, getOrderNoteDetailService, getOrderItemDetailService, acceptOrderOutletService, getOrdersForDriverService, acceptOrderService, findNearestStoreService, requestPickUpService, getUserOrderService, getPackingHistoryService, getIroningHistoryService, getWashingHistoryService, getNotesService, packingProcessDoneService, packingProcessService, createOrderService, washingProcessDoneService, getOrdersForDeliveryService, requestDeliveryDoneService, getOrdersForDriverDeliveryService, acceptOrderDeliveryService, processOrderDeliveryService, getAllOrderForAdminService, orderStatusService, getDriverHistoryService, getAllOrderForUserService, paymentOrderVAService, paymentOrderTfService, getPaymentOrderForAdminService, PaymentDoneService, userConfirmOrderService, orderTrackingAdminService, orderTrackingDriverService, orderTrackingWorkerService, orderTrackingUserService } from "@/services/orderService";
import { IGetOrderNoteDetail, IGetUserOrder, IGetOrderForDriver } from "@/services/orderService/types";
import dotenv from 'dotenv'
import { addHours } from "date-fns";

dotenv.config()
const rajaOngkirApiKey: string | undefined = process.env.RAJAONGKIR_API_KEY as string
export const getOrderType = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const orderTypes = await prisma.orderType.findMany({
      where: {
        deletedAt: null
      }
    });
    res.status(200).json({
      error: false,
      message: "Data berhasil didapat!",
      data: orderTypes
    });
  } catch (error) {
    next(error);
  }
};

export const getProvince = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const response = await axios.get('https://api.rajaongkir.com/starter/province', {
      headers: { key: rajaOngkirApiKey }
    });
    res.status(200).json({
      error: false,
      message: "Data provinsi berhasil didapat!",
      data: response.data
    });
  } catch (error) {
    next(error)
  }
}

export const getCity = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { province_id } = req.query as { province_id?: string };

    const response = await axios.get(`https://api.rajaongkir.com/starter/city${province_id ? `?province=${province_id}` : ''}`, {
      headers: { key: rajaOngkirApiKey }
    });
    res.status(200).json({
      error: false,
      message: "Data kota berhasil didapat!",
      data: response.data
    });
  } catch (error) {
    next(error)
  }
}

export const findNearestStore = async (req: Request, res: Response, next: NextFunction) => {

  try {
    const { userId } = req.body;
    const { address } = req.query
    const addressString = typeof address === "string" ? address : "";
    const { nearestStores } = await findNearestStoreService({ userId, address: addressString })
    res.status(200).json({
      error: false,
      message: "Data store terdekat berhasil didapat!",
      data: nearestStores
    });
  } catch (error) {
    next(error)
  }
};

export const requestPickUp = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { deliveryFee, outletId, userId, orderTypeId, userAddressId } = req.body
    const { newOrder } = await requestPickUpService({ userId, deliveryFee, outletId, orderTypeId, userAddressId })

    res.status(201).json({
      error: false,
      message: "Pesanan berhasil dibuat",
      order: newOrder,
    });
  } catch (error) {
    next(error)
  }
};

export const getUserOrder = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {
      page = '1',
      limit_data = '5',
      search = '',
      sort = 'date-asc',
      dateFrom,
      dateUntil
    } = req.query;
    const { userId } = req.body;

    const params: IGetUserOrder = {
      userId: userId as string,
      limit_data: Number(limit_data),
      page: Number(page),
      search: typeof search === 'string' ? search : '',
      dateFrom: typeof dateFrom === 'string' ? dateFrom : undefined,
      dateUntil: typeof dateUntil === 'string' ? dateUntil : undefined,
      sort: (typeof sort === 'string' &&
        ['date-asc', 'date-desc', 'name-asc', 'name-desc', 'order-id-asc', 'order-id-desc'].includes(sort))
        ? (sort as IGetUserOrder['sort'])
        : 'date-asc',
    };

    const { totalPage, orders } = await getUserOrderService(params)

    res.status(200).json({
      error: false,
      message: "Pesanan berhasil didapat!",
      data: {
        totalPage,
        orders
      }
    });
  } catch (error) {
    next(error);
  }
};

export const getOrdersForDriver = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId, authorizationRole, storeId } = req.body;
    const {
      page = '1',
      limit_data = '5',
      search = '',
      sort = 'date-asc',
      tab = '',
      dateFrom,
      dateUntil
    } = req.query;

    const dataPassing: IGetOrderForDriver = {
      userId: userId as string,
      limit_data: Number(limit_data),
      page: Number(page),
      tab: typeof tab === "string" ? tab : '',
      search: typeof search === 'string' ? search : '',
      dateFrom: typeof dateFrom === 'string' ? dateFrom : '',
      dateUntil: typeof dateUntil === 'string' ? dateUntil : '',
      sort: (typeof sort === 'string' &&
        ['date-asc', 'date-desc', 'name-asc', 'name-desc', 'order-id-asc', 'order-id-desc'].includes(sort))
        ? (sort as IGetUserOrder['sort'])
        : 'date-asc',
      authorizationRole,
      storeId
    };

    const { totalPage, paginatedOrders } = await getOrdersForDriverService(dataPassing)

    res.status(200).json({
      error: false,
      message: "Order berhasil didapatkan!",
      data: {
        totalPage,
        orders: paginatedOrders,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const acceptOrder = async (req: Request, res: Response, next: NextFunction) => {

  try {
    const { orderId } = req.params;
    const { userId, email } = req.body;

    const { newStatus } = await acceptOrderService({ email, orderId, userId })

    res.status(200).json({
      error: false,
      message: "Order berhasil diterima",
      data: newStatus,
    });

  } catch (error) {
    next(error);
  }
};

export const acceptOrderOutlet = async (req: Request, res: Response, next: NextFunction) => {

  try {
    const { orderId } = req.params;
    const { userId, email } = req.body;

    const { newStatus } = await acceptOrderOutletService({ email, orderId, userId });


    res.status(200).json({
      error: false,
      message: "Order berhasil diterima",
      data: newStatus,
    });

  } catch (error) {
    next(error);
  }
};

export const getOrderNoteDetail = async (req: Request, res: Response, next: NextFunction) => {

  try {
    const { id } = req.params
    const { userId, authorizationRole, storeId } = req.body;

    const params: IGetOrderNoteDetail = {
      id,
      userId,
      authorizationRole,
      storeId
    };

    const { order } = await getOrderNoteDetailService(params);


    res.status(200).json({
      error: false,
      message: "Data berhasil didapat!",
      data: order
    })
  } catch (error) {
    next(error)
  }
}

export const getOrderItemDetail = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { orderId } = req.params

    const { detailListItem } = await getOrderItemDetailService(orderId);


    res.status(200).json({
      error: false,
      message: 'Detail item order berhasil didapatkan',
      data: detailListItem
    });

  } catch (error) {
    next(error)
  }
}

export const getOrdersForWashing = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId, authorizationRole, storeId } = req.body;
    const {
      page = '1',
      limit_data = '5',
      search = '',
      sort = 'date-asc',
      tab = '',
      dateFrom,
      dateUntil
    } = req.query

    const searchTypes = typeof search !== 'string' ? "" : search
    const sortTypes = typeof sort !== 'string' ? "" : sort
    const pageTypes = typeof page !== 'string' ? "" : page
    const limitTypes = typeof limit_data !== 'string' ? "" : limit_data
    const tabTypes = typeof tab !== 'string' ? "" : tab
    const dateFromTypes = typeof dateFrom !== 'string' ? "" : dateFrom
    const dateUntilTypes = typeof dateUntil !== 'string' ? "" : dateUntil

    const { totalPage, orders: paginatedOrders } = await getOrdersForWashingService(
      {
        userId,
        authorizationRole,
        storeId,
        page: pageTypes,
        limit_data: limitTypes,
        search: searchTypes,
        sort: sortTypes,
        tab: tabTypes,
        dateFrom: dateFromTypes,
        dateUntil: dateUntilTypes
      }
    );

    res.status(200).json({
      error: false,
      message: "Order berhasil didapatkan!",
      data: {
        totalPage,
        orders: paginatedOrders,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getOrdersForIroning = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId, authorizationRole, storeId } = req.body;
    const {
      page = '1',
      limit_data = '5',
      search = '',
      sort = 'date-asc',
      tab = '',
      dateFrom,
      dateUntil
    } = req.query;

    const searchTypes = typeof search !== 'string' ? "" : search
    const sortTypes = typeof sort !== 'string' ? "" : sort
    const pageTypes = typeof page !== 'string' ? "" : page
    const limitTypes = typeof limit_data !== 'string' ? "" : limit_data
    const tabTypes = typeof tab !== 'string' ? "" : tab
    const dateFromTypes = typeof dateFrom !== 'string' ? "" : dateFrom
    const dateUntilTypes = typeof dateUntil !== 'string' ? "" : dateUntil

    const { totalPage, orders: paginatedOrders } = await getOrdersForIroningService(
      {
        userId,
        authorizationRole,
        storeId,
        page: pageTypes,
        limit_data: limitTypes,
        search: searchTypes,
        sort: sortTypes,
        tab: tabTypes,
        dateFrom: dateFromTypes,
        dateUntil: dateUntilTypes
      }
    );

    res.status(200).json({
      error: false,
      message: "Order berhasil didapatkan!",
      data: {
        totalPage,
        orders: paginatedOrders,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getOrdersForPacking = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId, authorizationRole, storeId } = req.body;
    const {
      page = '1',
      limit_data = '5',
      search = '',
      sort = 'date-asc',
      tab = '',
      dateFrom,
      dateUntil
    } = req.query;

    const searchTypes = typeof search !== 'string' ? "" : search
    const sortTypes = typeof sort !== 'string' ? "" : sort
    const pageTypes = typeof page !== 'string' ? "" : page
    const limitTypes = typeof limit_data !== 'string' ? "" : limit_data
    const tabTypes = typeof tab !== 'string' ? "" : tab
    const dateFromTypes = typeof dateFrom !== 'string' ? "" : dateFrom
    const dateUntilTypes = typeof dateUntil !== 'string' ? "" : dateUntil

    const { totalPage, orders: paginatedOrders } = await getOrdersForPackingService(
      {
        userId,
        authorizationRole,
        storeId,
        page: pageTypes,
        limit_data: limitTypes,
        search: searchTypes,
        sort: sortTypes,
        tab: tabTypes,
        dateFrom: dateFromTypes,
        dateUntil: dateUntilTypes
      }
    );

    res.status(200).json({
      error: false,
      message: "Order berhasil didapatkan!",
      data: {
        totalPage,
        orders: paginatedOrders,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const createOrder = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { orderId } = req.params
    const { email, userId, totalWeight, laundryPrice, items } = req.body

    const { updatedOrder, dataItems, orderStatus } = await createOrderService({ orderId, email, userId, totalWeight, laundryPrice, items });

    res.status(200).json({
      error: false,
      message: 'Nota order berhasil dibuat',
      order: updatedOrder,
      orderDetails: dataItems,
      orderStatus: orderStatus,
    });

  } catch (error) {
    next(error)
  }
}

export const washingProcess = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { orderId } = req.params
    const { email, userId, notes } = req.body

    const findWorker = await prisma.worker.findFirst({
      where: { email }
    })

    if (!findWorker) throw { msg: "Pengguna tidak tersedia", status: 404 }

    const order = await prisma.order.findUnique({
      where: { id: String(orderId) },
      select: { orderTypeId: true },
    });

    if (!order) throw { msg: "Order tidak ditemukan", status: 404 };
    if (order.orderTypeId === 2) throw { msg: "Pesanan bertipe layanan strika tidak dapat diproses", status: 400 }

    let updatedOrder = null;
    if (notes) {
      const updatedOrder = await prisma.order.update({
        where: {
          id: String(orderId),
        },
        data: {
          notes,
          isSolved: false,
          isProcessed: false,
          updatedAt: addHours(new Date(), 7)
        },
      });

      if (!updatedOrder) throw { msg: "Order gagal diupdate", status: 404 }
      return res.status(201).json({
        error: false,
        message: "Approval request terhadap admin telah diajukan!",
        data: {
          order: updatedOrder,
        },
      });


    } else {
      const updatedOrder = await prisma.order.update({
        where: {
          id: String(orderId),
        },
        data: {
          isProcessed: true,
          updatedAt: addHours(new Date(), 7)
        },
      });

      if (!updatedOrder) throw { msg: "Order gagal diupdate", status: 404 }
      if (updatedOrder.isSolved === false) throw { msg: "Masalah belum terselesaikan, tidak dapat diproses", status: 400 }

      const existingStatus = await prisma.orderStatus.findFirst({
        where: {
          orderId: String(orderId),
          status: 'AWAITING_PAYMENT',
        },
      })

      if (!existingStatus) throw { msg: "Order tidak dapat diproses karena belum dibuat nota order oleh oulet admin", status: 400 }

      const orderStatus = await prisma.orderStatus.create({
        data: {
          status: 'IN_WASHING_PROCESS',
          orderId: String(orderId),
          workerId: userId,
          createdAt: addHours(new Date(), 7)
        },
      })

      if (!orderStatus) throw { msg: "data order status gagal dibuat", status: 404 }

      res.status(200).json({
        error: false,
        message: "Order berhasil diupdate!",
        data: {
          orderStatus,
        },
      });
    }
  } catch (error) {
    next(error)
  }
}

export const washingProcessDone = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { orderId } = req.params
    const { email, userId } = req.body

    const { orderStatus } = await washingProcessDoneService({ orderId, email, userId })


    res.status(200).json({
      error: false,
      message: "Order berhasil diupdate!",
      data: { orderStatus },
    })
  } catch (error) {
    next(error)
  }
}


export const ironingProcess = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { orderId } = req.params
    const { email, userId, notes } = req.body

    await prisma.$transaction(async (tx) => {
      const findWorker = await prisma.worker.findFirst({
        where: { email }
      })

      if (!findWorker) throw { msg: "Pengguna tidak tersedia", status: 404 }
      const order = await tx.order.findUnique({
        where: { id: String(orderId) },
        select: { orderTypeId: true },
      });

      if (!order) throw { msg: "Order tidak ditemukan", status: 404 };
      if (order.orderTypeId === 1) throw { msg: "Pesanan dengan tipe tersebut tidak dapat diproses", status: 400 };
      if (order.orderTypeId === 2) {
        const createOrderStatus = await tx.orderStatus.create({
          data: {
            status: 'IN_IRONING_PROCESS',
            orderId: String(orderId),
            createdAt: addHours(new Date(), 7),
          },
        })

        if (!createOrderStatus) throw { msg: 'order status gagal dibuat,silahkan coba lagi', status: 400 }
      }

      const orderStatuses = await tx.orderStatus.findFirst({
        where: {
          orderId,
          status: 'IN_IRONING_PROCESS'
        },
      });

      if (!orderStatuses) throw { msg: "tidak ada order dengan status 'IN_IRONING_PROCESS'" };

      await tx.orderStatus.update({
        where: { id: orderStatuses.id },
        data: {
          workerId: userId,
        },
      });
    })

    if (notes) {
      const updatedOrder = await prisma.order.update({
        where: {
          id: String(orderId),
        },
        data: {
          notes,
          isSolved: false,
          isProcessed: false,
          updatedAt: addHours(new Date(), 7)

        },
      });

      if (!updatedOrder) throw { msg: "Order gagal diupdate", status: 404 }

      return res.status(201).json({
        error: false,
        message: "Approval request terhadap admin telah diajukan!",
        data: {
          order: updatedOrder,
        },
      });


    } else {
      const updatedOrder = await prisma.order.update({
        where: {
          id: String(orderId),
        },
        data: {
          isProcessed: true,
        },
      });

      if (!updatedOrder) {
        throw { msg: "Order gagal diupdate", status: 404 };
      }

      if (updatedOrder.isSolved === false) {
        throw { msg: "Masalah belum terselesaikan, tidak dapat diproses", status: 400 };
      }

      const existingStatus = await prisma.orderStatus.findFirst({
        where: {
          orderId: String(orderId),
          status: 'IN_IRONING_PROCESS',
        },
      });

      if (!existingStatus) throw { msg: "Order tidak dapat diproses karena belum dicuci", status: 400 }

      res.status(200).json({
        error: false,
        message: "Order berhasil diupdate!",
      });
    }
  } catch (error) {
    next(error)
  }
}


export const ironingProcessDone = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { orderId } = req.params
    const { email, userId } = req.body

    const { orderStatus } = await ironingProcessDoneService({ orderId, email, userId })

    res.status(200).json({
      error: false,
      message: "Order berhasil diupdate!",
      data: {
        orderStatus,
      },
    });
  } catch (error) {
    next(error)
  }
}

export const packingProcess = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { orderId } = req.params
    const { email, userId, notes } = req.body

    await packingProcessService({ email, userId, orderId })

    if (notes) {
      const updatedOrder = await prisma.order.update({
        where: {
          id: String(orderId),
        },
        data: {
          notes,
          isSolved: false,
          isProcessed: false
        },
      });

      if (!updatedOrder) throw { msg: "Order gagal diupdate", status: 404 }

      return res.status(201).json({
        error: false,
        message: "Permintaan persetujuan kepada admin telah diajukan.!",
        data: {
          order: updatedOrder,
        },
      });


    } else {
      const updatedOrder = await prisma.order.update({
        where: {
          id: String(orderId),
        },
        data: {
          isProcessed: true,
        },
      })

      if (!updatedOrder) throw { msg: "Order gagal diupdate", status: 404 };
      if (updatedOrder.isSolved === false) throw { msg: "Masalah belum terselesaikan, tidak dapat diproses", status: 400 };

      const existingStatus = await prisma.orderStatus.findFirst({
        where: {
          orderId: String(orderId),
          status: 'IN_PACKING_PROCESS',
        },
      });

      if (!existingStatus) throw { msg: "Order tidak dapat diproses karena belum disetrika", status: 400 };

      res.status(200).json({
        error: false,
        message: "Order berhasil diupdate!",
        data: {}
      })
    }
  } catch (error) {
    next(error)
  }
}

export const packingProcessDone = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { orderId } = req.params
    const { email } = req.body

    const { order } = await packingProcessDoneService({ email, orderId })

    res.status(200).json({
      error: false,
      message: "Order berhasil diupdate!",
      data: {
        order,
      },
    });
  } catch (error) {
    next(error)
  }
}


export const getNotes = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId, authorizationRole } = req.body;
    const { page = '1', limit_data = '5', search = '', sort = 'date-asc', tab = '', dateFrom, dateUntil, } = req.query;

    const limitTypes = typeof limit_data !== 'string' ? "" : limit_data
    const pageTypes = typeof page !== 'string' ? "" : page
    const searchTypes = typeof search !== 'string' ? "" : search
    const dateFromTypes = typeof dateFrom !== 'string' ? "" : dateFrom
    const dateUntilTypes = typeof dateUntil !== 'string' ? "" : dateUntil
    const sortTypes = typeof sort !== 'string' ? "" : sort
    const tabTypes = typeof tab !== 'string' ? "" : tab

    const { totalPage, orders } = await getNotesService({
      userId, authorizationRole, limit_data: limitTypes, page: pageTypes,
      search: searchTypes, dateFrom: dateFromTypes, dateUntil: dateUntilTypes,
      sort: sortTypes, tab: tabTypes
    })

    res.status(200).json({
      error: false,
      message: "Catatan berhasil didapat!",
      data: {
        totalPage,
        orders,
      },
    });
  } catch (error) {
    next(error);
  }
};


export const solveNotes = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { orderId } = req.params
    const { notes, userId } = req.body

    const solvedProblem = await prisma.order.update({
      where: {
        id: orderId,
      },
      data: {
        isSolved: true,
        notes
      }
    })

    res.status(200).json({
      error: false,
      message: "Berhasil!",
      data: solvedProblem
    });
  } catch (error) {
    next(error)
  }
}

export const getWashingHistory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { page = '1', limit_data = '5', search = '', sort = 'date-asc', dateFrom, dateUntil } = req.query;
    const { userId, authorizationRole, storeId } = req.body;

    const limitTypes = typeof limit_data !== 'string' ? "" : limit_data
    const pageTypes = typeof page !== 'string' ? "" : page
    const searchTypes = typeof search !== 'string' ? "" : search
    const dateFromTypes = typeof dateFrom !== 'string' ? "" : dateFrom
    const dateUntilTypes = typeof dateUntil !== 'string' ? "" : dateUntil
    const sortTypes = typeof sort !== 'string' ? "" : sort

    const { totalPage, orders } = await getWashingHistoryService({
      userId, authorizationRole, storeId, limit_data: limitTypes, page: pageTypes,
      search: searchTypes, dateFrom: dateFromTypes, dateUntil: dateUntilTypes, sort: sortTypes
    })

    res.status(200).json({
      error: false,
      message: "Data order telah diterima!",
      data: {
        totalPage,
        orders,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getIroningHistory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { page = '1', limit_data = '5', search = '', sort = 'date-asc', dateFrom, dateUntil } = req.query;
    const { userId, authorizationRole, storeId } = req.body;

    const limitTypes = typeof limit_data !== 'string' ? "" : limit_data
    const pageTypes = typeof page !== 'string' ? "" : page
    const searchTypes = typeof search !== 'string' ? "" : search
    const dateFromTypes = typeof dateFrom !== 'string' ? "" : dateFrom
    const dateUntilTypes = typeof dateUntil !== 'string' ? "" : dateUntil
    const sortTypes = typeof sort !== 'string' ? "" : sort

    const { totalPage, orders } = await getIroningHistoryService({
      userId, authorizationRole, storeId, limit_data: limitTypes, page: pageTypes,
      search: searchTypes, dateFrom: dateFromTypes, dateUntil: dateUntilTypes, sort: sortTypes
    })

    res.status(200).json({
      error: false,
      message: "Data order diterima!",
      data: {
        totalPage,
        orders,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getPackingHistory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { page = '1', limit_data = '5', search = '', sort = 'date-asc', dateFrom, dateUntil } = req.query;
    const { userId, authorizationRole, storeId } = req.body;

    const limitTypes = typeof limit_data !== 'string' ? "" : limit_data
    const pageTypes = typeof page !== 'string' ? "" : page
    const searchTypes = typeof search !== 'string' ? "" : search
    const dateFromTypes = typeof dateFrom !== 'string' ? "" : dateFrom
    const dateUntilTypes = typeof dateUntil !== 'string' ? "" : dateUntil
    const sortTypes = typeof sort !== 'string' ? "" : sort

    const { totalPage, orders } = await getPackingHistoryService({
      userId, authorizationRole, storeId, limit_data: limitTypes, page: pageTypes,
      search: searchTypes, dateFrom: dateFromTypes, dateUntil: dateUntilTypes, sort: sortTypes
    })

    res.status(200).json({
      error: false,
      message: "Data order diterima!",
      data: {
        totalPage,
        orders,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getCreateNotaOrder = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { page = '1', limit_data = '5', search = '', sort = 'date-asc', dateFrom, dateUntil } = req.query;
    const { userId, authorizationRole, storeId } = req.body;

    const limitTypes = typeof limit_data !== 'string' ? "" : limit_data
    const pageTypes = typeof page !== 'string' ? "" : page
    const searchTypes = typeof search !== 'string' ? "" : search
    const dateFromTypes = typeof dateFrom !== 'string' ? "" : dateFrom
    const dateUntilTypes = typeof dateUntil !== 'string' ? "" : dateUntil
    const sortTypes = typeof sort !== 'string' ? "" : sort

    const { totalPage, orders } = await getCreateNoteOrderService({
      userId, authorizationRole, storeId, limit_data: limitTypes, page: pageTypes,
      search: searchTypes, dateFrom: dateFromTypes, dateUntil: dateUntilTypes, sort: sortTypes
    })
    res.status(200).json({
      error: false,
      message: "Data order diterima!",
      data: {
        totalPage,
        orders,
      },
    });

  } catch (error) {
    next(error);
  }
}

export const getOrdersForDelivery = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId, authorizationRole, storeId } = req.body;
    const {
      page = '1',
      limit_data = '5',
      search = '',
      sort = 'date-asc',
      tab = '',
      dateFrom,
      dateUntil
    } = req.query;

    const searchTypes = typeof search !== 'string' ? "" : search
    const sortTypes = typeof sort !== 'string' ? "" : sort
    const pageTypes = typeof page !== 'string' ? "" : page
    const limitTypes = typeof limit_data !== 'string' ? "" : limit_data
    const tabTypes = typeof tab !== 'string' ? "" : tab
    const dateFromTypes = typeof dateFrom !== 'string' ? "" : dateFrom
    const dateUntilTypes = typeof dateUntil !== 'string' ? "" : dateUntil

    const { totalPage, orders: paginatedOrders } = await getOrdersForDeliveryService(
      {
        userId,
        authorizationRole,
        storeId,
        page: pageTypes,
        limit_data: limitTypes,
        search: searchTypes,
        sort: sortTypes,
        tab: tabTypes,
        dateFrom: dateFromTypes,
        dateUntil: dateUntilTypes
      }
    );

    res.status(200).json({
      error: false,
      message: "Order berhasil didapatkan!",
      data: {
        totalPage,
        orders: paginatedOrders,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const requestDeliveryDone = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { orderId } = req.params
    const { email, userId } = req.body

    const { order } = await requestDeliveryDoneService({ orderId, email, userId })

    res.status(200).json({
      error: false,
      message: "Berhasil melakukan pengantaran!",
      data: {
        order,
      },
    });
  } catch (error) {
    next(error)
  }
}


export const getOrdersForDriverDelivery = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId, authorizationRole, storeId } = req.body;
    const {
      page = '1',
      limit_data = '5',
      search = '',
      sort = 'date-asc',
      tab = '',
      dateFrom,
      dateUntil
    } = req.query;

    const searchTypes = typeof search !== 'string' ? "" : search
    const sortTypes = typeof sort !== 'string' ? "" : sort
    const pageTypes = typeof page !== 'string' ? "" : page
    const limitTypes = typeof limit_data !== 'string' ? "" : limit_data
    const tabTypes = typeof tab !== 'string' ? "" : tab
    const dateFromTypes = typeof dateFrom !== 'string' ? "" : dateFrom
    const dateUntilTypes = typeof dateUntil !== 'string' ? "" : dateUntil

    const { totalPage, orders: paginatedOrders } = await getOrdersForDriverDeliveryService(
      {
        userId,
        authorizationRole,
        storeId,
        page: pageTypes,
        limit_data: limitTypes,
        search: searchTypes,
        sort: sortTypes,
        tab: tabTypes,
        dateFrom: dateFromTypes,
        dateUntil: dateUntilTypes
      }
    );

    res.status(200).json({
      error: false,
      message: "Order berhasil didapatkan!",
      data: {
        totalPage,
        orders: paginatedOrders,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const processOrderDelivery = async (req: Request, res: Response, next: NextFunction) => {

  try {
    const { orderId } = req.params;
    const { userId, email } = req.body;
    const { newStatus } = await processOrderDeliveryService({ email, orderId, userId })

    res.status(200).json({
      error: false,
      message: "Order berhasil diterima",
      data: newStatus,
    });

  } catch (error) {
    next(error);
  }
};

export const acceptOrderDelivery = async (req: Request, res: Response, next: NextFunction) => {

  try {
    const { orderId } = req.params;
    const { userId, email } = req.body;

    const { newStatus } = await acceptOrderDeliveryService({ email, orderId, userId });


    res.status(200).json({
      error: false,
      message: "Order berhasil diterima",
      data: newStatus,
    });

  } catch (error) {
    next(error);
  }
};

export const getAllOrderForAdmin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId, authorizationRole, storeId } = req.body;
    const {
      page = '1',
      limit_data = '5',
      search = '',
      sort = 'date-asc',
      tab = '',
      dateFrom,
      dateUntil,
      outletId
    } = req.query

    const searchTypes = typeof search !== 'string' ? "" : search
    const sortTypes = typeof sort !== 'string' ? "" : sort
    const pageTypes = typeof page !== 'string' ? "" : page
    const limitTypes = typeof limit_data !== 'string' ? "" : limit_data
    const tabTypes = typeof tab !== 'string' ? "" : tab
    const dateFromTypes = typeof dateFrom !== 'string' ? "" : dateFrom
    const dateUntilTypes = typeof dateUntil !== 'string' ? "" : dateUntil
    const outletIdTypes = typeof outletId !== 'string' ? "" : outletId

    const { totalPage, orders: paginatedOrders, trackingOrder, monthlyStatistic } = await getAllOrderForAdminService(
      {
        userId,
        authorizationRole,
        storeId,
        page: pageTypes,
        limit_data: limitTypes,
        search: searchTypes,
        sort: sortTypes,
        tab: tabTypes,
        dateFrom: dateFromTypes,
        dateUntil: dateUntilTypes,
        outletId: outletIdTypes
      }
    );

    res.status(200).json({
      error: false,
      message: "Order berhasil didapatkan!",
      data: {
        totalPage,
        orders: paginatedOrders,
        trackingOrder,
        monthlyStatistic
      },
    });
  } catch (error) {
    next(error);
  }
};


export const orderStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { orderId } = req.params
    const { email, userId } = req.body

    const { orderDetail, order, orderStatus } = await orderStatusService({ orderId, email, userId })


    res.status(200).json({
      error: false,
      message: "Order berhasil diupdate!",
      data: { orderDetail, orderStatus, order },
    })
  } catch (error) {
    next(error)
  }
}

export const getDriverHistory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { page = '1', limit_data = '5', search = '', sort = 'date-asc', dateFrom, dateUntil, tab = '' } = req.query;
    const { userId, authorizationRole, storeId } = req.body;

    const limitTypes = typeof limit_data !== 'string' ? "" : limit_data
    const pageTypes = typeof page !== 'string' ? "" : page
    const searchTypes = typeof search !== 'string' ? "" : search
    const dateFromTypes = typeof dateFrom !== 'string' ? "" : dateFrom
    const dateUntilTypes = typeof dateUntil !== 'string' ? "" : dateUntil
    const sortTypes = typeof sort !== 'string' ? "" : sort
    const tabTypes = typeof tab === "string" ? tab : ''


    const { totalPage, orders } = await getDriverHistoryService({
      userId, authorizationRole, storeId, limit_data: limitTypes, page: pageTypes,
      search: searchTypes, dateFrom: dateFromTypes, dateUntil: dateUntilTypes, sort: sortTypes, tab: tabTypes
    })

    res.status(200).json({
      error: false,
      message: "Data order diterima!",
      data: {
        totalPage,
        orders,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getAllOrderForUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId, authorizationRole, storeId } = req.body;
    const {
      page = '1',
      limit_data = '5',
      search = '',
      sort = 'date-asc',
      tab = '',
      dateFrom,
      dateUntil,
    } = req.query

    const searchTypes = typeof search !== 'string' ? "" : search
    const sortTypes = typeof sort !== 'string' ? "" : sort
    const pageTypes = typeof page !== 'string' ? "" : page
    const limitTypes = typeof limit_data !== 'string' ? "" : limit_data
    const tabTypes = typeof tab !== 'string' ? "" : tab
    const dateFromTypes = typeof dateFrom !== 'string' ? "" : dateFrom
    const dateUntilTypes = typeof dateUntil !== 'string' ? "" : dateUntil

    const { totalPage, orders: paginatedOrders } = await getAllOrderForUserService(
      {
        userId,
        page: pageTypes,
        limit_data: limitTypes,
        search: searchTypes,
        sort: sortTypes,
        tab: tabTypes,
        dateFrom: dateFromTypes,
        dateUntil: dateUntilTypes,
      }
    );

    res.status(200).json({
      error: false,
      message: "Order berhasil didapatkan!",
      data: {
        totalPage,
        orders: paginatedOrders,
      },
    });
  } catch (error) {
    next(error);
  }
};


export const paymentOrderVA = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { orderId } = req.params
    const { email, userId } = req.body

    const { updatedOrderWithPaymentUrl } = await paymentOrderVAService({ orderId, email, userId });

    res.status(200).json({
      error: false,
      message: 'Transaksi berhasil!',
      OrderUrl: updatedOrderWithPaymentUrl
    });

  } catch (error) {
    next(error)
  }
}

export const paymentOrderTf = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const paymentProof: any = req.files
    const { orderId } = req.params
    const { email, userId } = req.body

    if (!paymentProof) throw { msg: 'Bukti pembayaran harus dilampirkan', status: 400 }

    const dataImage: string[] = paymentProof?.images?.map((img: any) => {
      return img?.filename
    })

    if (!dataImage) throw { msg: 'Harap unggah bukti transfer anda', status: 401 }
    await paymentOrderTfService({ paymentProof: dataImage[0], orderId, email, userId });

    res.status(200).json({
      error: false,
      message: 'Transaksi berhasil',
    });

  } catch (error) {
    next(error)
  }
}



export const getPaymentOrderForAdmin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId, authorizationRole, storeId } = req.body;
    const {
      page = '1',
      limit_data = '5',
      search = '',
      sort = 'date-asc',
      tab = '',
      dateFrom,
      dateUntil,
    } = req.query

    const searchTypes = typeof search !== 'string' ? "" : search
    const sortTypes = typeof sort !== 'string' ? "" : sort
    const pageTypes = typeof page !== 'string' ? "" : page
    const limitTypes = typeof limit_data !== 'string' ? "" : limit_data
    const tabTypes = typeof tab !== 'string' ? "" : tab
    const dateFromTypes = typeof dateFrom !== 'string' ? "" : dateFrom
    const dateUntilTypes = typeof dateUntil !== 'string' ? "" : dateUntil

    const { totalPage, orders: paginatedOrders } = await getPaymentOrderForAdminService(
      {
        userId,
        authorizationRole,
        storeId,
        page: pageTypes,
        limit_data: limitTypes,
        search: searchTypes,
        sort: sortTypes,
        tab: tabTypes,
        dateFrom: dateFromTypes,
        dateUntil: dateUntilTypes,
      }
    );

    res.status(200).json({
      error: false,
      message: "Order berhasil didapatkan!",
      data: {
        totalPage,
        orders: paginatedOrders,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const paymentDone = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { orderId } = req.params
    const { email, userId } = req.body

    const { orderStatus } = await PaymentDoneService({ orderId, email, userId })

    res.status(200).json({
      error: false,
      message: "Order berhasil diupdate!",
      data: {
        orderStatus,
      },
    });
  } catch (error) {
    next(error)
  }
}

export const userConfirmOrder = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { orderId } = req.params
    const { email, userId } = req.body

    const { orderUpdate } = await userConfirmOrderService({ orderId, email, userId })

    res.status(200).json({
      error: false,
      message: "Order berhasil diupdate!",
      data: {
        orderUpdate,
      },
    });
  } catch (error) {
    next(error)
  }
}


export const orderTrackingAdmin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId, authorizationRole, storeId } = req.body;
    const { period } = req.query;

    const periodTypes = typeof period !== 'string' ? "" : period

    const { totalPcs, stats } = await orderTrackingAdminService({ userId, authorizationRole, period: periodTypes, storeId })


    res.status(200).json({
      error: false,
      message: "Order berhasil diupdate!",
      data: {
        laundryPrice: stats._sum.laundryPrice || 0,
        orderCount: stats._count.id || 0,
        totalKg: stats._sum.totalWeight || 0,
        totalPcs: totalPcs._count.id || 0,
      }
    });
  } catch (error) {
    next(error);
  }
}

export const orderTrackingDriver = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId, authorizationRole } = req.body;
    const { period } = req.query;

    const periodTypes = typeof period !== 'string' ? "" : period

    const { earnings, orderCount, totalKg, totalPcs } = await orderTrackingDriverService({ userId, authorizationRole, period: periodTypes })


    res.status(200).json({
      error: false,
      message: "Order berhasil diupdate!",
      data: {
        earnings,
        orderCount,
        totalKg,
        totalPcs,
      }
    });
  } catch (error) {
    next(error);
  }
}

export const orderTrackingWorker = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId, authorizationRole } = req.body;
    const { period } = req.query;

    const periodTypes = typeof period !== 'string' ? "" : period

    const { orderCount, totalKg, totalPcs } = await orderTrackingWorkerService({ userId, authorizationRole, period: periodTypes })


    res.status(200).json({
      error: false,
      message: "Order berhasil diupdate!",
      data: {
        orderCount,
        totalKg,
        totalPcs,
      }
    });
  } catch (error) {
    next(error);
  }
}


export const orderTrackingUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId } = req.body;
    const { period } = req.query;

    const periodTypes = typeof period !== 'string' ? "" : period

    const { totalOrders, totalSpent, totalWeight, totalPcs } = await orderTrackingUserService({ userId, period: periodTypes })


    res.status(200).json({
      error: false,
      message: "Order berhasil diupdate!",
      data: {
        totalOrders,        
        totalSpent,
          totalWeight,
        totalPcs
      }
    });
  } catch (error) {
    next(error);
  }
}