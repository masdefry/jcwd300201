import prisma from "@/connection";
import { Prisma } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import { Status } from "@prisma/client";
import { validateEmail } from "@/middleware/validation/emailValidation";
import { phoneNumberValidation } from "@/middleware/validation/phoneNumberValidation";
import fs, { rmSync } from 'fs'
import { comparePassword, hashPassword } from "@/utils/passwordHash";
import dotenv from 'dotenv'

dotenv.config()
const profilePict: string | undefined = process.env.PROFILE_PICTURE as string


export const getListItem = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId } = req.body;
    const worker = await prisma.worker.findFirst({
      where: {
        id: userId,
      },
      select: { storesId: true },
    });

    if (!worker) throw { msg: "Driver tidak tersedia", status: 404 }


    const dataItem = await prisma.itemName.findMany({
      where: {
        deletedAt: null
      }
    })
    res.status(200).json({
      error: false,
      message: "Order berhasil didapatkan!",
      data:
        dataItem
    });
  } catch (error) {
    next(error)
  }
}



// get order driver
export const getOrdersForDriver = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId, authorizationRole, storesId } = req.body;
    const {
      page = '1',
      limit_data = '5',
      search = '',
      sort = 'date-asc',
      tab = ''
    } = req.query;

    const offset = Number(limit_data) * (Number(page) - 1);

    const worker = await prisma.worker.findUnique({
      where: {
        id: userId,
        workerRole: authorizationRole,
      },
      select: { storesId: true },
    });

    if (!worker) throw { msg: "Driver tidak tersedia", status: 404 }

    const statusFilter: any =
      tab === 'AWAITING_DRIVER_PICKUP'
        ? ['AWAITING_DRIVER_PICKUP']
        : tab === 'DRIVER_TO_OUTLET'
          ? ['DRIVER_TO_OUTLET']
          : tab === 'DRIVER_ARRIVED_AT_OUTLET'
            ? ['DRIVER_ARRIVED_AT_OUTLET']
            : ['AWAITING_DRIVER_PICKUP', 'DRIVER_TO_OUTLET', 'DRIVER_ARRIVED_AT_OUTLET']; // Default to all statuses if no tab is selected

    const whereConditions: Prisma.OrderWhereInput = {
      storesId,
      orderStatus: {
        some: { status: { in: statusFilter } },
      },
      AND: [
        search
          ? {
            OR: [
              { id: { contains: search as string } },
              { Users: { firstName: { contains: search as string } } },
              { Users: { lastName: { contains: search as string } } },
              { Users: { phoneNumber: { contains: search as string } } },
            ],
          }
          : {},
      ].filter((condition) => Object.keys(condition).length > 0),
    };


    let orderBy: Prisma.OrderOrderByWithRelationInput;
    if (sort === 'date-asc') {
      orderBy = { createdAt: 'asc' };
    } else if (sort === 'date-desc') {
      orderBy = { createdAt: 'desc' };
    } else if (sort === 'name-asc') {
      orderBy = {
        Users: {
          firstName: 'asc',
        },
      };
    } else if (sort === 'name-desc') {
      orderBy = {
        Users: {
          firstName: 'desc',
        },
      };
    } else if (sort === 'order-id-asc') {
      orderBy = { id: 'asc' };
    } else if (sort === 'order-id-desc') {
      orderBy = { id: 'desc' };
    } else {
      orderBy = { createdAt: 'desc' };
    }

    const orders = await prisma.order.findMany({
      where: whereConditions,
      orderBy,
      include: {
        Users: true,
        UserAddress: true,
        orderStatus: {
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
        OrderType: {
          select: {
            Type: true,
          },
        },
      },
    });

    const filteredOrders = orders.filter(order => {
      const latestStatus = order.orderStatus[0]?.status;
      return statusFilter.includes(latestStatus);

    });

    const paginatedOrders = filteredOrders.slice(offset, offset + Number(limit_data));

    const totalCount = filteredOrders.length;

    const totalPage = Math.ceil(totalCount / Number(limit_data));


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


// acc order for driver
export const acceptOrder = async (req: Request, res: Response, next: NextFunction) => {

  try {
    const { orderId } = req.params;
    const { userId, email } = req.body;

    const findWorker = await prisma.worker.findFirst({
      where: { email }
    })

    if (!findWorker) throw { msg: "driver tidak tersedia", status: 404 }

    const order = await prisma.order.findFirst({
      where: { id: orderId },
      include: { orderStatus: true },
    });

    if (!order) {
      return res.status(404).json({ error: true, message: "Order tidak ditemukan" });
    }

    const existingStatus = order.orderStatus.find((status) => status.status === "DRIVER_TO_OUTLET");
    if (existingStatus) {
      return res.status(400).json({ error: true, message: "Order sudah diterima sebelumnya" });
    }

    if (order.orderStatus.some((status) => status.status === "AWAITING_DRIVER_PICKUP")) {
      const newStatus = await prisma.orderStatus.create({
        data: {
          orderId: order.id,
          status: "DRIVER_TO_OUTLET",
          createdAt: new Date(),
          workerId: userId,

        },
      });

      await prisma.order.update({
        where: { id: order.id },
        data: {
          updatedAt: new Date()
        },
      });

      res.status(200).json({
        error: false,
        message: "Order berhasil diterima",
        data: newStatus,
      });
    } else {
      res.status(400).json({ error: true, message: "Order tidak bisa diambil" });
    }
  } catch (error) {
    next(error);
  }
};

// acc order outlet
export const acceptOrderOutlet = async (req: Request, res: Response, next: NextFunction) => {

  try {
    const { orderId } = req.params;
    const { userId, email } = req.body;

    const findWorker = await prisma.worker.findFirst({
      where: { email }
    })

    if (!findWorker) throw { msg: "driver tidak tersedia", status: 404 }

    const order = await prisma.order.findFirst({
      where: { id: orderId },
      include: { orderStatus: true },
    });

    if (!order) {
      return res.status(404).json({ error: true, message: "Order tidak ditemukan" });
    }

    const existingStatus = order.orderStatus.find((status) => status.status === "DRIVER_ARRIVED_AT_OUTLET");
    if (existingStatus) {
      return res.status(400).json({ error: true, message: "Order sudah diterima sebelumnya" });
    }

    if (order.orderStatus.some((status) => status.status === "DRIVER_TO_OUTLET")) {
      const newStatus = await prisma.orderStatus.create({
        data: {
          orderId: order.id,
          status: "DRIVER_ARRIVED_AT_OUTLET",
          createdAt: new Date(),
          workerId: userId
        },
      });

      await prisma.order.update({
        where: { id: order.id },
        data: {
          updatedAt: new Date()
        },
      });

      res.status(200).json({
        error: false,
        message: "Order berhasil diterima",
        data: newStatus,
      });
    } else {
      res.status(400).json({ error: true, message: "Order tidak bisa diambil" });
    }
  } catch (error) {
    next(error);
  }
};

// get nota order
export const getOrderNote = async (req: Request, res: Response, next: NextFunction) => {

  try {
    const { userId, authorizationRole, storesId } = req.body;

    const worker = await prisma.worker.findUnique({
      where: {
        id: userId,
        workerRole: authorizationRole,
        storesId: storesId

      }
    });

    if (!worker) {
      return res.status(404).json({ message: "Driver not found" });
    }

    const order = await prisma.order.findMany({
      where: {
        storesId,
        orderStatus: {
          some: {
            status: "DRIVER_ARRIVED_AT_OUTLET",
          },
        },
      },
      include: {
        Users: true,
        UserAddress: true,
        OrderType: true,
        orderStatus: {
          orderBy: { createdAt: "desc" },
          take: 1,
        },
      },

    });

    if (!order) {
      return res.status(404).json({ error: "Order tidak ditemukan" });
    }

    res.status(200).json({
      error: false,
      message: "Data berhasil didapat!",
      data: order
    })
  } catch (error) {
    next(error)
  }
}

// getordernotedetail
export const getOrderNoteDetail = async (req: Request, res: Response, next: NextFunction) => {

  try {
    const { id } = req.params
    const { userId, authorizationRole, storesId } = req.body;

    const worker = await prisma.worker.findFirst({
      where: {
        id: userId,
        workerRole: authorizationRole,
        storesId: storesId
      }
    });


    if (!worker) throw { msg: "Data worker tidak tersedia", status: 404 }


    const order = await prisma.order.findMany({
      where: {
        id,
        storesId,
      },
      include: {
        Users: true,
        UserAddress: true,
        OrderType: true,
      },
    })

    if (!order) throw { msg: 'Order tidak ditemukan', status: 404 }

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

    const listItem = await prisma.orderDetail.findMany({
      where: {
        orderId
      }
    })

    const DetailListItem = listItem.map(item => ({
      itemNameId: item.itemNameId,
      quantity: item.quantity,
    }));

    res.status(200).json({
      error: false,
      message: 'Detail item order berhasil didapatkan',
      data: DetailListItem
    });

  } catch (error) {
    next(error)
  }
}

export const getOrdersForWashing = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId, authorizationRole, storesId } = req.body;
    const {
      page = '1',
      limit_data = '5',
      search = '',
      sort = 'date-asc',
      tab = ''
    } = req.query;

    const offset = Number(limit_data) * (Number(page) - 1);

    const worker = await prisma.worker.findUnique({
      where: {
        id: userId,
        workerRole: authorizationRole,
      },
      select: { storesId: true },
    });

    if (!worker) throw { msg: "Driver tidak tersedia", status: 404 }

    const statusFilter: any =
      tab ? [tab]
        : ['AWAITING_PAYMENT', 'IN_WASHING_PROCESS', 'IN_IRONING_PROCESS'];

    const whereConditions: Prisma.OrderWhereInput = {
      storesId,
      orderStatus: {
        some: { status: { in: statusFilter } },
      },
      AND: [
        search
          ? {
            OR: [
              { id: { contains: search as string } },
              { Users: { firstName: { contains: search as string } } },
              { Users: { lastName: { contains: search as string } } },
              { Users: { phoneNumber: { contains: search as string } } },
            ],
          }
          : {},
      ].filter((condition) => Object.keys(condition).length > 0),
    };


    let orderBy: Prisma.OrderOrderByWithRelationInput;
    if (sort === 'date-asc') {
      orderBy = { createdAt: 'asc' };
    } else if (sort === 'date-desc') {
      orderBy = { createdAt: 'desc' };
    } else if (sort === 'name-asc') {
      orderBy = {
        Users: {
          firstName: 'asc',
        },
      };
    } else if (sort === 'name-desc') {
      orderBy = {
        Users: {
          firstName: 'desc',
        },
      };
    } else if (sort === 'order-id-asc') {
      orderBy = { id: 'asc' };
    } else if (sort === 'order-id-desc') {
      orderBy = { id: 'desc' };
    } else {
      orderBy = { createdAt: 'desc' };
    }

    const orders = await prisma.order.findMany({
      where: whereConditions,
      orderBy,
      include: {
        Users: true,
        UserAddress: true,
        orderStatus: {
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
        OrderType: {
          select: {
            Type: true,
          },
        },
      },
    });

    const filteredOrders = orders.filter(order => {
      const latestStatus = order.orderStatus[0]?.status;
      return statusFilter.includes(latestStatus) && latestStatus !== 'PAYMENT_DONE'

    });

    const paginatedOrders = filteredOrders.slice(offset, offset + Number(limit_data));

    const totalCount = filteredOrders.length;

    const totalPage = Math.ceil(totalCount / Number(limit_data));


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
    const { userId, authorizationRole, storesId } = req.body;
    const {
      page = '1',
      limit_data = '5',
      search = '',
      sort = 'date-asc',
      tab = ''
    } = req.query;

    const offset = Number(limit_data) * (Number(page) - 1);

    const worker = await prisma.worker.findUnique({
      where: {
        id: userId,
        workerRole: authorizationRole,
      },
      select: { storesId: true },
    });

    if (!worker) throw { msg: "Worker tidak tersedia", status: 404 }

    let statusFilter: any;
    if (tab === "prosesSetrika") {
      statusFilter = ['IN_IRONING_PROCESS'];
    } else if (tab === "belumDisetrika") {
      statusFilter = ['IN_IRONING_PROCESS'];
    } else if (tab === "selesai") {
      statusFilter = ['IN_PACKING_PROCESS'];
    } else if (tab === "semua") {
      statusFilter = ['IN_IRONING_PROCESS', 'IN_PACKING_PROCESS'];
    } else if (tab) {
      statusFilter = [tab];
    } else {
      statusFilter = ['IN_IRONING_PROCESS', 'IN_PACKING_PROCESS'];
    }

    const whereConditions: Prisma.OrderWhereInput = {
      storesId,
      orderStatus: {
        some: { status: { in: statusFilter } },
      },
      AND: [
        search
          ? {
            OR: [
              { id: { contains: search as string } },
              { Users: { firstName: { contains: search as string } } },
              { Users: { lastName: { contains: search as string } } },
              { Users: { phoneNumber: { contains: search as string } } },
            ],
          }
          : {},
        ...(tab === 'belumDisetrika' ? [{ isProcessed: false }] : []),
        ...(tab === 'prosesSetrika' ? [{ isProcessed: true }] : []),
      ].filter((condition) => Object.keys(condition).length > 0),
    };


    let orderBy: Prisma.OrderOrderByWithRelationInput;
    if (sort === 'date-asc') {
      orderBy = { createdAt: 'asc' };
    } else if (sort === 'date-desc') {
      orderBy = { createdAt: 'desc' };
    } else if (sort === 'name-asc') {
      orderBy = {
        Users: {
          firstName: 'asc',
        },
      };
    } else if (sort === 'name-desc') {
      orderBy = {
        Users: {
          firstName: 'desc',
        },
      };
    } else if (sort === 'order-id-asc') {
      orderBy = { id: 'asc' };
    } else if (sort === 'order-id-desc') {
      orderBy = { id: 'desc' };
    } else {
      orderBy = { createdAt: 'desc' };
    }

    const orders = await prisma.order.findMany({
      where: whereConditions,
      orderBy,
      include: {
        Users: true,
        UserAddress: true,
        orderStatus: {
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
        OrderType: {
          select: {
            Type: true,
          },
        },
      },
    });

    const filteredOrders = orders.filter(order => {
      const latestStatus = order.orderStatus[0]?.status;
      return statusFilter.includes(latestStatus) && latestStatus !== 'PAYMENT_DONE'

    });

    const paginatedOrders = filteredOrders.slice(offset, offset + Number(limit_data));

    const totalCount = filteredOrders.length;

    const totalPage = Math.ceil(totalCount / Number(limit_data));


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
    const { userId, authorizationRole, storesId } = req.body;
    const {
      page = '1',
      limit_data = '5',
      search = '',
      sort = 'date-asc',
      tab = ''
    } = req.query;
    console.log(userId, authorizationRole,'<<<<<<<<<')
    const offset = Number(limit_data) * (Number(page) - 1);

    const worker = await prisma.worker.findUnique({
      where: {
        id: userId,
        workerRole: authorizationRole,
      },
      select: { storesId: true },
    });

    if (!worker) throw { msg: "Worker tidak tersedia", status: 404 }

    let statusFilter: any;
    if (tab === "prosesPacking") {
      statusFilter = ['IN_PACKING_PROCESS'];
    } else if (tab === "belumPacking") {
      statusFilter = ['IN_PACKING_PROCESS'];
    } else if (tab === "selesai") {
      statusFilter = ['IN_PACKING_PROCESS'];
    } else if (tab === "semua") {
      statusFilter = ['IN_PACKING_PROCESS'];
    } else if (tab) {
      statusFilter = [tab];
    } else {
      statusFilter = ['IN_PACKING_PROCESS'];
    }

    const whereConditions: Prisma.OrderWhereInput = {
      storesId,
      orderStatus: {
        some: { status: { in: statusFilter } },
      },
      AND: [
        search
          ? {
            OR: [
              { id: { contains: search as string } },
              { Users: { firstName: { contains: search as string } } },
              { Users: { lastName: { contains: search as string } } },
              { Users: { phoneNumber: { contains: search as string } } },
            ],
          }
          : {},
        ...(tab === 'belumDipacking' ? [{ isProcessed: false }] : []),
        ...(tab === 'prosesPacking' ? [{ isProcessed: true }] : []),
        ...(tab === 'selesai' ? [{ isDone: true }] : []),
      ].filter((condition) => Object.keys(condition).length > 0),
    };


    let orderBy: Prisma.OrderOrderByWithRelationInput;
    if (sort === 'date-asc') {
      orderBy = { createdAt: 'asc' };
    } else if (sort === 'date-desc') {
      orderBy = { createdAt: 'desc' };
    } else if (sort === 'name-asc') {
      orderBy = {
        Users: {
          firstName: 'asc',
        },
      };
    } else if (sort === 'name-desc') {
      orderBy = {
        Users: {
          firstName: 'desc',
        },
      };
    } else if (sort === 'order-id-asc') {
      orderBy = { id: 'asc' };
    } else if (sort === 'order-id-desc') {
      orderBy = { id: 'desc' };
    } else {
      orderBy = { createdAt: 'desc' };
    }

    const orders = await prisma.order.findMany({
      where: whereConditions,
      orderBy,
      include: {
        Users: true,
        UserAddress: true,
        orderStatus: {
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
        OrderType: {
          select: {
            Type: true,
          },
        },
      },
    });

    const filteredOrders = orders.filter(order => {
      const latestStatus = order.orderStatus[0]?.status;
      return statusFilter.includes(latestStatus) && latestStatus !== 'PAYMENT_DONE'

    });

    const paginatedOrders = filteredOrders.slice(offset, offset + Number(limit_data));

    const totalCount = filteredOrders.length;

    const totalPage = Math.ceil(totalCount / Number(limit_data));


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


// createorder

export const createOrder = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { orderId } = req.params
    const { email, userId, totalWeight, totalPrice, items } = req.body

    const findWorker = await prisma.worker.findFirst({
      where: { email }
    })
    if (!findWorker) throw { msg: "worker tidak tersedia", status: 404 }

    const updatedOrder = await prisma.order.update({
      where: {
        id: String(orderId),
      },
      data: {
        totalWeight: totalWeight,
        totalPrice: totalPrice,
        isProcessed: true,
        isSolved: true
      },
    });

    if (items.length == 0) throw { msg: 'Item wajib diisi', status: 400 }


    const dataItems = items.map((item: any) => {
      return {
        orderId: String(orderId),
        itemNameId: Number(item.itemName),
        quantity: item.quantity,
      }
    })

    await prisma.orderDetail.createMany({
      data: dataItems
    })

    const orderStatus = await prisma.orderStatus.create({
      data: {
        status: 'AWAITING_PAYMENT',
        orderId: String(orderId),
        workerId: userId,
      },
    });


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

    if (!findWorker) throw { msg: "worker tidak tersedia", status: 404 }

    let updatedOrder = null;
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

      if (!updatedOrder) {
        throw { msg: "Order gagal diupdate", status: 404 };
      }
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
          status: 'AWAITING_PAYMENT',
        },
      });

      if (!existingStatus) {
        throw { msg: "Order tidak dapat diproses karena belum dibuat nota order oleh oulet admin", status: 400 };
      }

      const orderStatus = await prisma.orderStatus.create({
        data: {
          status: 'IN_WASHING_PROCESS',
          orderId: String(orderId),
          workerId: userId,
        },
      });
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

    const findWorker = await prisma.worker.findFirst({
      where: { email }
    })

    if (!findWorker) throw { msg: "worker tidak tersedia", status: 404 }

    await prisma.order.update({
      where: {
        id: String(orderId),
      },
      data: {
        isProcessed: false
      },
    });

    const orderStatus = await prisma.orderStatus.create({
      data: {
        status: 'IN_IRONING_PROCESS',
        orderId: String(orderId),
        // workerId: userId,
      },
    });

    if (!orderStatus) throw { msg: "data order status gagal dibuat", status: 404 }
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


