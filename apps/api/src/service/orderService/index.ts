import prisma from "@/connection"
import { validateEmail } from "@/middleware/validation/emailValidation"
import { phoneNumberValidation } from "@/middleware/validation/phoneNumberValidation"
import fs, { rmSync } from 'fs'
import dotenv from 'dotenv'
import { IWashingProcessDone, ICreateOrder, IGetOrdersForWashing, IAcceptOrderOutlet, IAcceptOrder, IFindNearestStore, IRequestPickup, IGetUserOrder, IGetOrderForDriver, IGetOrderNoteDetail, IGetPackingHistory, IGetIroningHistory, IGetWashingHistory, IGetNotes, IIroningProcessDone } from "./types"
import { Prisma, Role, Status } from "@prisma/client"
import { addHours } from "date-fns"
dotenv.config()

export const requestPickUpService = async ({ userId, deliveryFee, outletId, orderTypeId, userAddressId }: IRequestPickup) => {
  const findUser = await prisma.user.findFirst({ where: { id: userId } })
  const dateCustom = `${new Date().getFullYear()}${new Date().getMonth()}${new Date().getDate()}${Date.now()}`
  const orderId = `ORD-${dateCustom}-${findUser?.firstName.toUpperCase()}`
  const dateNow = addHours(new Date(), 7)

  const newOrder: any = await prisma.order.create({
    data: {
      id: orderId,
      totalPrice: null,
      deliveryFee,
      storeId: outletId,
      userId,
      orderTypeId: parseInt(orderTypeId),
      userAddressId,
      isPaid: false,
      createdAt: dateNow,
      updatedAt: dateNow
    },
  });

  console.log(newOrder)

  await prisma.orderStatus.create({
    data: {
      status: "AWAITING_DRIVER_PICKUP",
      orderId: newOrder.id,
    },
  });

  return { newOrder }
}

export const findNearestStoreService = async ({ userId, address }: IFindNearestStore) => {

  let userAddress;
  if (address) {
    userAddress = await prisma.userAddress.findFirst({
      where: {
        userId: userId,
        id: Number(address)
      }
    });
  } else {
    userAddress = await prisma.userAddress.findFirst({
      where: {
        userId: userId,
        isMain: true
      }
    })
  }

  if (!userAddress) throw { msg: 'Alamat utama tidak ditemukan', status: 404 };


  const { latitude: userLatitude, longitude: userLongitude } = userAddress;

  const nearestStores: any = await prisma.$queryRaw<{
    id: number;
    storeName: string;
    address: string;
    city: string;
    province: string;
    country: string;
    latitude: number;
    longitude: number;
    distance: number;
  }[]>`
      SELECT 
          id, 
          storeName, 
          address,
          city,
          province,
          country,
          latitude,
          longitude,
          (
              6371 * acos(
                  cos(radians(${userLatitude})) * cos(radians(latitude)) * 
                  cos(radians(longitude) - radians(${userLongitude})) + 
                  sin(radians(${userLatitude})) * sin(radians(latitude))
              )
          ) AS distance
      FROM stores
      HAVING distance <= 100
      ORDER BY distance ASC
      LIMIT 1;
    `;

  if (nearestStores.length === 0) throw { msg: 'Tidak ada toko Laundry kami di dekat anda', status: 404 }
  console.log('<<< sampe mana')
  return { nearestStores }
}

