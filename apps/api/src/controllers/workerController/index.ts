import prisma from "@/connection";
import { Prisma } from "@prisma/client";
import { NextFunction, Request, Response } from "express";

export const getOrdersForDriverWait = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId, authorizationRole, storesId } = req.body;
    const {
      page = '1',
      limit_data = '5',
      search = '',
      sort = 'date-asc',
      orderType = '',
    } = req.query;

    const offset = Number(limit_data) * (Number(page) - 1);

    const worker = await prisma.worker.findUnique({
      where: {
        id: userId,
        workerRole: authorizationRole,
      },
      select: { storesId: true },
    });

    if (!worker) {
      return res.status(404).json({ message: "Driver not found" });
    }

    const whereConditions: Prisma.OrderWhereInput = {
      storesId,
      orderStatus: {
        some: { status: 'AWAITING_DRIVER_PICKUP' },
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
    switch (sort) {
      case 'date-asc':
        orderBy = { createdAt: 'asc' };
        break;
      case 'date-desc':
        orderBy = { createdAt: 'desc' };
        break;
      case 'name-asc':
        orderBy = {
          Users: {
            firstName: 'asc',
          },
        };
        break;
      case 'name-desc':
        orderBy = {
          Users: {
            firstName: 'desc',
          },
        };
        break;
      default:
        orderBy = { createdAt: 'desc' };
    }

    const orders = await prisma.order.findMany({
      where: whereConditions,
      orderBy,
      skip: offset,
      take: Number(limit_data),
      include: {
        Users: {
          select: {
            firstName: true,
            lastName: true,
            phoneNumber: true,
            userAddress: {
              select: {
                addressName: true,
                addressDetail: true,
                city: true,
                province: true,
                country: true,
              },
            },
          },
        },
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

    const totalCount = await prisma.order.count({
      where: whereConditions,
    });

    const totalPage = Math.ceil(totalCount / Number(limit_data));

    const ordersWithDetails = orders.map((order) => ({
      ...order,
      userFirstName: order.Users?.firstName || null,
      userLastName: order.Users?.lastName || null,
      userPhoneNumber: order.Users?.phoneNumber || null,
      userAddress: order.Users?.userAddress || null,
      latestStatus: order.orderStatus[0]?.status || null,
      orderType: order.OrderType?.Type || null,
    }));

    res.status(200).json({
      error: false,
      message: "Orders waiting for pickup fetched successfully!",
      data: {
        totalPage,
        orders: ordersWithDetails,
      },
    });
  } catch (error) {
    next(error);
  }
};
export const getOrdersForDriverOutlet = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId, authorizationRole, storesId } = req.body;
    const {
      page = '1',
      limit_data = '5',
      search = '',
      sort = 'date-asc',
      orderType = '',
    } = req.query;

    const offset = Number(limit_data) * (Number(page) - 1);

    const worker = await prisma.worker.findUnique({
      where: {
        id: userId,
        workerRole: authorizationRole,
      },
      select: { storesId: true },
    });

    if (!worker) {
      return res.status(404).json({ message: "Driver not found" });
    }

    const whereConditions: Prisma.OrderWhereInput = {
      storesId,
      orderStatus: {
        some: { status: 'DRIVER_ARRIVED_AT_OUTLET' },
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
    switch (sort) {
      case 'date-asc':
        orderBy = { createdAt: 'asc' };
        break;
      case 'date-desc':
        orderBy = { createdAt: 'desc' };
        break;
      case 'name-asc':
        orderBy = {
          Users: {
            firstName: 'asc',
          },
        };
        break;
      case 'name-desc':
        orderBy = {
          Users: {
            firstName: 'desc',
          },
        };
        break;
      default:
        orderBy = { createdAt: 'desc' };
    }

    const orders = await prisma.order.findMany({
      where: whereConditions,
      orderBy,
      skip: offset,
      take: Number(limit_data),
      include: {
        Users: {
          select: {
            firstName: true,
            lastName: true,
            phoneNumber: true,
            userAddress: {
              select: {
                addressName: true,
                addressDetail: true,
                city: true,
                province: true,
                country: true,
              },
            },
          },
        },
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

    const totalCount = await prisma.order.count({
      where: whereConditions,
    });

    const totalPage = Math.ceil(totalCount / Number(limit_data));

    const ordersWithDetails = orders.map((order) => ({
      ...order,
      userFirstName: order.Users?.firstName || null,
      userLastName: order.Users?.lastName || null,
      userPhoneNumber: order.Users?.phoneNumber || null,
      userAddress: order.Users?.userAddress || null,
      latestStatus: order.orderStatus[0]?.status || null,
      orderType: order.OrderType?.Type || null,
    }));

    res.status(200).json({
      error: false,
      message: "Orders waiting for pickup fetched successfully!",
      data: {
        totalPage,
        orders: ordersWithDetails,
      },
    });
  } catch (error) {
    next(error);
  }
};
export const getOrdersForDriverProccess = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId, authorizationRole, storesId } = req.body;
    const {
      page = '1',
      limit_data = '5',
      search = '',
      sort = 'date-asc',
      orderType = '',
    } = req.query;

    const offset = Number(limit_data) * (Number(page) - 1);

    const worker = await prisma.worker.findUnique({
      where: {
        id: userId,
        workerRole: authorizationRole,
      },
      select: { storesId: true },
    });

    if (!worker) {
      return res.status(404).json({ message: "Driver not found" });
    }

    const whereConditions: Prisma.OrderWhereInput = {
      storesId,
      orderStatus: {
        some: { status: 'DRIVER_TO_OUTLET' },
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
      skip: offset,
      take: Number(limit_data),
      include: {
        Users: {
          select: {
            firstName: true,
            lastName: true,
            phoneNumber: true,
            userAddress: {
              select: {
                addressName: true,
                addressDetail: true,
                city: true,
                province: true,
                country: true,
              },
            },
          },
        },
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

    const totalCount = await prisma.order.count({
      where: whereConditions,
    });

    const totalPage = Math.ceil(totalCount / Number(limit_data));

    const ordersWithDetails = orders.map((order) => ({
      ...order,
      userFirstName: order.Users?.firstName || null,
      userLastName: order.Users?.lastName || null,
      userPhoneNumber: order.Users?.phoneNumber || null,
      userAddress: order.Users?.userAddress || null,
      latestStatus: order.orderStatus[0]?.status || null,
      orderType: order.OrderType?.Type || null,
    }));

    res.status(200).json({
      error: false,
      message: "Orders waiting for pickup fetched successfully!",
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
  
} catch (error) {
  
}

}
