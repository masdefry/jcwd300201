import prisma from "@/connection";
import { Prisma } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import { Status } from "@prisma/client";
import { validateEmail } from "@/middleware/validation/emailValidation";
import { phoneNumberValidation } from "@/middleware/validation/phoneNumberValidation";
import fs from 'fs'
import { comparePassword, hashPassword } from "@/utils/passwordHash";
import dotenv from 'dotenv'

dotenv.config()
const profilePict: string | undefined = process.env.PROFILE_PICTURE as string

// get order driver
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

    if (!worker) throw { msg: 'Data worker tidak tersedia', status: 404 }

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
    if (email === findUser?.email && firstName === findUser?.firstName && lastName === findUser?.lastName && phoneNumber === findUser?.phoneNumber && (imageUploaded?.images?.length === 0 || imageUploaded?.images?.length === undefined)) throw { msg: 'Data tidak ada yang dirubah', status: 400 }

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

    const hashedPassword = await hashPassword(password)
    await prisma.worker.update({
      where: { id: userId },
      data: { password: hashedPassword }
    })

    res.status(200).json({
      error: false,
      message: 'Password berhasil dirubah',
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

    res.status(200).json({
      error: false,
      message: 'Berhasil menghapus foto profil',
      data: {}
    })
    
  } catch (error) {
    next(error)
  }
}