export const getUserOrderService = async ({ userId, limit_data, page, search, dateUntil, dateFrom, sort }: IGetUserOrder) => {
  const offset = Number(limit_data) * (Number(page) - 1);

  const whereConditions: any = {
    userId: userId,
    AND: [
      search
        ? {
          OR: [
            { id: { contains: search as string, mode: 'insensitive' } },
            { User: { firstName: { contains: search as string, mode: 'insensitive' } } },
            { User: { lastName: { contains: search as string, mode: 'insensitive' } } },
            { User: { phoneNumber: { contains: search as string, mode: 'insensitive' } } }
          ]
        }
        : {},
      dateFrom && dateUntil
        ? { createdAt: { gte: new Date(dateFrom as string), lte: new Date(dateUntil as string) } }
        : dateFrom
          ? { createdAt: { gte: new Date(dateFrom as string) } }
          : dateUntil
            ? { createdAt: { lte: new Date(dateUntil as string) } }
            : {}
    ]
  };

  let orderBy: any;
  if (sort === 'date-asc') {
    orderBy = { createdAt: 'asc' };
  } else if (sort === 'date-desc') {
    orderBy = { createdAt: 'desc' };
  } else if (sort === 'name-asc') {
    orderBy = {
      User: {
        firstName: 'asc',
      },
    };
  } else if (sort === 'name-desc') {
    orderBy = {
      User: {
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
    include: {
      Store: true,
      User: true,
      OrderType: true,
      UserAddress: true,
      orderStatus: {
        orderBy: { createdAt: 'desc' },
        take: 1
      }
    },
    skip: offset,
    take: Number(limit_data),
    orderBy
  });

  const totalCount = await prisma.order.count({
    where: whereConditions
  });

  const totalPage = Math.ceil(totalCount / Number(limit_data));

  return { totalPage, orders }
}

export const getOrdersForDriverService = async ({ authorizationRole, tab, storeId, userId, limit_data, page, search, dateUntil, dateFrom, sort }: IGetOrderForDriver) => {
  const offset = Number(limit_data) * (Number(page) - 1);

  const worker = await prisma.worker.findUnique({
    where: {
      id: userId,
      workerRole: authorizationRole as Prisma.EnumRoleFilter<"Worker">,
    },
    select: { storeId: true },
  });

  if (!worker) throw { msg: "Driver tidak tersedia", status: 404 }

  const statusFilter: any =
    tab === 'AWAITING_DRIVER_PICKUP'
      ? ['AWAITING_DRIVER_PICKUP']
      : tab === 'DRIVER_TO_OUTLET'
        ? ['DRIVER_TO_OUTLET']
        : tab === 'DRIVER_ARRIVED_AT_OUTLET'
          ? ['DRIVER_ARRIVED_AT_OUTLET']
          : ['AWAITING_DRIVER_PICKUP', 'DRIVER_TO_OUTLET', 'DRIVER_ARRIVED_AT_OUTLET'];

  const whereConditions: Prisma.OrderWhereInput = {
    storeId,
    orderStatus: {
      some: { status: { in: statusFilter } },
    },
    AND: [
      search
        ? {
          OR: [
            { id: { contains: search as string } },
            { User: { firstName: { contains: search as string } } },
            { User: { lastName: { contains: search as string } } },
            { User: { phoneNumber: { contains: search as string } } },
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
      User: {
        firstName: 'asc',
      },
    };
  } else if (sort === 'name-desc') {
    orderBy = {
      User: {
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
      User: true,
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

  return { totalPage, paginatedOrders }
}

export const acceptOrderService = async ({ email, orderId, userId }: IAcceptOrder) => {
  const findWorker = await prisma.worker.findFirst({
    where: { email }
  })

  if (!findWorker) throw { msg: "driver tidak tersedia", status: 404 }

  const order = await prisma.order.findFirst({
    where: { id: orderId },
    include: { orderStatus: true },
  });

  if (!order) throw { msg: "Order tidak ditemukan", status: 404 };


  const existingStatus = order.orderStatus.find((status) => status.status === "DRIVER_TO_OUTLET");
  if (existingStatus) throw { msg: "Order sudah diterima sebelumnya", status: 404 };


  if (order.orderStatus.some((status) => status.status === "AWAITING_DRIVER_PICKUP")) {
    const newStatus: any = await prisma.orderStatus.create({
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
    return newStatus
  }
}

export const acceptOrderOutletService = async ({ email, orderId, userId }: IAcceptOrderOutlet) => {
  const findWorker = await prisma.worker.findFirst({
    where: { email }
  });

  if (!findWorker) throw { msg: "Driver tidak tersedia", status: 404 };


  const order = await prisma.order.findFirst({
    where: { id: orderId },
    include: { orderStatus: true },
  });

  if (!order) throw { msg: "Order tidak ditemukan", status: 404 };


  const existingStatus = order.orderStatus.find((status) => status.status === "DRIVER_ARRIVED_AT_OUTLET");
  if (existingStatus) throw { msg: "Order sudah diterima sebelumnya", status: 400 }

  if (order.orderStatus.some((status) => status.status === "DRIVER_TO_OUTLET")) {
    const newStatus: any = await prisma.orderStatus.create({
      data: {
        orderId: order.id,
        status: "DRIVER_ARRIVED_AT_OUTLET",
        createdAt: new Date(),
        workerId: userId
      },
    });

    await prisma.order.update({
      where: { id: order.id },
      data: { updatedAt: new Date() }
    });

    return newStatus;
  }
};

export const getOrderNoteDetailService = async ({ id, userId, authorizationRole, storeId }: IGetOrderNoteDetail) => {
  const worker = await prisma.worker.findFirst({
    where: {
      id: userId,
      workerRole: authorizationRole as Prisma.EnumRoleFilter<"Worker">,
      storeId: storeId
    }
  });

  if (!worker) throw { msg: "Data worker tidak tersedia", status: 404, }

  const order = await prisma.order.findMany({
    where: {
      id,
      storeId,
    },
    include: {
      User: true,
      UserAddress: true,
      OrderType: true,
    },
  });

  if (!order || order.length === 0) throw { msg: 'Order tidak ditemukan', status: 404 }

  return { order };
};

export const getOrderItemDetailService = async (orderId: string) => {
  const listItem = await prisma.orderDetail.findMany({
    where: {
      orderId,
    },
  });

  const DetailListItem = listItem.map(item => ({
    laundryItemId: item.laundryItemId,
    quantity: item.quantity,
  }));

  return DetailListItem;
};

export const getOrdersForWashingService = async ({
  userId,
  authorizationRole,
  storeId,
  page,
  limit_data,
  search,
  sort,
  tab,
  dateFrom,
  dateUntil
}: {
  userId: string,
  authorizationRole: Role,
  storeId: string,
  page: string,
  limit_data: string,
  search: string,
  sort: string,
  tab: string,
  dateFrom?: string,
  dateUntil?: string
}) => {
  const offset = parseInt(limit_data) * (parseInt(page) - 1)

  const worker = await prisma.worker.findUnique({
    where: {
      id: userId,
      workerRole: authorizationRole,
    },
    select: { storeId: true },
  });

  if (!worker) throw { msg: "Driver tidak tersedia", status: 404 };

  const statusFilter: any = tab ? [tab] : ['AWAITING_PAYMENT', 'IN_WASHING_PROCESS', 'IN_IRONING_PROCESS'];

  const parsedDateFrom = dateFrom ? new Date(dateFrom) : undefined;
  const parsedDateUntil = dateUntil ? new Date(dateUntil) : undefined;

  const whereConditions: Prisma.OrderWhereInput = {
    storeId,
    orderStatus: {
      some: { status: { in: statusFilter } },
    },
    AND: [
      search
        ? {
          OR: [
            { id: { contains: search } },
            { User: { firstName: { contains: search } } },
            { User: { lastName: { contains: search } } },
            { User: { phoneNumber: { contains: search } } },
          ],
        }
        : {},
      parsedDateFrom ? { createdAt: { gte: parsedDateFrom } } : {},
      parsedDateUntil ? { createdAt: { lte: parsedDateUntil } } : {}
    ].filter((condition) => Object.keys(condition).length > 0),
  };

  let orderBy: Prisma.OrderOrderByWithRelationInput;
  if (sort === 'date-asc') {
    orderBy = { createdAt: 'asc' };
  } else if (sort === 'date-desc') {
    orderBy = { createdAt: 'desc' };
  } else if (sort === 'name-asc') {
    orderBy = {
      User: {
        firstName: 'asc',
      },
    };
  } else if (sort === 'name-desc') {
    orderBy = {
      User: {
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
      User: true,
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
    return statusFilter.includes(latestStatus) && latestStatus !== 'PAYMENT_DONE';
  });

  const paginatedOrders = filteredOrders.slice(offset, offset + parseInt(limit_data));

  const totalCount = filteredOrders.length;
  const totalPage = Math.ceil(totalCount / parseInt(limit_data));

  return {
    totalPage,
    orders: paginatedOrders,
  };
};

export const getOrdersForIroningService = async ({
  userId,
  authorizationRole,
  storeId,
  page,
  limit_data,
  search,
  sort,
  tab,
  dateFrom,
  dateUntil
}: {
  userId: string,
  authorizationRole: Role,
  storeId: string,
  page: string,
  limit_data: string,
  search: string,
  sort: string,
  tab: string,
  dateFrom?: string,
  dateUntil?: string
}) => {
  const offset = Number(limit_data) * (Number(page) - 1);

  const worker = await prisma.worker.findUnique({
    where: {
      id: userId,
      workerRole: authorizationRole,
    },
    select: { storeId: true },
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
  const parsedDateFrom = dateFrom ? new Date(dateFrom as string) : undefined;
  const parsedDateUntil = dateUntil ? new Date(dateUntil as string) : undefined;

  const whereConditions: Prisma.OrderWhereInput = {
    storeId,
    orderStatus: {
      some: { status: { in: statusFilter } },
    },
    AND: [
      search
        ? {
          OR: [
            { id: { contains: search as string } },
            { User: { firstName: { contains: search as string } } },
            { User: { lastName: { contains: search as string } } },
            { User: { phoneNumber: { contains: search as string } } },
          ],
        }
        : {},
      ...(tab === 'belumDisetrika' ? [{ isProcessed: false }] : []),
      ...(tab === 'prosesSetrika' ? [{ isProcessed: true }] : []),
      parsedDateFrom ? { createdAt: { gte: parsedDateFrom } } : {},
      parsedDateUntil ? { createdAt: { lte: parsedDateUntil } } : {},
    ].filter((condition) => Object.keys(condition).length > 0),
  };


  let orderBy: Prisma.OrderOrderByWithRelationInput;
  if (sort === 'date-asc') {
    orderBy = { createdAt: 'asc' };
  } else if (sort === 'date-desc') {
    orderBy = { createdAt: 'desc' };
  } else if (sort === 'name-asc') {
    orderBy = {
      User: {
        firstName: 'asc',
      },
    };
  } else if (sort === 'name-desc') {
    orderBy = {
      User: {
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
      User: true,
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

  return {
    totalPage,
    orders: paginatedOrders,
  };
}

export const createOrderService = async ({
  orderId,
  email,
  userId,
  totalWeight,
  totalPrice,
  items
}: ICreateOrder) => {
  const findWorker = await prisma.worker.findFirst({
    where: { email }
  });
  if (!findWorker) throw { msg: "worker tidak tersedia", status: 404 };

  const updatedOrder = await prisma.order.update({
    where: { id: String(orderId) },
    data: {
      totalWeight,
      totalPrice,
      isProcessed: true,
      isSolved: true,
    },
  });

  if (items.length === 0) throw { msg: 'Item wajib diisi', status: 400 };

  const dataItems = items.map((item: any) => ({
    orderId: String(orderId),
    laundryItemId: Number(item.itemName),
    quantity: item.quantity,
  }));

  await prisma.orderDetail.createMany({
    data: dataItems,
  });

  const orderStatus = await prisma.orderStatus.create({
    data: {
      status: 'AWAITING_PAYMENT',
      orderId: String(orderId),
      workerId: userId,
    },
  });

  return { updatedOrder, dataItems, orderStatus };
};

export const washingProcessDoneService = async ({ orderId, email, userId }: IWashingProcessDone) => {

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
    },
  });

  if (!orderStatus) throw { msg: "data order status gagal dibuat", status: 404 }

  return { orderStatus }
}

export const ironingProcessDoneService = async ({ orderId, email, userId }: IIroningProcessDone) => {
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

  return { orderStatus }
}


export const getOrdersForPackingService = async ({
  userId,
  authorizationRole,
  storeId,
  page,
  limit_data,
  search,
  sort,
  tab,
  dateFrom,
  dateUntil
}: {
  userId: string,
  authorizationRole: Role,
  storeId: string,
  page: string,
  limit_data: string,
  search: string,
  sort: string,
  tab: string,
  dateFrom?: string,
  dateUntil?: string
}) => {
  const offset = Number(limit_data) * (Number(page) - 1);

  const worker = await prisma.worker.findUnique({
    where: {
      id: userId,
      workerRole: authorizationRole,
    },
    select: { storeId: true },
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

  const parsedDateFrom = dateFrom ? new Date(dateFrom as string) : undefined;
  const parsedDateUntil = dateUntil ? new Date(dateUntil as string) : undefined;

  const whereConditions: Prisma.OrderWhereInput = {
    storeId,
    orderStatus: {
      some: { status: { in: statusFilter } },
    },
    AND: [
      search
        ? {
          OR: [
            { id: { contains: search as string } },
            { User: { firstName: { contains: search as string } } },
            { User: { lastName: { contains: search as string } } },
            { User: { phoneNumber: { contains: search as string } } },
          ],
        }
        : {},
      ...(tab === 'belumDipacking' ? [{ isProcessed: false }] : []),
      ...(tab === 'prosesPacking' ? [{ isProcessed: true }] : []),
      ...(tab === 'selesai' ? [{ isDone: true }] : []),
      parsedDateFrom ? { createdAt: { gte: parsedDateFrom } } : {},
      parsedDateUntil ? { createdAt: { lte: parsedDateUntil } } : {},
    ].filter((condition) => Object.keys(condition).length > 0),
  };


  let orderBy: Prisma.OrderOrderByWithRelationInput;
  if (sort === 'date-asc') {
    orderBy = { createdAt: 'asc' };
  } else if (sort === 'date-desc') {
    orderBy = { createdAt: 'desc' };
  } else if (sort === 'name-asc') {
    orderBy = {
      User: {
        firstName: 'asc',
      },
    };
  } else if (sort === 'name-desc') {
    orderBy = {
      User: {
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
      User: true,
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

  return {
    totalPage,
    orders: paginatedOrders,
  };
}


export const getPackingHistoryService = async ({ userId, authorizationRole, storeId, limit_data, page, search, dateFrom, dateUntil, sort }: IGetPackingHistory) => {
  const worker = await prisma.worker.findFirst({
    where: {
      id: userId,
      workerRole: authorizationRole,
      storeId: storeId
    }
  });


  if (!worker) throw { msg: "Data worker tidak tersedia", status: 404 }


  const offset = Number(limit_data) * (Number(page) - 1);

  const statusFilter: Status[] = [Status.IN_PACKING_PROCESS];

  const whereConditions: any = {
    storeId,
    isDone: 1,
    orderStatus: {
      some: {
        status: {
          in: statusFilter,
        },
      },
    },
    AND: [
      search
        ? {
          OR: [
            { id: { contains: search as string, mode: 'insensitive' } },
            { User: { firstName: { contains: search as string, mode: 'insensitive' } } },
            { User: { lastName: { contains: search as string, mode: 'insensitive' } } },
            { User: { phoneNumber: { contains: search as string, mode: 'insensitive' } } },
          ],
        }
        : {},
      dateFrom && dateUntil
        ? { createdAt: { gte: new Date(dateFrom as string), lte: new Date(dateUntil as string) } }
        : dateFrom
          ? { createdAt: { gte: new Date(dateFrom as string) } }
          : dateUntil
            ? { createdAt: { lte: new Date(dateUntil as string) } }
            : {},
    ],
  };

  let orderBy: any;
  if (sort === 'date-asc') {
    orderBy = { createdAt: 'asc' };
  } else if (sort === 'date-desc') {
    orderBy = { createdAt: 'desc' };
  } else if (sort === 'name-asc') {
    orderBy = {
      User: {
        firstName: 'asc',
      },
    };
  } else if (sort === 'name-desc') {
    orderBy = {
      User: {
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
    include: {
      orderStatus: {
        where: {
          status: { in: statusFilter },
        },
        orderBy: { createdAt: 'desc' },
        take: 1,
      },
      User: true,
    },
    skip: offset,
    take: Number(limit_data),
    orderBy,
  });


  const totalCount = await prisma.order.count({
    where: whereConditions,
  });

  const totalPage = Math.ceil(totalCount / Number(limit_data));

  return { totalPage, orders }
}

export const getIroningHistoryService = async ({ userId, authorizationRole, storeId, limit_data, page, search, dateFrom, dateUntil, sort }: IGetIroningHistory) => {
  const worker = await prisma.worker.findFirst({
    where: {
      id: userId,
      workerRole: authorizationRole,
      storeId: storeId
    }
  });

  if (!worker) throw { msg: "Data worker tidak tersedia", status: 404 }
  const offset = Number(limit_data) * (Number(page) - 1);
  const statusFilter: Status[] = [Status.IN_IRONING_PROCESS, Status.IN_PACKING_PROCESS];

  const whereConditions: any = {
    storeId,
    isDone: 0,
    orderStatus: {
      some: {
        status: {
          in: statusFilter,
        },
      },
    },
    AND: [
      search
        ? {
          OR: [
            { id: { contains: search as string, mode: 'insensitive' } },
            { User: { firstName: { contains: search as string, mode: 'insensitive' } } },
            { User: { lastName: { contains: search as string, mode: 'insensitive' } } },
            { User: { phoneNumber: { contains: search as string, mode: 'insensitive' } } },
          ],
        }
        : {},
      dateFrom && dateUntil
        ? { createdAt: { gte: new Date(dateFrom as string), lte: new Date(dateUntil as string) } }
        : dateFrom
          ? { createdAt: { gte: new Date(dateFrom as string) } }
          : dateUntil
            ? { createdAt: { lte: new Date(dateUntil as string) } }
            : {},
    ],
  };

  let orderBy: any;
  if (sort === 'date-asc') {
    orderBy = { createdAt: 'asc' };
  } else if (sort === 'date-desc') {
    orderBy = { createdAt: 'desc' };
  } else if (sort === 'name-asc') {
    orderBy = {
      User: {
        firstName: 'asc',
      },
    };
  } else if (sort === 'name-desc') {
    orderBy = {
      User: {
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
    include: {
      orderStatus: {
        where: {
          status: { in: statusFilter },
        },
        orderBy: { createdAt: 'desc' },
        take: 1,
      },
      User: true,
    },
    skip: offset,
    take: Number(limit_data),
    orderBy,
  });


  const totalCount = await prisma.order.count({
    where: whereConditions,
  });

  const totalPage = Math.ceil(totalCount / Number(limit_data));

  return { totalPage, orders }
}

export const getWashingHistoryService = async ({ userId, authorizationRole, storeId, limit_data, page, search, dateFrom, dateUntil, sort }: IGetWashingHistory) => {
  const worker = await prisma.worker.findFirst({
    where: {
      id: userId,
      workerRole: authorizationRole,
      storeId: storeId
    }
  });


  if (!worker) throw { msg: "Data worker tidak tersedia", status: 404 }


  const offset = Number(limit_data) * (Number(page) - 1);

  const statusFilter: Status[] = [Status.IN_WASHING_PROCESS, Status.IN_IRONING_PROCESS];

  const whereConditions: any = {
    storeId,
    orderStatus: {
      some: {
        status: {
          in: statusFilter,
        },
      },
    },
    AND: [
      search
        ? {
          OR: [
            { id: { contains: search as string, mode: 'insensitive' } },
            { User: { firstName: { contains: search as string, mode: 'insensitive' } } },
            { User: { lastName: { contains: search as string, mode: 'insensitive' } } },
            { User: { phoneNumber: { contains: search as string, mode: 'insensitive' } } },
          ],
        }
        : {},
      dateFrom && dateUntil
        ? { createdAt: { gte: new Date(dateFrom as string), lte: new Date(dateUntil as string) } }
        : dateFrom
          ? { createdAt: { gte: new Date(dateFrom as string) } }
          : dateUntil
            ? { createdAt: { lte: new Date(dateUntil as string) } }
            : {},
    ],
  };

  let orderBy: any;
  if (sort === 'date-asc') {
    orderBy = { createdAt: 'asc' };
  } else if (sort === 'date-desc') {
    orderBy = { createdAt: 'desc' };
  } else if (sort === 'name-asc') {
    orderBy = {
      User: {
        firstName: 'asc',
      },
    };
  } else if (sort === 'name-desc') {
    orderBy = {
      User: {
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
    include: {
      orderStatus: {
        where: {
          status: { in: statusFilter },
        },
        orderBy: { createdAt: 'desc' },
        take: 1,
      },
      User: true,
    },
    skip: offset,
    take: Number(limit_data),
    orderBy,
  });


  const totalCount = await prisma.order.count({
    where: whereConditions,
  });

  const totalPage = Math.ceil(totalCount / Number(limit_data));

  return { totalPage, orders }
}

export const getNotesService = async ({ userId, authorizationRole, tab, limit_data, page, search, dateFrom, dateUntil, sort }: IGetNotes) => {
  const worker = await prisma.worker.findUnique({
    where: {
      id: userId,
      workerRole: authorizationRole,
    },
    select: { storeId: true },
  });

  if (!worker) throw { msg: "Worker tidak tersedia", status: 404 };

  const offset = Number(limit_data) * (Number(page) - 1);

  const parsedDateFrom = dateFrom ? new Date(dateFrom as string) : undefined;
  console.log(parsedDateFrom)
  const parsedDateUntil = dateUntil ? new Date(dateUntil as string) : undefined;
  console.log(parsedDateUntil)

  let tabFilter: Prisma.OrderWhereInput = {};
  if (tab === 'bermasalah') {
    tabFilter = { isSolved: false, notes: { not: null } };
  } else if (tab === 'selesai') {
    tabFilter = { isSolved: true, notes: { not: null } };
  }

  const whereConditions: Prisma.OrderWhereInput = {
    storeId: worker.storeId,
    AND: [
      search
        ? {
          OR: [
            { id: { contains: search as string, mode: 'insensitive' } },
            { User: { firstName: { contains: search as string, mode: 'insensitive' } } },
            { User: { lastName: { contains: search as string, mode: 'insensitive' } } },
            { User: { phoneNumber: { contains: search as string, mode: 'insensitive' } } },
          ],
        }
        : {},
      tabFilter,
      parsedDateFrom ? { createdAt: { gte: parsedDateFrom } } : {},
      parsedDateUntil ? { createdAt: { lte: parsedDateUntil } } : {}
    ].filter((condition) => Object.keys(condition).length > 0),
  };

  let orderBy: Prisma.OrderOrderByWithRelationInput;
  if (sort === 'date-asc') {
    orderBy = { createdAt: 'asc' };
  } else if (sort === 'date-desc') {
    orderBy = { createdAt: 'desc' };
  } else if (sort === 'name-asc') {
    orderBy = { User: { firstName: 'asc' } };
  } else if (sort === 'name-desc') {
    orderBy = { User: { firstName: 'desc' } };
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
    skip: offset,
    take: Number(limit_data),
    include: {
      User: true,
      UserAddress: true,
      orderStatus: {
        orderBy: { createdAt: 'desc' },
        take: 1,
      },
    },
  });

  const totalCount = await prisma.order.count({ where: whereConditions });
  const totalPage = Math.ceil(totalCount / Number(limit_data));

  return { totalPage, orders }
}

export const packingProcessDoneService = async ({ email, orderId }: { email: string, orderId: string }) => {
  const findWorker = await prisma.worker.findFirst({ where: { email } })
  if (!findWorker) throw { msg: "worker tidak tersedia", status: 404 }

  const order = await prisma.order.update({
    where: {
      id: String(orderId),
    },
    data: {
      isProcessed: false,
      isDone: true
    },
  })

  return { order }
}

export const packingProcessService = async ({ email, orderId, userId }: { email: string, orderId: string, userId: string }) => {
  const findWorker = await prisma.worker.findFirst({ where: { email } })
  if (!findWorker) throw { msg: "Pekerja tidak tersedia", status: 404 }

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
  })
}