export const ironingProcess = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { orderId } = req.params
    const { email, userId, notes } = req.body
    const findWorker = await prisma.worker.findFirst({
      where: { email }
    })

    if (!findWorker) throw { msg: "worker tidak tersedia", status: 404 }

    const orderStatuses = await prisma.orderStatus.findFirst({
      where: {
        orderId,
        status: 'IN_IRONING_PROCESS'
      },
    });

    if (!orderStatuses) throw { msg: "tidak ada order dengan status 'IN_IRONING_PROCESS'" };

    await prisma.orderStatus.update({
      where: { id: orderStatuses.id },
      data: {
        workerId: userId,
      },
    });

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

      if (!updatedOrder) {
        throw { msg: "Order gagal diupdate", status: 404 };
      }
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

      if (!existingStatus) {
        throw { msg: "Order tidak dapat diproses karena belum dicuci", status: 400 };
      }

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

    const findWorker = await prisma.worker.findFirst({
      where: { email }
    })

    if (!findWorker) throw { msg: "worker tidak tersedia", status: 404 }

    await prisma.order.update({
      where: {
        id: String(orderId),
      },
      data: {
        isProcessed: false
      },
    });

    const orderStatus = await prisma.orderStatus.create({
      data: {
        status: 'IN_PACKING_PROCESS',
        orderId: String(orderId),
      },
    });
    if (!orderStatus) throw { msg: "data order status gagal dibuat", status: 404 }
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
    const findWorker = await prisma.worker.findFirst({
      where: { email }
    })

    if (!findWorker) throw { msg: "worker tidak tersedia", status: 404 }

    const orderStatuses = await prisma.orderStatus.findFirst({
      where: {
        orderId,
        status: 'IN_PACKING_PROCESS'
      },
    });

    if (!orderStatuses) throw { msg: "tidak ada order dengan status 'IN_IRONING_PROCESS'" };

    await prisma.orderStatus.update({
      where: { id: orderStatuses.id },
      data: {
        workerId: userId,
      },
    });

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

      if (!updatedOrder) {
        throw { msg: "Order gagal diupdate", status: 404 };
      }
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
          status: 'IN_PACKING_PROCESS',
        },
      });

      if (!existingStatus) {
        throw { msg: "Order tidak dapat diproses karena belum disetrika", status: 400 };
      }

      res.status(200).json({
        error: false,
        message: "Order berhasil diupdate!",
      });
    }
  } catch (error) {
    next(error)
  }
}

