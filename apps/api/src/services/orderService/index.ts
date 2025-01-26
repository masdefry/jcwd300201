import prisma from "@/connection"
import cron from 'node-cron'
import dotenv from 'dotenv'
import { IWashingProcessDone, ICreateOrder, IAcceptOrderOutlet, IAcceptOrder, IFindNearestStore, IRequestPickup, IGetUserOrder, IGetOrderForDriver, IGetOrderNoteDetail, IGetPackingHistory, IGetIroningHistory, IGetWashingHistory, IGetNotes, IIroningProcessDone, IStatusOrder, IGeDriverHistory, IPaymentOrder, IPaymentOrderTf, IOrderTrackingAdminParams, IOrderTrackingUser, ISolveNotesInput, IOrderTrackingDriverParams } from "./types"
import { Prisma, Role, Status, Payment, Order, OrderStatus, } from "@prisma/client"
import { addHours, addMinutes, isBefore } from "date-fns"
import { formatOrder } from "@/utils/formatOrder"
import snap from "@/utils/midtrans"


dotenv.config()
const excludedStatuses = [Status.PAYMENT_DONE];
const excludedStatusesOrder = [Status.PAYMENT_DONE, Status.AWAITING_PAYMENT];

export const requestPickUpService = async ({ userId, deliveryFee, outletId, orderTypeId, userAddressId }: IRequestPickup) => {
  const findUser = await prisma.user.findFirst({ where: { id: userId } })

  if (!findUser) throw { msg: 'User tidak ditemukan', status: 404 }
  const { orderId } = formatOrder()

  const newOrder: Order = await prisma.order.create({
    data: {
      id: orderId,
      laundryPrice: null,
      deliveryFee,
      storeId: outletId,
      userId,
      orderTypeId: parseInt(orderTypeId),
      userAddressId,
      isPaid: false,
      isConfirm: false,
      isComplain: false
    },
  });

  await prisma.orderStatus.create({
    data: {
      status: "AWAITING_DRIVER_PICKUP",
      orderId: newOrder.id
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
        id: Number(address),
      },
    });
  } else {
    userAddress = await prisma.userAddress.findFirst({
      where: {
        userId: userId,
        isMain: true,
      },
    });
  }

  if (!userAddress) throw { msg: 'Alamat utama tidak ditemukan', status: 404 };

  const { latitude: userLatitude, longitude: userLongitude } = userAddress;

  const nearestStores = await prisma.$queryRaw<{
    id: number;
    storeName: string;
    address: string;
    city: string;
    province: string;
    country: string;
    latitude: number;
    longitude: number;
    distance: number;
  }>`
    SELECT 
      id, 
      "storeName", 
      address, 
      city, 
      province, 
      country, 
      latitude, 
      longitude,
      ( 
        6371000 * acos( 
          cos(radians(${userLatitude})) * cos(radians(latitude)) * 
          cos(radians(longitude) - radians(${userLongitude})) + 
          sin(radians(${userLatitude})) * sin(radians(latitude))
        ) 
      )/1000 AS distance
    FROM public.stores
    WHERE 
          "deletedAt" IS NULL AND -- Exclude deleted stores
    ( 
      6371000 * acos( 
        cos(radians(${userLatitude})) * cos(radians(latitude)) * 
        cos(radians(longitude) - radians(${userLongitude})) + 
        sin(radians(${userLatitude})) * sin(radians(latitude))
      ) 
    )/1000 <= 5 -- within 5 km
    ORDER BY distance ASC
    LIMIT 1;
  `;

  return { nearestStores }
}

