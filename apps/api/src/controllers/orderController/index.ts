import prisma from "@/connection"
import { NextFunction, Request, Response } from "express";
const axios = require('axios');

interface Store {
  id: string;
  storeName: string;
  address: string;
  city: string;
  province: string;
  country: string;
  latitude: number;
  longitude: number;
  distance: number;
}

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
      headers: {
        key: 'b4b88bdd2e2065e365b688c79ebc550c'
      }
    });
    res.status(200).json({
      error: false,
      message: "Data provinsi berhasil  didapat!",
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
      headers: {
        key: 'b4b88bdd2e2065e365b688c79ebc550c'
      }
    });
    res.status(200).json({
      error: false,
      message: "Data kota berhasil  didapat!",
      data: response.data
    });
  } catch (error) {
    next(error)
  }
}

export const findNearestStore = async (req: Request, res: Response,next: NextFunction) => {
  
  try {
    const { userId } = req.body;
    const {address} = req.query
  
    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    let userAddress;
    if (address) {
      userAddress = await prisma.userAddress.findFirst({
        where: {
          usersId: userId,
          id: Number(address)
        } 
      });  
    } else {
      userAddress = await prisma.userAddress.findFirst({
        where: {
          usersId: userId,
          isMain: true
        } 
      })
    }

    if (!userAddress) {
      return res.status(404).json({ error: 'Alamat utama tidak ditemukan' });
    }

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
      HAVING distance <= 5
      ORDER BY distance ASC
      LIMIT 1;
    `;

    // if (nearestStores.length === 0) {
    //   return res.status(404).json({ error: 'Tidak ada toko Laundry kami di dekat anda' });
    // }

    res.status(200).json({
      error: false,
      message: "Data store terdekat berhasil  didapat!",
      data: nearestStores
    });
  } catch (error) {
    next(error)
  }
};



export const requestPickUp = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { totalPrice, deliveryFee, storesId, userId, orderTypeId, userAddressId } = req.body

    const newOrder = await prisma.order.create({
      data: {
        totalPrice,
        deliveryFee,
        storesId,
        usersId: userId,
        orderTypeId: parseInt(orderTypeId),
        userAddressId,
        isPaid: false,
      },
    });

    await prisma.orderStatus.create({
      data: {
        status: "AWAITING_DRIVER_PICKUP",
        orderId: newOrder.id,
      },
    });

    res.status(201).json({
      error:false,
      message: "Order dan status order berhasil ditambahkan!",
      order: newOrder,
    });
  } catch (error) {
    next(error)
  }
};


