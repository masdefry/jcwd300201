import prisma from "@/connection";
import { Prisma } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import { Status } from "@prisma/client";

export const getOrdersForDriver = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId, authorizationRole, storesId } = req.body;
    const {
      page = '1',
      limit_data = '5',
      search = '',
      sort = 'date-asc',
      orderType = '',
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

    const statusFilter :any=
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
        orderType ? { orderType: { Type: { equals: orderType as string } } } : {},  
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
    } else {
      orderBy = { createdAt: 'desc' };
    }

    const orders = await prisma.order.findMany({
      where: whereConditions,
      orderBy,
      include: {
        Users: true,
        UserAddress :true,
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

    const ordersWithDetails = paginatedOrders.map((order) => ({
      ...order,
      userFirstName: order.Users?.firstName || null,
      userLastName: order.Users?.lastName || null,
      userPhoneNumber: order.Users?.phoneNumber || null,
      userAddress: order.UserAddress || null,
      latestStatus: order.orderStatus[0]?.status || null,
      orderType: order.OrderType?.Type || null,
    }));

    res.status(200).json({
      error: false,
      message: "Order berhasil didapatkan!",
      data: {
        totalPage,
        orders: ordersWithDetails,
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


export const getItemName = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const itemName = await prisma.itemName.findMany({
      where: {
        deletedAt: null
      }
    });
    res.status(200).json({
      error: false,
      message: "Data berhasil didapat!",
      data: itemName
    });
  } catch (error) {
    next(error);

  }
}
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
export const getOrderNoteDetail = async (req: Request, res: Response, next: NextFunction) => {

  try {
    const { id } = req.params
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
        id,
        storesId,
      },
      include: {
        Users: true,
        UserAddress: true,
        OrderType: true,
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