export const packingProcessDone = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { orderId } = req.params
    const { email, userId } = req.body

    const findWorker = await prisma.worker.findFirst({
      where: { email }
    })

    if (!findWorker) throw { msg: "worker tidak tersedia", status: 404 }

    const order = await prisma.order.update({
      where: {
        id: String(orderId),
      },
      data: {
        isProcessed: false,
        isDone: true
      },
    });

    // const orderStatus = await prisma.orderStatus.create({
    //   data: {
    //     status: 'AWAITING_DRIVER_PICKUP',
    //     orderId: String(orderId),
    //   },
    // });

    // if (!orderStatus) throw { msg: "data order status gagal dibuat", status: 404 }
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


// updateProfile Worker
export const updateProfileWorker = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const imageUploaded: any = req.files
    const { userId, email, phoneNumber, firstName, lastName } = req.body
    const findUser = await prisma.worker.findFirst({ where: { id: userId } })
    const findEmail = await prisma.worker.findFirst({ where: { email } })

    if (!findUser) throw { msg: 'User tidak tersedia', status: 404 }
    if (findEmail && findEmail?.email !== findUser?.email) throw { msg: 'Email sudah terpakai', status: 401 }
    if (!validateEmail(email)) throw { msg: 'Harap masukan email dengan format yang valid', status: 401 }
    if (!phoneNumberValidation(phoneNumber)) throw { msg: 'Harap masukan nomor telepon dengan format nomor', status: 401 }
    if (email === findUser?.email && firstName === findUser?.firstName && lastName === findUser?.lastName && phoneNumber === findUser?.phoneNumber && (imageUploaded?.images?.length === 0 || imageUploaded?.images?.length === undefined)) throw { msg: 'Data tidak ada yang diubah', status: 400 }

    const dataImage: string[] = imageUploaded?.images?.map((img: any) => {
      return img?.filename
    })

    const newDataWorker = await prisma.worker.update({
      where: { id: userId },
      data: { firstName, lastName, email, phoneNumber, profilePicture: dataImage?.length > 0 ? dataImage[0] : findUser?.profilePicture }
    })

    if (!findUser?.profilePicture.includes('https://') && newDataWorker?.profilePicture !== findUser?.profilePicture) { /** ini bersikap sementara karna default value profilePict itu dari google / berupa https:// */
      fs.rmSync(`src/public/images/${findUser?.profilePicture}`) /**sedangkan ini menghapus directory membaca folder public/images akan menyebabkan error */
    }

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

    const findWorker = await prisma.worker.findFirst({
      where: { id: userId }
    })

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

    const findWorker = await prisma.worker.findFirst({ where: { id: userId } })
    const compareOldPassword = await comparePassword(existingPassword, findWorker?.password as string)
    if (!compareOldPassword) throw { msg: 'Password lama anda salah', status: 401 }
    if (existingPassword === password) throw { msg: 'Harap masukan password yang berbeda', status: 401 }

    const hashedPassword = await hashPassword(password)
    await prisma.worker.update({
      where: { id: userId },
      data: { password: hashedPassword }
    })

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

    const findWorker = await prisma.worker.findFirst({ where: { id: userId } })
    if (!findWorker) throw { msg: 'Data tidak tersedia', status: 404 }

    await prisma.worker.update({
      where: { id: userId },
      data: { profilePicture: profilePict }
    })

    if (!findWorker?.profilePicture?.includes(profilePict)) {
      rmSync(`src/public/images/${findWorker?.profilePicture}`)
    }

    res.status(200).json({
      error: false,
      message: 'Berhasil menghapus foto profil',
      data: {}
    })

  } catch (error) {
    next(error)
  }
}


export const approveNotes = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { orderId } = req.params;
    const { email } = req.body;

    const findWorker = await prisma.worker.findFirst({
      where: { email }
    })

    if (!findWorker) throw { msg: "driver tidak tersedia", status: 404 }

    const order = await prisma.order.findFirst({
      where: { id: orderId },
      include: {
        orderDetail: true,
        orderStatus: true
      },
    });

    if (!order) {
      return res.status(404).json({ error: true, message: "Order tidak ditemukan" });
    }

    await prisma.order.update({
      where: {
        id: order.id
      },
      data: { isSolved: true }
    })
    res.status(200).json({
      error: false,
      message: 'Berhasil melakukan approve untuk melanjutkan proses',
      data: {}
    })

  } catch (error) {
    next(error)
  }
}

export const getWashingHistory = async (req: Request, res: Response, next: NextFunction) => {
try {
  
} catch (error) {
  
}
}