export const getUserOrderService = async ({ userId, limit_data, page, search, dateUntil, dateFrom, sort }: IGetUserOrder) => {
  const offset = Number(limit_data) * (Number(page) - 1);

  const whereConditions: Prisma.OrderWhereInput = {
    userId: userId,
    AND: [
      search
        ? {
          OR: [
            { id: { contains: search as string, mode: 'insensitive' as Prisma.QueryMode } },
            { User: { firstName: { contains: search as string, mode: 'insensitive' as Prisma.QueryMode } } },
            { User: { lastName: { contains: search as string, mode: 'insensitive' as Prisma.QueryMode } } },
            { User: { phoneNumber: { contains: search as string, mode: 'insensitive' as Prisma.QueryMode } } }
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

  let orderBy: Prisma.OrderOrderByWithRelationInput = {}
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
      User: {
        select: {
          firstName: true,
          lastName: true,
          phoneNumber: true
        }
      },
      OrderType: true,
      UserAddress: {
        select: {
          longitude: true,
          latitude: true
        }
      },
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

  const statusFilter: Status[] =
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
      some: {
        status: { in: statusFilter },
        ...(tab === "DRIVER_TO_OUTLET" || tab === "DRIVER_ARRIVED_AT_OUTLET"
          ? { workerId: userId }
          : {}),
      },
    },

    AND: [
      search
        ? {
          OR: [
            { id: { contains: search as string, mode: 'insensitive' as Prisma.QueryMode } },
            { User: { firstName: { contains: search as string, mode: 'insensitive' as Prisma.QueryMode } } },
            { User: { lastName: { contains: search as string, mode: 'insensitive' as Prisma.QueryMode } } },
            { User: { phoneNumber: { contains: search as string, mode: 'insensitive' as Prisma.QueryMode } } },
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
      User: {
        select: {
          firstName: true,
          lastName: true,
          phoneNumber: true
        }
      },
      UserAddress: {
        select: {
          longitude: true,
          latitude: true
        }
      },
      orderStatus: {
        orderBy: { createdAt: 'desc' },
        take: 1,
      },
      OrderType: {
        select: {
          type: true,
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

  if (!findWorker) throw { msg: "Driver tidak tersedia", status: 404 }

  const order = await prisma.order.findFirst({
    where: { id: orderId },
    include: { orderStatus: true },
  });

  if (!order) throw { msg: "Order tidak ditemukan", status: 404 };


  const existingStatus = order.orderStatus.find((status) => status.status === "DRIVER_TO_OUTLET");
  if (existingStatus) throw { msg: "Order sudah diproses oleh driver lain", status: 404 };


  if (order.orderStatus.some((status) => status.status === "AWAITING_DRIVER_PICKUP")) {
    const newStatus: OrderStatus = await prisma.orderStatus.create({
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
    return { newStatus }
  }
  throw { msg: "Order status tidak valid", status: 400 }; // Return error if not found
};



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
  if (existingStatus) throw { msg: "Order sudah diproses oleh driver lain", status: 400 }


  const driverToOutletStatus = order.orderStatus.find(
    (status) => status.status === "DRIVER_TO_OUTLET"
  );

  if (driverToOutletStatus) {
    if (driverToOutletStatus.workerId !== userId) {
      throw { msg: "Order sedang diproses oleh driver lain", status: 400 };
    }
    const newStatus: OrderStatus = await prisma.orderStatus.create({
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

    return { newStatus };
  }
  throw { msg: "Order status tidak valid", status: 400 }; // Return error if not found
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
      User: {
        select: {
          firstName: true,
          lastName: true,
          phoneNumber: true
        }
      },
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

  const detailListItem = listItem.map(item => ({
    laundryItemId: item.laundryItemId,
    quantity: item.quantity,
  }));

  return { detailListItem };
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

  let statusFilter: Status[];
  if (tab === "not-washed") {
    statusFilter = ['AWAITING_PAYMENT'];
  } else if (tab === "in-washing") {
    statusFilter = ['IN_WASHING_PROCESS'];
  } else if (tab === "done") {
    statusFilter = ['IN_IRONING_PROCESS'];
  } else if (tab === "all") {
    statusFilter = ['AWAITING_PAYMENT', 'IN_WASHING_PROCESS', 'IN_IRONING_PROCESS'];
  } else if (tab) {
    statusFilter = [tab as Status];
  } else {
    statusFilter = ['AWAITING_PAYMENT', 'IN_WASHING_PROCESS', 'IN_IRONING_PROCESS'];
  }

  const parsedDateFrom = dateFrom ? new Date(dateFrom) : undefined;
  const parsedDateUntil = dateUntil ? new Date(dateUntil) : undefined;

  const whereConditions: Prisma.OrderWhereInput = {
    storeId,
    orderTypeId: { in: [1, 3] },
    orderStatus: {
      some: {
        status: { in: statusFilter },
        ...(tab === 'IN_WASHING_PROCESS'
          ? { workerId: userId }
          : {}),
      },
    },
    AND: [
      search
        ? {
          OR: [
            { id: { contains: search, mode: 'insensitive' as Prisma.QueryMode } },
            { User: { firstName: { contains: search as string, mode: 'insensitive' as Prisma.QueryMode } } },
            { User: { lastName: { contains: search as string, mode: 'insensitive' as Prisma.QueryMode } } },
            { User: { phoneNumber: { contains: search as string, mode: 'insensitive' as Prisma.QueryMode } } },
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
      User: {
        select: {
          firstName: true,
          lastName: true,
          phoneNumber: true
        }
      },
      UserAddress: {
        select: {
          longitude: true,
          latitude: true
        }
      },
      orderStatus: {
        where: {
          status: {
            notIn: excludedStatuses,
          },
        },
        orderBy: { createdAt: 'desc' },
        take: 1,
      },
      OrderType: true
    },
  });

  const filteredOrders = orders.filter(order => {
    const latestStatus = order.orderStatus[0]?.status;
    return statusFilter.includes(latestStatus)
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

  let statusFilter: Status[];
  if (tab === "proses-setrika") {
    statusFilter = ['IN_IRONING_PROCESS'];
  } else if (tab === "belum-disetrika") {
    statusFilter = ['AWAITING_PAYMENT', 'IN_IRONING_PROCESS'];
  } else if (tab === "done") {
    statusFilter = ['IN_PACKING_PROCESS'];
  } else if (tab === "all") {
    statusFilter = ['AWAITING_PAYMENT', 'IN_IRONING_PROCESS', 'IN_PACKING_PROCESS'];
  } else if (tab) {
    statusFilter = [tab as Status];
  } else {
    statusFilter = ['AWAITING_PAYMENT', 'IN_IRONING_PROCESS', 'IN_PACKING_PROCESS'];
  }
  const parsedDateFrom = dateFrom ? new Date(dateFrom as string) : undefined;
  const parsedDateUntil = dateUntil ? new Date(dateUntil as string) : undefined;

  const whereConditions: Prisma.OrderWhereInput = {
    storeId,
    orderTypeId: { in: [2, 3] },
    orderStatus: {
      some: {
        status: { in: statusFilter },
        ...(tab === 'IN_IRONING_PROCESS'
          ? { workerId: userId }
          : {}),
      },
    },
    AND: [
      search
        ? {
          OR: [
            { id: { contains: search as string, mode: 'insensitive' as Prisma.QueryMode } },
            { User: { firstName: { contains: search as string, mode: 'insensitive' as Prisma.QueryMode } } },
            { User: { lastName: { contains: search as string, mode: 'insensitive' as Prisma.QueryMode } } },
            { User: { phoneNumber: { contains: search as string, mode: 'insensitive' as Prisma.QueryMode } } },
          ],
        }
        : {},
      ...(tab === 'belum-disetrika' ? [{ isProcessed: false }] : []),
      ...(tab === 'proses-setrika' ? [{ isProcessed: true }] : []),
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
      User: {
        select: {
          firstName: true,
          lastName: true,
          phoneNumber: true
        }
      },
      UserAddress: {
        select: {
          longitude: true,
          latitude: true
        }
      },
      orderStatus: {
        where: {
          status: {
            notIn: excludedStatuses,
          },
        },
        orderBy: { createdAt: 'desc' },
        take: 1,
      },
      OrderType: {
        select: {
          type: true,
        },
      },
    },
  });

  const filteredOrders = orders.filter(order => {
    const latestStatus = order.orderStatus[0]?.status;
    return statusFilter.includes(latestStatus)

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
  laundryPrice,
  items,
}: ICreateOrder) => {
  const result = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
    const findWorker = await tx.worker.findFirst({
      where: { email },
    });
    if (!findWorker) throw { msg: "Worker tidak tersedia", status: 404 };

    const existingOrder = await tx.order.findFirst({
      where: { id: String(orderId) },
      include: {
        orderStatus: true,
        User: {
          select: {
            firstName: true,
            email: true,
            phoneNumber: true,
          },
        },
      },
    });
    if (!existingOrder) throw { msg: "Order tidak ditemukan", status: 404 };

    const totalPrice = (laundryPrice || 0) + (existingOrder.deliveryFee || 0);

    const updatedOrder = await tx.order.update({
      where: { id: String(orderId) },
      data: {
        totalWeight,
        laundryPrice,
        totalPrice,
        isProcessed: false,
        isSolved: true,
        isDone: false,
        isReqDelivery: false,
        isConfirm: false,
        isComplain: false,
        updatedAt: new Date(),
      },
    });

    if (items.length === 0) throw { msg: "Item wajib diisi", status: 400 };

    const dataItems: { orderId: string, laundryItemId: number, quantity: number }[] = items.map((item) => ({
      orderId: String(orderId),
      laundryItemId: Number(item.itemName),
      quantity: item.quantity,
    }));

    await tx.orderDetail.createMany({
      data: dataItems,
    });

    const existingStatus = existingOrder.orderStatus.find(
      (status) => status.status === "AWAITING_PAYMENT"
    );
    if (existingStatus)
      throw { msg: "Order sudah diproses oleh outlet admin lain", status: 404 };

    const orderStatus = await tx.orderStatus.create({
      data: {
        status: "AWAITING_PAYMENT",
        orderId: String(orderId),
        workerId: userId,
        createdAt: new Date(),
      },
    });

    return { updatedOrder, dataItems, orderStatus };
  });

  return result;
};

export const washingProcessDoneService = async ({ orderId, email, userId }: IWashingProcessDone) => {
  const result = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
    const findWorker = await tx.worker.findFirst({
      where: { email },
    });

    if (!findWorker) throw { msg: "Worker tidak tersedia", status: 404 };

    const order = await tx.order.findUnique({
      where: { id: String(orderId) },
      select: { orderTypeId: true },
    });

    if (!order) throw { msg: "Order tidak ditemukan", status: 404 };

    if (order.orderTypeId === 2) {
      throw { msg: "Order dengan tipe ini tidak dapat diproses di washing process", status: 400 };
    } else if (order.orderTypeId === 1) {
      await tx.order.update({
        where: { id: String(orderId) },
        data: { isProcessed: false, updatedAt: addHours(new Date(), 7) },
      });

      const orderStatus = await tx.orderStatus.create({
        data: {
          status: 'IN_PACKING_PROCESS',
          orderId: String(orderId),
          createdAt: new Date(),
        },
      });

      if (!orderStatus) throw { msg: "Data order status gagal dibuat", status: 404 };

      return { orderStatus };

    } else if (order.orderTypeId === 3) {
      await tx.order.update({
        where: { id: String(orderId) },
        data: { isProcessed: false, updatedAt: new Date() },
      });

      const orderStatus = await tx.orderStatus.create({
        data: {
          status: 'IN_IRONING_PROCESS',
          orderId: String(orderId),
          createdAt: new Date(),
        },
      });

      if (!orderStatus) throw { msg: "Data order status gagal dibuat", status: 404 };

      return { orderStatus };
    } else {
      throw { msg: "Tipe order tidak dikenal", status: 400 };
    }
  });

  return result;
};

export const ironingProcessDoneService = async ({ orderId, email, userId }: IIroningProcessDone) => {
  const result = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
    const findWorker = await tx.worker.findFirst({
      where: { email },
    });

    if (!findWorker) throw { msg: "Worker tidak tersedia", status: 404 };

    const order = await tx.order.findUnique({
      where: { id: String(orderId) },
      select: { orderTypeId: true },
    });

    if (!order) throw { msg: "Order tidak ditemukan", status: 404 };

    if (order.orderTypeId === 1) {
      throw { msg: "Order dengan tipe ini tidak dapat diproses di ironing process", status: 400 };
    } else if (order.orderTypeId === 2 || order.orderTypeId === 3) {
      await tx.order.update({
        where: { id: String(orderId) },
        data: { isProcessed: false },
      });

      const orderStatus = await tx.orderStatus.create({
        data: {
          status: 'IN_PACKING_PROCESS',
          orderId: String(orderId),
          createdAt: new Date(),
        },
      });

      if (!orderStatus) throw { msg: "Data order status gagal dibuat", status: 404 };

      return { orderStatus };
    } else {
      throw { msg: "Tipe order tidak dikenal", status: 400 };
    }
  });

  return result;
};

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

  let statusFilter: Status[];
  if (tab === "packing-process") {
    statusFilter = ['IN_PACKING_PROCESS'];
  } else if (tab === "not-packed-yet") {
    statusFilter = ['IN_PACKING_PROCESS'];
  } else if (tab === "done") {
    statusFilter = ['IN_PACKING_PROCESS'];
  } else if (tab === "all") {
    statusFilter = ['IN_PACKING_PROCESS'];
  } else if (tab) {
    statusFilter = [tab as Status];
  } else {
    statusFilter = ['IN_PACKING_PROCESS'];
  }

  const parsedDateFrom = dateFrom ? new Date(dateFrom as string) : undefined;
  const parsedDateUntil = dateUntil ? new Date(dateUntil as string) : undefined;

  const whereConditions: Prisma.OrderWhereInput = {
    storeId,
    orderStatus: {
      some: {
        status: { in: statusFilter },
        ...(tab === 'packing-process' ? { workerId: userId } : {}),
      },
    },
    AND: [
      search
        ? {
          OR: [
            { id: { contains: search as string, mode: 'insensitive' as Prisma.QueryMode } },
            { User: { firstName: { contains: search as string, mode: 'insensitive' as Prisma.QueryMode } } },
            { User: { lastName: { contains: search as string, mode: 'insensitive' as Prisma.QueryMode } } },
            { User: { phoneNumber: { contains: search as string, mode: 'insensitive' as Prisma.QueryMode } } },
          ],
        }
        : {},
      ...(tab === 'not-packed-yet' ? [{ isProcessed: false }, { isDone: false }] : []),
      ...(tab === 'packing-process' ? [{ isProcessed: true }] : []),
      ...(tab === 'done' ? [{ isDone: true }, { isProcessed: false }] : []),
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
      User: {
        select: {
          firstName: true,
          lastName: true,
          phoneNumber: true
        }
      },
      UserAddress: {
        select: {
          longitude: true,
          latitude: true
        }
      },
      orderStatus: {
        where: {
          status: {
            notIn: excludedStatuses,
          },
        },
        orderBy: { createdAt: 'desc' },
        take: 1,
      },
      OrderType: {
        select: {
          type: true,
        },
      },
    },
  });

  const filteredOrders = orders.filter(order => {
    const latestStatus = order.orderStatus[0]?.status;
    return statusFilter.includes(latestStatus)

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

  const whereConditions: Prisma.OrderWhereInput = {
    storeId,
    isDone: true,
    orderStatus: {
      some: {
        status: {
          in: statusFilter,
        },
        workerId: userId,
      },
    },
    AND: [
      search
        ? {
          OR: [
            { id: { contains: search as string, mode: 'insensitive' as Prisma.QueryMode } },
            { User: { firstName: { contains: search as string, mode: 'insensitive' as Prisma.QueryMode } } },
            { User: { lastName: { contains: search as string, mode: 'insensitive' as Prisma.QueryMode } } },
            { User: { phoneNumber: { contains: search as string, mode: 'insensitive' as Prisma.QueryMode } } },
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
    include: {
      orderStatus: {
        where: {
          status: { in: statusFilter },
          workerId: userId,
        },
        orderBy: { createdAt: 'desc' },
        take: 1,
      },
      User: {
        select: {
          firstName: true,
          lastName: true,
          phoneNumber: true
        }
      },
      OrderType: true
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
  const statusFilter: Status[] = [Status.IN_PACKING_PROCESS, Status.IN_IRONING_PROCESS];

  const whereConditions: Prisma.OrderWhereInput = {
    storeId,
    orderStatus: {
      some: {
        status: {
          in: statusFilter,
        },
        workerId: userId,
      },
    },
    AND: [
      search
        ? {
          OR: [
            { id: { contains: search as string, mode: 'insensitive' as Prisma.QueryMode } },
            { User: { firstName: { contains: search as string, mode: 'insensitive' as Prisma.QueryMode } } },
            { User: { lastName: { contains: search as string, mode: 'insensitive' as Prisma.QueryMode } } },
            { User: { phoneNumber: { contains: search as string, mode: 'insensitive' as Prisma.QueryMode } } },
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
    include: {
      orderStatus: {
        where: {
          status: { in: statusFilter },
          workerId: userId,
        },
        orderBy: { createdAt: 'desc' },
        take: 1,
      },
      User: {
        select: {
          firstName: true,
          lastName: true,
          phoneNumber: true
        }
      },
      OrderType: true
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

  const parsedDateFrom = dateFrom ? new Date(dateFrom as string) : undefined;
  const parsedDateUntil = dateUntil ? new Date(dateUntil as string) : undefined;

  const whereConditions: Prisma.OrderWhereInput = {
    storeId,
    orderStatus: {
      some: {
        status: {
          in: statusFilter,
        },
        workerId: userId,
      },
    },
    AND: [
      search
        ? {
          OR: [
            { id: { contains: search as string, mode: 'insensitive' as Prisma.QueryMode } },
            { User: { firstName: { contains: search as string, mode: 'insensitive' as Prisma.QueryMode } } },
            { User: { lastName: { contains: search as string, mode: 'insensitive' as Prisma.QueryMode } } },
            { User: { phoneNumber: { contains: search as string, mode: 'insensitive' as Prisma.QueryMode } } },
          ],
        }
        : {},
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
    include: {
      orderStatus: {
        where: {
          status: { in: statusFilter },
          workerId: userId,
        },
        orderBy: { createdAt: 'desc' },
        take: 1,
      },
      User: {
        select: {
          firstName: true,
          lastName: true,
          phoneNumber: true
        }
      },
      OrderType: true
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
  const parsedDateUntil = dateUntil ? new Date(dateUntil as string) : undefined;

  let tabFilter: Prisma.OrderWhereInput = {};
  if (tab === 'bermasalah') {
    tabFilter = { isSolved: false, notes: { not: null } };
  } else if (tab === 'done') {
    tabFilter = { isSolved: true, notes: { not: null } };
  }

  const whereConditions: Prisma.OrderWhereInput = {
    storeId: worker.storeId,
    AND: [
      search
        ? {
          OR: [
            { id: { contains: search as string, mode: 'insensitive' as Prisma.QueryMode } },
            { User: { firstName: { contains: search as string, mode: 'insensitive' as Prisma.QueryMode } } },
            { User: { lastName: { contains: search as string, mode: 'insensitive' as Prisma.QueryMode } } },
            { User: { phoneNumber: { contains: search as string, mode: 'insensitive' as Prisma.QueryMode } } },
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
      User: {
        select: {
          firstName: true,
          lastName: true,
          phoneNumber: true
        }
      },
      UserAddress: {
        select: {
          longitude: true,
          latitude: true
        }
      },
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

export const packingProcessDoneService = async ({ email, orderId }: { email: string; orderId: string }) => {
  const result = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
    const findWorker = await tx.worker.findFirst({
      where: { email },
    });

    if (!findWorker) throw { msg: "Worker tidak tersedia", status: 404 };

    const order = await tx.order.update({
      where: {
        id: String(orderId),
      },
      data: {
        isProcessed: false,
        isDone: true,
      },
    });

    return { order };
  });

  return result;
};

export const getCreateNoteOrderService = async ({
  userId,
  authorizationRole,
  storeId,
  limit_data,
  page,
  search,
  dateFrom,
  dateUntil,
  sort
}: IGetWashingHistory) => {
  const worker = await prisma.worker.findFirst({
    where: {
      id: userId,
      workerRole: authorizationRole,
      storeId: storeId
    }
  });

  if (!worker) throw { msg: "Data worker tidak tersedia", status: 404 };

  const offset = Number(limit_data) * (Number(page) - 1);

  const statusFilter: Status[] = [Status.DRIVER_ARRIVED_AT_OUTLET];

  const whereConditions: Prisma.OrderWhereInput = {
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
            { id: { contains: search as string, mode: 'insensitive' as Prisma.QueryMode } },
            { User: { firstName: { contains: search as string, mode: 'insensitive' as Prisma.QueryMode } } },
            { User: { lastName: { contains: search as string, mode: 'insensitive' as Prisma.QueryMode } } },
            { User: { phoneNumber: { contains: search as string, mode: 'insensitive' as Prisma.QueryMode } } },
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
    include: {
      orderStatus: {
        orderBy: { createdAt: 'desc' },
        take: 1,
      },
      User: {
        select: {
          firstName: true,
          lastName: true,
          phoneNumber: true,
        }
      },
    },
    orderBy,
  });

  const filteredOrders = orders.filter(order => {
    const latestStatus = order.orderStatus[0]?.status;
    return statusFilter.includes(latestStatus);
  });

  const paginatedOrders = filteredOrders.slice(offset, offset + Number(limit_data));

  const totalCount = filteredOrders.length;

  const totalPage = Math.ceil(totalCount / Number(limit_data));
  return {
    totalPage,
    orders: paginatedOrders,
  };
}


export const getOrdersForDeliveryService = async ({
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

  let statusFilter: Status[];
  if (tab === " ") {
    statusFilter = ['IN_PACKING_PROCESS'];
  } else if (tab === "ready-to-deliver") {
    statusFilter = ['IN_PACKING_PROCESS'];
  } else if (tab === "proses") {
    statusFilter = ['DRIVER_TO_CUSTOMER'];
  } else {
    statusFilter = ['IN_PACKING_PROCESS'];
  }

  const parsedDateFrom = dateFrom ? new Date(dateFrom as string) : undefined;
  const parsedDateUntil = dateUntil ? new Date(dateUntil as string) : undefined;

  const whereConditions: Prisma.OrderWhereInput = {
    storeId,
    orderStatus: {
      some: {
        status: { in: statusFilter },
      },
    },
    AND: [
      search
        ? {
          OR: [
            { id: { contains: search as string, mode: 'insensitive' as Prisma.QueryMode } },
            { User: { firstName: { contains: search as string, mode: 'insensitive' as Prisma.QueryMode } } },
            { User: { lastName: { contains: search as string, mode: 'insensitive' as Prisma.QueryMode } } },
            { User: { phoneNumber: { contains: search as string, mode: 'insensitive' as Prisma.QueryMode } } },
          ],
        }
        : {},
      ...(tab === 'ready-to-deliver' ? [{ isPaid: true, isProcessed: false, isDone: true, isReqDelivery: false }] : []),
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
      User: {
        select: {
          firstName: true,
          lastName: true,
          phoneNumber: true
        }
      },
      UserAddress: {
        select: {
          longitude: true,
          latitude: true
        }
      },
      orderStatus: {
        where: {
          status: {
            notIn: excludedStatuses,
          },
        },
        orderBy: { createdAt: 'desc' },
        take: 1,
      },
      OrderType: {
        select: {
          type: true,
        },
      },
    },
  });

  const filteredOrders = orders.filter(order => {
    const latestStatus = order.orderStatus[0]?.status;
    return statusFilter.includes(latestStatus)

  });

  const paginatedOrders = filteredOrders.slice(offset, offset + Number(limit_data));

  const totalCount = filteredOrders.length;

  const totalPage = Math.ceil(totalCount / Number(limit_data));

  return {
    totalPage,
    orders: paginatedOrders,
  };
}

export const requestDeliveryDoneService = async ({ orderId, email, userId }: IIroningProcessDone) => {
  const findWorker = await prisma.worker.findFirst({
    where: { email }
  })
  if (!findWorker) throw { msg: "worker tidak tersedia", status: 404 }

  const order = await prisma.order.update({
    where: {
      id: String(orderId),
    },
    data: {
      isReqDelivery: true
    },
  });

  return { order }
}


export const getOrdersForDriverDeliveryService = async ({
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

  let statusFilter: Status[];
  if (tab === "waiting-driver") {
    statusFilter = ['IN_PACKING_PROCESS'];
  } else if (tab === "proses") {
    statusFilter = ['DRIVER_TO_CUSTOMER'];
  } else if (tab === "terkirim") {
    statusFilter = ['DRIVER_DELIVERED_LAUNDRY'];
  } else if (tab === "all") {
    statusFilter = ['IN_PACKING_PROCESS', 'DRIVER_TO_CUSTOMER', 'DRIVER_DELIVERED_LAUNDRY'];
  } else if (tab) {
    statusFilter = [tab as Status];
  } else {
    statusFilter = ['IN_IRONING_PROCESS', 'IN_PACKING_PROCESS'];
  }
  const parsedDateFrom = dateFrom ? new Date(dateFrom as string) : undefined;
  const parsedDateUntil = dateUntil ? new Date(dateUntil as string) : undefined;

  const whereConditions: Prisma.OrderWhereInput = {
    storeId,
    orderStatus: {
      some: {
        status: { in: statusFilter },
        ...(tab === 'proses' || tab === 'terkirim'
          ? { workerId: userId }
          : {}),
      },
    },
    AND: [
      search
        ? {
          OR: [
            { id: { contains: search as string, mode: 'insensitive' as Prisma.QueryMode } },
            { User: { firstName: { contains: search as string, mode: 'insensitive' as Prisma.QueryMode } } },
            { User: { lastName: { contains: search as string, mode: 'insensitive' as Prisma.QueryMode } } },
            { User: { phoneNumber: { contains: search as string, mode: 'insensitive' as Prisma.QueryMode } } },
          ],
        }
        : {},
      ...(tab === 'waiting-driver' ? [{ isProcessed: false, isReqDelivery: true, isPaid: true, isDone: true }] : []),
      ...(tab === 'proses' ? [{ isProcessed: true }] : []),
      ...(tab === 'all' ? [{ isPaid: true }] : []),
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
      User: {
        select: {
          firstName: true,
          lastName: true,
          phoneNumber: true
        }
      },
      UserAddress: {
        select: {
          longitude: true,
          latitude: true
        }
      },
      orderStatus: {
        where: {
          status: {
            notIn: excludedStatuses,
          },
        },
        orderBy: { createdAt: 'desc' },
        take: 1,
      },
      OrderType: {
        select: {
          type: true,
        },
      },
    },
  });

  const filteredOrders = orders.filter(order => {
    const latestStatus = order.orderStatus[0]?.status;
    return statusFilter.includes(latestStatus)
  });

  const paginatedOrders = filteredOrders.slice(offset, offset + Number(limit_data));
  const totalCount = filteredOrders.length;
  const totalPage = Math.ceil(totalCount / Number(limit_data));

  return {
    totalPage,
    orders: paginatedOrders,
  };
}


export const processOrderDeliveryService = async ({ email, orderId, userId }: IAcceptOrder) => {
  const result = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
    const findWorker = await tx.worker.findFirst({
      where: { email },
    });
    if (!findWorker) throw { msg: "Driver tidak tersedia", status: 404 };

    const order = await tx.order.findFirst({
      where: { id: orderId },
      include: { orderStatus: true },
    });
    if (!order) throw { msg: "Order tidak ditemukan", status: 404 };

    const existingStatus = order.orderStatus.find((status) => status.status === "DRIVER_TO_CUSTOMER");
    if (existingStatus) throw { msg: "Order sudah diproses oleh driver lain", status: 404 };

    const newStatus = await tx.orderStatus.create({
      data: {
        orderId: order.id,
        status: "DRIVER_TO_CUSTOMER",
        createdAt: new Date(),
        workerId: userId,
      },
    });
    if (!newStatus) throw { msg: "Gagal membuat status order", status: 404 };

    const updatedOrder = await tx.order.update({
      where: { id: order.id },
      data: {
        updatedAt: new Date(),
        isProcessed: true,
      },
    });
    if (!updatedOrder) throw { msg: "Gagal memperbarui order", status: 404 };

    return { newStatus };
  });

  return result;
};

const cronTasks: { [orderId: string]: cron.ScheduledTask } = {};

export const schedulePaymentCheck = async (orderId: string, checkTime: Date) => {
  if (cronTasks[orderId]) {
    cronTasks[orderId].stop();
    delete cronTasks[orderId];
  }

  const task = cron.schedule(`*/1 * * * *`, async () => {

    const now = new Date();

    if (now >= checkTime) {
      try {
        const order = await prisma.order.findFirst({ where: { id: orderId } });

        if (order && order.isPaid === true) {
          await prisma.order.update({
            where: { id: order.id },
            data: {
              isConfirm: true,
              updatedAt: new Date(),
            },
          });
        }
      } catch (error) {
        console.error(`Error during payment check for order ${orderId}:`, error);
      }

      task.stop();
      delete cronTasks[orderId];
      return;
    }
  });
  cronTasks[orderId] = task;
};


export const acceptOrderDeliveryService = async ({ email, orderId, userId }: IAcceptOrderOutlet) => {
  const findWorker = await prisma.worker.findFirst({
    where: { email }
  });

  if (!findWorker) throw { msg: "Driver tidak tersedia", status: 404 };


  const order = await prisma.order.findFirst({
    where: { id: orderId },
    include: { orderStatus: true },
  });

  if (!order) throw { msg: "Order tidak ditemukan", status: 404 };


  const existingStatus = order.orderStatus.find((status) => status.status === "DRIVER_DELIVERED_LAUNDRY");
  if (existingStatus) throw { msg: "Order sudah diproses oleh driver lain asdasd", status: 400 }

  const driverToCustomerStatus = order.orderStatus.find(
    (status) => status.status === "DRIVER_TO_CUSTOMER"
  );

  if (driverToCustomerStatus) {
    if (driverToCustomerStatus.workerId !== userId) {
      throw { msg: "Order sedang diproses oleh driver lain", status: 400 };
    }
    const newStatus: OrderStatus = await prisma.orderStatus.create({
      data: {
        orderId: order.id,
        status: "DRIVER_DELIVERED_LAUNDRY",
        createdAt: new Date(),
        workerId: userId
      },
    });

    await prisma.order.update({
      where: { id: order.id },
      data: {
        updatedAt: new Date(),
        isProcessed: false
      }
    });
    const deliveredAt = newStatus.createdAt;
    const twoDaysLater = addHours(deliveredAt, 48);

    schedulePaymentCheck(order.id, twoDaysLater);

    return { newStatus };
  }
  throw { msg: "Order status tidak valid", status: 400 };
}

export const getAllOrderForAdminService = async ({
  userId,
  authorizationRole,
  storeId,
  page,
  limit_data,
  search,
  sort,
  tab,
  dateFrom,
  dateUntil,
  outletId
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
  dateUntil?: string,
  outletId: string
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

  let statusFilter: Status[];
  if (tab === "proses") {
    statusFilter = ['AWAITING_DRIVER_PICKUP', 'DRIVER_TO_OUTLET', 'DRIVER_ARRIVED_AT_OUTLET', 'AWAITING_PAYMENT', 'IN_WASHING_PROCESS', 'IN_IRONING_PROCESS', 'IN_PACKING_PROCESS', 'PAYMENT_DONE', 'DRIVER_TO_CUSTOMER', 'DRIVER_DELIVERED_LAUNDRY'];
  } else if (tab === "complaint") {
    statusFilter = ['DRIVER_DELIVERED_LAUNDRY'];
  } else if (tab === "done") {
    statusFilter = ['DRIVER_DELIVERED_LAUNDRY'];
  } else if (tab) {
    statusFilter = [tab as Status];
  } else {
    statusFilter = ['AWAITING_DRIVER_PICKUP', 'DRIVER_TO_OUTLET', 'DRIVER_ARRIVED_AT_OUTLET', 'AWAITING_PAYMENT', 'IN_WASHING_PROCESS', 'IN_IRONING_PROCESS', 'IN_PACKING_PROCESS', 'PAYMENT_DONE', 'DRIVER_TO_CUSTOMER', 'DRIVER_DELIVERED_LAUNDRY'];
  }
  const parsedDateFrom = dateFrom ? new Date(dateFrom as string) : undefined;
  const parsedDateUntil = dateUntil ? new Date(dateUntil as string) : undefined;

  const whereConditions: Prisma.OrderWhereInput = {
    ...(authorizationRole === 'SUPER_ADMIN'
      ? outletId
        ? { storeId: outletId }
        : {}
      : { storeId }),
    orderStatus: {
      some: {
        status: { in: statusFilter },
      },
    },
    AND: [
      search
        ? {
          OR: [
            { id: { contains: search as string, mode: 'insensitive' as Prisma.QueryMode } },
            { User: { firstName: { contains: search as string, mode: 'insensitive' as Prisma.QueryMode } } },
            { User: { lastName: { contains: search as string, mode: 'insensitive' as Prisma.QueryMode } } },
            { User: { phoneNumber: { contains: search as string, mode: 'insensitive' as Prisma.QueryMode } } },
          ],
        }
        : {},
      ...(tab === 'proses' ? [{ isConfirm: false, isComplain: false }] : []),
      ...(tab === 'complaint' ? [{ isConfirm: false, isComplain: true }] : []),
      ...(tab === 'done' ? [{ isConfirm: true }] : []),
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
      User: {
        select: {
          firstName: true,
          lastName: true,
          phoneNumber: true
        }
      },
      UserAddress: {
        select: {
          longitude: true,
          latitude: true
        }
      },
      orderStatus: {
        where: {
          status: {
            notIn: excludedStatusesOrder,
          },
        },
        orderBy: { createdAt: 'desc' },
        take: 1,
      },
      OrderType: {
        select: {
          type: true,
        },
      },
      Store: true,
    },
  });

  const filteredOrders = orders.filter(order => {
    const latestStatus = order.orderStatus[0]?.status;
    return statusFilter.includes(latestStatus)
  });

  const monthlyStatistic = [];
  for (let month = 0; month < 12; month++) {
    const startOfMonth = new Date(new Date().getFullYear(), month, 1);
    const endOfMonth = new Date(new Date().getFullYear(), month + 1, 0);

    if (outletId) {
      const monthlyStatistics = await prisma.order.groupBy({
        by: ['createdAt'],
        where: {
          createdAt: {
            gte: startOfMonth,
            lte: endOfMonth
          },
          storeId: outletId
        },
        _sum: {
          laundryPrice: true
        }
      });
      monthlyStatistic.push({ month, monthlyStatistics })
    } else {
      const monthlyStatistics = await prisma.order.groupBy({
        by: ['createdAt'],
        where: {
          createdAt: {
            gte: startOfMonth,
            lte: endOfMonth
          },
          ...(authorizationRole !== 'SUPER_ADMIN' && { storeId })
        },
        _sum: {
          laundryPrice: true
        }
      });
      monthlyStatistic.push({ month, monthlyStatistics })
    }
  }

  const paginatedOrders = filteredOrders.slice(offset, offset + Number(limit_data));
  const totalCount = filteredOrders.length;
  const totalPage = Math.ceil(totalCount / Number(limit_data));

  return {
    totalPage,
    orders: paginatedOrders,
    trackingOrder: filteredOrders,
    monthlyStatistic
  };
}

export const orderStatusService = async ({ orderId, email, userId }: IWashingProcessDone) => {
  const findWorker = await prisma.worker.findFirst({
    where: { email }
  })

  if (!findWorker) throw { msg: "worker tidak tersedia", status: 404 }

  const order = await prisma.order.findUnique({
    where: {
      id: String(orderId),
    },
    include: {
      OrderType: true,
      User: {
        select: {
          phoneNumber: true
        }
      }
    }
  });

  if (!order) throw { msg: "Order tidak ditemukan", status: 404 };

  const orderStatus = await prisma.orderStatus.findMany({
    where: {
      orderId: order.id
    },
    include: {
      Worker: true
    }
  })
  const orderDetail = await prisma.orderDetail.findMany({
    where: {
      orderId: order.id
    },
    include: {
      LaundryItem: true
    }
  })
  return { orderDetail, order, orderStatus };
};

export const getDriverHistoryService = async ({ tab, userId, authorizationRole, storeId, limit_data, page, search, dateFrom, dateUntil, sort }: IGeDriverHistory) => {
  const worker = await prisma.worker.findFirst({
    where: {
      id: userId,
      workerRole: authorizationRole,
      storeId: storeId
    }
  });

  if (!worker) throw { msg: "Data worker tidak tersedia", status: 404 }
  const offset = Number(limit_data) * (Number(page) - 1);

  let statusFilter: Status[];
  if (tab === "pickup") {
    statusFilter = ['DRIVER_ARRIVED_AT_OUTLET'];
  } else if (tab === "delivery") {
    statusFilter = ['DRIVER_DELIVERED_LAUNDRY'];
  } else {
    statusFilter = ['DRIVER_DELIVERED_LAUNDRY', 'DRIVER_ARRIVED_AT_OUTLET'];
  }


  const whereConditions: Prisma.OrderWhereInput = {
    storeId,
    orderStatus: {
      some: {
        status: {
          in: statusFilter,
        },
        workerId: userId,
      },
    },
    AND: [
      search
        ? {
          OR: [
            { id: { contains: search as string, mode: 'insensitive' as Prisma.QueryMode } },
            { User: { firstName: { contains: search as string, mode: 'insensitive' as Prisma.QueryMode } } },
            { User: { lastName: { contains: search as string, mode: 'insensitive' as Prisma.QueryMode } } },
            { User: { phoneNumber: { contains: search as string, mode: 'insensitive' as Prisma.QueryMode } } },
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
    include: {
      orderStatus: {
        where: {
          status: { in: statusFilter },
          workerId: userId,
        },
        orderBy: { createdAt: 'desc' },
        take: 1,
      },
      User: {
        select: {
          firstName: true,
          lastName: true,
          phoneNumber: true
        }
      },
      OrderType: true
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

export const getAllOrderForUserService = async ({
  userId,
  page,
  limit_data,
  search,
  sort,
  tab,
  dateFrom,
  dateUntil,
}: {
  userId: string,
  page: string,
  limit_data: string,
  search: string,
  sort: string,
  tab: string,
  dateFrom?: string,
  dateUntil?: string,
}) => {
  const offset = Number(limit_data) * (Number(page) - 1);

  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (!user) throw { msg: "User tidak tersedia", status: 404 }

  let statusFilter: Status[];
  if (tab === "waiting-payment") {
    statusFilter = ['AWAITING_DRIVER_PICKUP', 'DRIVER_TO_OUTLET', 'DRIVER_ARRIVED_AT_OUTLET', 'AWAITING_PAYMENT', 'IN_WASHING_PROCESS', 'IN_IRONING_PROCESS', 'IN_PACKING_PROCESS', 'PAYMENT_DONE', 'DRIVER_TO_CUSTOMER', 'DRIVER_DELIVERED_LAUNDRY'];
  } else if (tab === "complaint") {
    statusFilter = ['DRIVER_DELIVERED_LAUNDRY'];
  } else if (tab === "proses") {
    statusFilter = ['AWAITING_DRIVER_PICKUP', 'DRIVER_TO_OUTLET', 'DRIVER_ARRIVED_AT_OUTLET', 'AWAITING_PAYMENT', 'IN_WASHING_PROCESS', 'IN_IRONING_PROCESS', 'IN_PACKING_PROCESS', 'PAYMENT_DONE', 'DRIVER_TO_CUSTOMER', 'DRIVER_DELIVERED_LAUNDRY'];
  } else if (tab === "done") {
    statusFilter = ['DRIVER_DELIVERED_LAUNDRY'];
  } else if (tab) {
    statusFilter = [tab as Status];
  } else {
    statusFilter = ['AWAITING_DRIVER_PICKUP', 'DRIVER_TO_OUTLET', 'DRIVER_ARRIVED_AT_OUTLET', 'AWAITING_PAYMENT', 'IN_WASHING_PROCESS', 'IN_IRONING_PROCESS', 'IN_PACKING_PROCESS', 'PAYMENT_DONE', 'DRIVER_TO_CUSTOMER', 'DRIVER_DELIVERED_LAUNDRY'];
  }
  const parsedDateFrom = dateFrom ? new Date(dateFrom as string) : undefined;
  const parsedDateUntil = dateUntil ? new Date(dateUntil as string) : undefined;

  const whereConditions: Prisma.OrderWhereInput = {
    userId,
    orderStatus: {
      some: {
        status: { in: statusFilter },
      },
    },
    AND: [
      search
        ? {
          OR: [
            { id: { contains: search as string, mode: 'insensitive' as Prisma.QueryMode } },
            { User: { firstName: { contains: search as string, mode: 'insensitive' as Prisma.QueryMode } } },
            { User: { lastName: { contains: search as string, mode: 'insensitive' as Prisma.QueryMode } } },
            { User: { phoneNumber: { contains: search as string, mode: 'insensitive' as Prisma.QueryMode } } },
          ],
        }
        : {},
      ...(tab === 'waiting-payment' ? [{ isPaid: false }] : []),
      ...(tab === 'complaint' ? [{ isPaid: true, isComplain: true }] : []),
      ...(tab === 'proses' ? [{ isConfirm: false, isPaid: true, isComplain: false }] : []),
      ...(tab === 'done' ? [{ isConfirm: true, isPaid: true, isComplain: false }] : []),
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
      User: {
        select: {
          firstName: true,
          lastName: true,
          phoneNumber: true
        }
      },
      UserAddress: {
        select: {
          longitude: true,
          latitude: true
        }
      },
      orderStatus: {
        where: {
          status: {
            notIn: excludedStatusesOrder,
          },
        },
        orderBy: { createdAt: 'desc' },
        take: 1,
      },
      OrderType: {
        select: {
          type: true,
        },
      },
    },
  });

  const filteredOrders = orders.filter(order => {
    const latestStatus = order.orderStatus[0]?.status;
    return statusFilter.includes(latestStatus)

  });

  const paginatedOrders = filteredOrders.slice(offset, offset + Number(limit_data));

  const totalCount = filteredOrders.length;

  const totalPage = Math.ceil(totalCount / Number(limit_data));

  return {
    totalPage,
    orders: paginatedOrders,
  };
}

export const paymentOrderVAService = async ({ orderId, email, userId }: IPaymentOrder) => {
  const result = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
    const findUser = await tx.user.findFirst({
      where: { id: userId, email },
    });
    if (!findUser) throw { msg: "User tidak tersedia", status: 404 };

    const existingOrder = await tx.order.findUnique({
      where: { id: String(orderId) },
      include: {
        User: {
          select: {
            firstName: true,
            email: true,
            phoneNumber: true,
          },
        },
      },
    });
    if (!existingOrder) throw { msg: "Order tidak ditemukan", status: 404 };

    const paymentToken = await snap.createTransaction({
      payment_type: 'bank_transfer',
      transaction_details: {
        order_id: String(orderId),
        gross_amount: existingOrder.totalPrice,
      },
      customer_details: {
        first_name: existingOrder?.User?.firstName,
        email: existingOrder?.User?.email,
        phone: existingOrder?.User?.phoneNumber,
      },
    });

    const paymentUrl = paymentToken.redirect_url;

    const updatedOrderWithPaymentUrl = await tx.order.update({
      where: { id: String(orderId) },
      data: {
        paymentProof: paymentUrl,
        paymentMethod: 'MIDTRANS',
      },
    });

    return { paymentToken, updatedOrderWithPaymentUrl };
  });

  return result;
};


export const paymentOrderTfService = async ({ orderId, email, userId, paymentProof }: IPaymentOrderTf) => {
  const result = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
    const findUser = await tx.user.findFirst({
      where: { id: userId, email },
    });
    if (!findUser) throw { msg: "User tidak tersedia", status: 404 };

    const existingOrder = await tx.order.findUnique({
      where: { id: String(orderId) },
      include: {
        User: {
          select: {
            firstName: true,
            email: true,
            phoneNumber: true,
          },
        },
      },
    });
    if (!existingOrder) throw { msg: "Order tidak ditemukan", status: 404 };

    const updatedOrder = await tx.order.update({
      where: { id: String(orderId) },
      data: {
        paymentProof,
        paymentMethod: 'TF_MANUAL',
      },
    });

    return { updatedOrder };
  });

  return result;
};


export const getPaymentOrderForAdminService = async ({
  userId,
  authorizationRole,
  storeId,
  page,
  limit_data,
  search,
  sort,
  tab,
  dateFrom,
  dateUntil,
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
  dateUntil?: string,
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

  let statusFilter: Status[];
  if (tab === "verification") {
    statusFilter = ['AWAITING_PAYMENT'];
  } else if (tab === "waiting-payment") {
    statusFilter = ['AWAITING_PAYMENT'];
  } else if (tab === "done") {
    statusFilter = ['PAYMENT_DONE'];
  } else if (tab) {
    statusFilter = [tab as Status];
  } else {
    statusFilter = ['AWAITING_PAYMENT', 'PAYMENT_DONE'];
  }
  const parsedDateFrom = dateFrom ? new Date(dateFrom as string) : undefined;
  const parsedDateUntil = dateUntil ? new Date(dateUntil as string) : undefined;

  const whereConditions: Prisma.OrderWhereInput = {
    storeId,
    orderStatus: {
      some: {
        status: { in: statusFilter },
      },
    },
    AND: [
      search
        ? {
          OR: [
            { id: { contains: search as string, mode: 'insensitive' as Prisma.QueryMode } },
            { User: { firstName: { contains: search as string, mode: 'insensitive' as Prisma.QueryMode } } },
            { User: { lastName: { contains: search as string, mode: 'insensitive' as Prisma.QueryMode } } },
            { User: { phoneNumber: { contains: search as string, mode: 'insensitive' as Prisma.QueryMode } } },
          ],
        }
        : {},
      ...(tab === 'verification' ? [{ isPaid: false, paymentMethod: { equals: Payment.TF_MANUAL } }] : []),
      ...(tab === 'waiting-payment' ? [{ isPaid: false }] : []),
      ...(tab === 'done' ? [{ isPaid: true }] : []),
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
      User: {
        select: {
          firstName: true,
          lastName: true,
          phoneNumber: true
        }
      },
      UserAddress: {
        select: {
          longitude: true,
          latitude: true
        }
      },
      orderStatus: {
        orderBy: { createdAt: 'desc' },
        take: 1,
      },
      OrderType: {
        select: {
          type: true,
        },
      },
    },
  });


  const paginatedOrders = orders.slice(offset, offset + Number(limit_data));

  const totalCount = orders.length;

  const totalPage = Math.ceil(totalCount / Number(limit_data));

  return {
    totalPage,
    orders: paginatedOrders,
  };
}

export const PaymentDoneService = async ({ orderId, email, userId }: IIroningProcessDone) => {
  const result = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
    const findWorker = await tx.worker.findFirst({
      where: { email },
    });

    if (!findWorker) throw { msg: "Worker tidak tersedia", status: 404 };

    const order = await tx.order.findUnique({
      where: { id: String(orderId) },
    });

    if (!order) throw { msg: "Order tidak ditemukan", status: 404 };

    const orderStatus = await tx.orderStatus.create({
      data: {
        status: 'PAYMENT_DONE',
        orderId: order.id,
        createdAt: new Date(),
        workerId: userId,
      },
    });

    if (!orderStatus) throw { msg: "Data order status gagal dibuat", status: 404 };

    const orderUpdate = await tx.order.update({
      where: { id: String(orderId) },
      data: {
        isPaid: true,
      },
    });

    if (!orderUpdate) throw { msg: "Data order update gagal dibuat", status: 404 };

    return { orderStatus };
  });

  return result;
};

export const userConfirmOrderService = async ({ orderId, email, userId }: IIroningProcessDone) => {
  const result = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
    const findUser = await tx.user.findFirst({
      where: { email },
    });

    if (!findUser) throw { msg: "User tidak tersedia", status: 404 };

    const order = await tx.order.findUnique({
      where: {
        id: String(orderId),
      },
    });

    if (!order) throw { msg: "Order tidak ditemukan", status: 404 };

    const orderPayment = await tx.order.findUnique({
      where: {
        id: order.id,
        isPaid: true,
      },
    });

    if (!orderPayment) throw { msg: "Order belum dibayar", status: 404 };

    const orderUpdate = await tx.order.update({
      where: { id: order.id },
      data: {
        isConfirm: true,
      },
    });

    if (!orderUpdate) throw { msg: "Data konfirmasi order gagal dibuat", status: 404 };

    return { orderUpdate };
  });

  return result;
};

export const orderTrackingAdminService = async ({ userId, authorizationRole, period, storeId, outletId }: IOrderTrackingAdminParams) => {
  const worker = await prisma.worker.findUnique({
    where: {
      id: userId,
      workerRole: authorizationRole,
    },
  });

  if (!worker) throw { msg: "Worker tidak tersedia", status: 404 }

  if (!period || (period !== 'today' && period !== 'month')) throw { msg: 'Periode Salah', status: 404 }

  const now = new Date();

  let startDate: Date | undefined = undefined;
  let endDate: Date | undefined = undefined;

  if (period === 'today') {
    startDate = new Date(now.setHours(0, 0, 0, 0));
    endDate = new Date(now.setHours(23, 59, 59, 999));
  } else if (period === 'month') {
    startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
  }

  const whereFilter: Prisma.OrderWhereInput = {
    createdAt: {
      gte: startDate,
      lte: endDate,
    },
  };

  if (authorizationRole === 'SUPER_ADMIN') {
    if (outletId) {
      whereFilter.storeId = outletId;
    }
  } else if (storeId) {
    whereFilter.storeId = storeId;
  }


  const stats = await prisma.order.aggregate({
    _sum: {
      laundryPrice: true,
      totalWeight: true,
    },
    _count: {
      id: true,
    },
    where: whereFilter,
  });

  const totalPcsWhere: Prisma.OrderDetailWhereInput = {
    Order: {
      createdAt: {
        gte: startDate,
        lte: endDate,
      },
    },
  };

  if (authorizationRole !== 'SUPER_ADMIN' && storeId) {
    totalPcsWhere.Order = totalPcsWhere.Order || {};
    totalPcsWhere.Order.storeId = storeId;
  }

  const totalPcs = await prisma.orderDetail.aggregate({
    _count: {
      id: true,
    },
    where: totalPcsWhere,
  });
  return { totalPcs, stats };

}

export const orderTrackingDriverService = async ({ userId, authorizationRole, period }: IOrderTrackingDriverParams) => {
  const worker = await prisma.worker.findUnique({
    where: {
      id: userId,
      workerRole: authorizationRole,
    },
  });

  if (!worker) throw { msg: "Worker tidak ters edia", status: 404 }

  if (!period || (period !== 'today' && period !== 'month')) throw { msg: 'Periode Salah', status: 404 }

  const now = new Date();
  let startDate: Date | undefined = undefined;
  let endDate: Date | undefined = undefined;

  if (period === 'today') {
    startDate = new Date(now.setHours(0, 0, 0, 0));
    endDate = new Date(now.setHours(23, 59, 59, 999));
  } else if (period === 'month') {
    startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
  }

  const orders = await prisma.order.findMany({
    where: {
      createdAt: {
        gte: startDate,
        lte: endDate,
      },
      orderStatus: {
        some: {
          workerId: userId,
          status: {
            in: ['DRIVER_ARRIVED_AT_OUTLET', 'DRIVER_DELIVERED_LAUNDRY'],
          },
        },
      },
    },
    include: {
      orderStatus: true,
      orderDetail: true,
    },
  });

  let totalEarnings = 0;
  let totalOrders = 0;
  let totalWeight = 0;
  let totalPcs = 0;

  orders.forEach(order => {
    const handledStatuses = new Set(order.orderStatus.map(status => status.status));

    if (handledStatuses.has('DRIVER_ARRIVED_AT_OUTLET') && handledStatuses.has('DRIVER_DELIVERED_LAUNDRY')) {
      totalEarnings += order.deliveryFee || 0;
    } else {
      totalEarnings += (order.deliveryFee || 0) / 2;
    }

    totalOrders++;
    totalWeight += order.totalWeight || 0;
    totalPcs += order.orderDetail.reduce((sum, detail) => sum + (detail.quantity || 0), 0);
  });

  return {
    earnings: totalEarnings,
    orderCount: totalOrders,
    totalKg: totalWeight,
    totalPcs: totalPcs,
  };
};

export const orderTrackingWorkerService = async ({
  userId,
  authorizationRole,
  period,
}: {
  userId: string;
  authorizationRole: Role;
  period: string;
}) => {

  const role = authorizationRole

  const worker = await prisma.worker.findUnique({
    where: {
      id: userId,
      workerRole: authorizationRole,
    },
  });

  if (!worker) throw { msg: "Worker tidak ters edia", status: 404 }

  if (!period || (period !== 'today' && period !== 'month')) {
    throw { msg: 'Periode Salah', status: 404 };
  }

  const now = new Date();
  let startDate: Date | undefined = undefined;
  let endDate: Date | undefined = undefined;

  if (period === 'today') {
    startDate = new Date(now.setHours(0, 0, 0, 0));
    endDate = new Date(now.setHours(23, 59, 59, 999));
  } else if (period === 'month') {
    startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
  }

  const roleStatusMap: Record<Role, Status> = {
    [Role.WASHING_WORKER]: Status.IN_WASHING_PROCESS,
    [Role.IRONING_WORKER]: Status.IN_IRONING_PROCESS,
    [Role.PACKING_WORKER]: Status.IN_PACKING_PROCESS,
    [Role.SUPER_ADMIN]: Status.AWAITING_DRIVER_PICKUP,
    [Role.OUTLET_ADMIN]: Status.AWAITING_DRIVER_PICKUP,
    [Role.DRIVER]: Status.AWAITING_DRIVER_PICKUP
  };

  const targetStatus = roleStatusMap[role];
  if (!targetStatus) {
    throw { msg: 'Role tidak valid', status: 400 };
  }

  const orderCount = await prisma.orderStatus.count({
    where: {
      workerId: userId,
      status: targetStatus,
      Order: {
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
    },
  });

  const stats = await prisma.order.aggregate({
    _sum: {
      totalWeight: true,
    },
    where: {
      orderStatus: {
        some: {
          workerId: userId,
          status: targetStatus,
        },
      },
      createdAt: {
        gte: startDate,
        lte: endDate,
      },
    },
  });

  const totalPcs = await prisma.orderDetail.aggregate({
    _sum: {
      quantity: true,
    },
    where: {
      Order: {
        orderStatus: {
          some: {
            workerId: userId,
            status: targetStatus,
          },
        },
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
    },
  });

  return {
    orderCount,
    totalKg: stats._sum.totalWeight || 0,
    totalPcs: totalPcs._sum.quantity || 0,
  };
};

export const orderTrackingUserService = async ({ userId, period }: IOrderTrackingUser) => {
  if (!period || (period !== 'today' && period !== 'month')) {
    throw { msg: 'Invalid period', status: 400 };
  }

  const now = new Date();
  let startDate: Date | undefined = undefined;
  let endDate: Date | undefined = undefined;

  if (period === 'today') {
    startDate = new Date(now.setHours(0, 0, 0, 0));
    endDate = new Date(now.setHours(23, 59, 59, 999));
  } else if (period === 'month') {
    startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
  }

  const orderFilter = {
    userId: userId,
    createdAt: {
      gte: startDate,
      lte: endDate,
    },
  };

  const stats = await prisma.order.aggregate({
    _sum: {
      laundryPrice: true,
      totalWeight: true,
    },
    _count: {
      id: true,
    },
    where: orderFilter,
  });

  const totalPcs = await prisma.orderDetail.aggregate({
    _sum: {
      quantity: true,
    },
    where: {
      Order: {
        userId: userId,
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
    },
  });

  return {
    totalOrders: stats._count.id,
    totalSpent: stats._sum.laundryPrice || 0,
    totalWeight: stats._sum.totalWeight || 0,
    totalPcs: totalPcs._sum.quantity || 0,
  };
};

export const getOrdersForNotifService = async ({
  authorizationRole,
  storeId,
  page = "1",
  tab,
}: {
  userId: string;
  authorizationRole: Role;
  storeId: string;
  page: string;
  tab: string;
}) => {
  const limit = 5;

  const pageNumber = isNaN(parseInt(page)) ? 1 : Math.max(parseInt(page), 1);

  const offset = Math.max(limit * (pageNumber - 1), 0);

  let statusFilter: Status[];
  if (tab === "driver") {
    statusFilter = ['AWAITING_DRIVER_PICKUP', 'PAYMENT_DONE'];
  } else if (tab === "admin") {
    statusFilter = ['AWAITING_DRIVER_PICKUP', 'DRIVER_ARRIVED_AT_OUTLET', 'PAYMENT_DONE', 'DRIVER_DELIVERED_LAUNDRY'];
  } else if (tab === "user") {
    statusFilter = ['AWAITING_DRIVER_PICKUP', 'AWAITING_PAYMENT', 'PAYMENT_DONE', 'DRIVER_DELIVERED_LAUNDRY'];
  } else if (tab) {
    statusFilter = [tab as Status];
  } else {
    statusFilter = ['AWAITING_PAYMENT', 'DRIVER_ARRIVED_AT_OUTLET', 'PAYMENT_DONE', 'DRIVER_DELIVERED_LAUNDRY'];
  }

  const whereConditions: Prisma.OrderWhereInput = {
    ...(authorizationRole === "SUPER_ADMIN" ? {} : { storeId }),
    orderStatus: {
      some: {
        status: { in: statusFilter },
      },
    },
  };

  const orders = await prisma.order.findMany({
    where: whereConditions,
    orderBy: { createdAt: "desc" },
    take: limit,
    skip: offset,
    include: {
      User: {
        select: {
          firstName: true,
          lastName: true,
          phoneNumber: true,
        },
      },
      UserAddress: {
        select: {
          longitude: true,
          latitude: true,
        },
      },
      orderStatus: {
        take: 1,
        orderBy: {
          createdAt: "desc",
        },
        where: {
          status: { in: statusFilter },
        },
      },
      OrderType: {
        select: {
          type: true,
        },
      },
    },
  });

  const totalCount = await prisma.order.count({
    where: whereConditions,
  });

  const totalPage = Math.ceil(totalCount / limit);

  return {
    totalPage,
    orders,
  };
};

export const washingProcessService = async ({
  orderId,
  email,
  userId,
  notes,
}: {
  orderId: string;
  email: string;
  userId: string;
  notes?: string;
}) => {
  const result = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
    const findWorker = await tx.worker.findFirst({
      where: { email },
    });
    if (!findWorker) throw { msg: "Pengguna tidak tersedia", status: 404 };

    const order = await tx.order.findUnique({
      where: { id: String(orderId) },
      select: { orderTypeId: true },
    });
    if (!order) throw { msg: "Order tidak ditemukan", status: 404 };
    if (order.orderTypeId === 2)
      throw { msg: "Pesanan bertipe layanan setrika tidak dapat diproses", status: 400 };

    if (notes) {
      const updatedOrder = await tx.order.update({
        where: { id: String(orderId) },
        data: {
          notes,
          isSolved: false,
          isProcessed: false,
          updatedAt: new Date(),
        },
      });
      if (!updatedOrder) throw { msg: "Order gagal diupdate", status: 404 };

      return {
        message: "Approval request terhadap admin telah diajukan!",
        order: updatedOrder,
      };
    } else {
      const updatedOrder = await tx.order.update({
        where: { id: String(orderId) },
        data: {
          isProcessed: true,
          updatedAt: new Date(),
        },
      });
      if (!updatedOrder) throw { msg: "Order gagal diupdate", status: 404 };
      if (updatedOrder.isSolved === false)
        throw { msg: "Masalah belum terselesaikan, tidak dapat diproses", status: 400 };

      const existingStatus = await tx.orderStatus.findFirst({
        where: {
          orderId: String(orderId),
          status: "AWAITING_PAYMENT",
        },
      });
      if (!existingStatus)
        throw { msg: "Order tidak dapat diproses karena belum dibuat nota order oleh outlet admin", status: 400 };

      const orderStatus = await tx.orderStatus.create({
        data: {
          status: "IN_WASHING_PROCESS",
          orderId: String(orderId),
          workerId: userId,
          createdAt: new Date(),
        },
      });
      if (!orderStatus) throw { msg: "Data order status gagal dibuat", status: 404 };

      return {
        message: "Order berhasil diupdate!",
        orderStatus,
      };
    }
  });
  return result;
};

export const ironingProcessService = async ({
  orderId,
  email,
  userId,
  notes,
}: {
  orderId: string;
  email: string;
  userId: string;
  notes?: string;
}) => {
  await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
    const findWorker = await tx.worker.findFirst({
      where: { email },
    });
    if (!findWorker) throw { msg: "Pengguna tidak tersedia", status: 404 };

    const order = await tx.order.findUnique({
      where: { id: String(orderId) },
      select: { orderTypeId: true },
    });
    if (!order) throw { msg: "Order tidak ditemukan", status: 404 };
    if (order.orderTypeId === 1)
      throw { msg: "Pesanan dengan tipe tersebut tidak dapat diproses", status: 400 };

    if (order.orderTypeId === 2) {
      const createOrderStatus = await tx.orderStatus.create({
        data: {
          status: "IN_IRONING_PROCESS",
          orderId: String(orderId),
          createdAt: new Date(),
        },
      });
      if (!createOrderStatus)
        throw { msg: "Order status gagal dibuat, silahkan coba lagi", status: 400 };
    }

    const orderStatuses = await tx.orderStatus.findFirst({
      where: {
        orderId,
        status: "IN_IRONING_PROCESS",
      },
    });
    if (!orderStatuses)
      throw { msg: "Tidak ada order dengan status disetrika", status: 404 };

    await tx.orderStatus.update({
      where: { id: orderStatuses.id },
      data: {
        workerId: userId,
      },
    });
  });

  if (notes) {
    const updatedOrder = await prisma.order.update({
      where: {
        id: String(orderId),
      },
      data: {
        notes,
        isSolved: false,
        isProcessed: false,
        updatedAt: new Date(),
      },
    });
    if (!updatedOrder) throw { msg: "Order gagal diupdate", status: 404 };

    return {
      message: "Approval request terhadap admin telah diajukan!",
      order: updatedOrder,
    };
  } else {
    const updatedOrder = await prisma.order.update({
      where: {
        id: String(orderId),
      },
      data: {
        isProcessed: true,
      },
    });
    if (!updatedOrder) throw { msg: "Order gagal diupdate", status: 404 };

    if (updatedOrder.isSolved === false)
      throw { msg: "Masalah belum terselesaikan, tidak dapat diproses", status: 400 };

    const existingStatus = await prisma.orderStatus.findFirst({
      where: {
        orderId: String(orderId),
        status: "IN_IRONING_PROCESS",
      },
    });
    if (!existingStatus)
      throw { msg: "Order tidak dapat diproses karena belum dicuci", status: 400 };

    return {
      message: "Order berhasil diupdate!",
    };
  }
};

export const packingProcessService = async ({
  email,
  userId,
  orderId,
  notes,
}: {
  email: string;
  userId: string;
  orderId: string;
  notes?: string;
}) => {
  const result = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
    const findWorker = await tx.worker.findFirst({
      where: { email },
    });
    if (!findWorker) throw { msg: "Pengguna tidak tersedia", status: 404 };

    if (notes) {
      const updatedOrder = await tx.order.update({
        where: {
          id: String(orderId),
        },
        data: {
          notes,
          isSolved: false,
          isProcessed: false,
          updatedAt: new Date(),
        },
      });

      if (!updatedOrder) throw { msg: "Order gagal diupdate", status: 404 };

      return {
        message: "Permintaan persetujuan kepada admin telah diajukan!",
        order: updatedOrder,
      };

    } else {
      const updatedOrder = await tx.order.update({
        where: {
          id: String(orderId),
        },
        data: {
          isProcessed: true,
          updatedAt: new Date(),
        },
      });

      if (!updatedOrder) throw { msg: "Order gagal diupdate", status: 404 };
      if (updatedOrder.isSolved === false)
        throw { msg: "Masalah belum terselesaikan, tidak dapat diproses", status: 400 };

      const existingStatus = await tx.orderStatus.findFirst({
        where: {
          orderId: String(orderId),
          status: "IN_PACKING_PROCESS",
        },
      });

      if (!existingStatus)
        throw {
          msg: "Order tidak dapat diproses karena belum disetrika/dicuci",
          status: 400,
        };

      await tx.orderStatus.update({
        where: {
          id: existingStatus.id,
        },
        data: {
          workerId: userId
        }
      })

      return {
        message: "Order berhasil diupdate!",
        order: updatedOrder,
      };
    }
  });
  return result;
};


export const solveNotesService = async ({ orderId, userId, notes }: ISolveNotesInput) => {
  return await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
    const findWorker = await tx.worker.findFirst({
      where: {
        id: userId,
      },
    });

    if (!findWorker) {
      throw { msg: "Worker tidak ditemukan", status: 404 };
    }

    const solvedProblem = await tx.order.update({
      where: {
        id: orderId,
      },
      data: {
        isSolved: true,
        notes,
      },
    });

    if (!solvedProblem) {
      throw { msg: "Masalah pada order harus dijelaskan", status: 404 };
    }

    return solvedProblem;
  });
};

export const createComplaintService = async ({ orderId, complaintText, userId }: { orderId: string, complaintText: string, userId: string }) => {
  if (cronTasks[orderId]) {
    cronTasks[orderId].stop();
    delete cronTasks[orderId];
  }

  return await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
    const findUser = await tx.user.findFirst({
      where: { id: userId },
    });

    if (!findUser) {
      throw { msg: "User tidak ditemukan", status: 404 };
    }

    const complaint = await tx.order.update({
      where: { id: orderId },
      data: {
        isComplain: true,
        complaintText,
      },
    });

    if (!complaint) {
      throw { msg: "Komplain harus disebutkan", status: 404 };
    }

    return complaint;
  });
};
export const solveComplaintService = async ({ orderId, email, userId }: { orderId: string, email: string, userId: string }) => {

  return await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
    const findUser = await tx.user.findFirst({
      where: {
        id: userId,
        email
      },
    });

    if (!findUser) {
      throw { msg: "User tidak ditemukan", status: 404 };
    }

    const solveComplaint = await tx.order.update({
      where: { id: orderId },
      data: {
        isComplain: false,
        isConfirm: true
      },
    });

    if (!solveComplaint) {
      throw { msg: "Order & Komplain tidak ditemukan", status: 404 };
    }

    return solveComplaint;
  });
};
