const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const dotenv = require('dotenv')
const { dataOrderAndi, dataContactMessage, dataStore,
    dataWorker, dataItem, dataUser, dataOrderType, dataUserAddress } = require('./fillDatabase')

const prisma = new PrismaClient()
dotenv.config()
const profilePict = process.env.PROFILE_PICTURE
const hashPassword = async (password) => {
    const saltRound = 10;
    return await bcrypt.hash(password, saltRound);
}

async function main() {
    try {
        await prisma.store.createMany({
            data: dataStore.map((store) => ({
                id: String(store.id),
                storeName: store.storeName,
                address: store.address,
                city: store.city,
                province: store.province,
                country: store.country,
                zipCode: store.zipCode,
                latitude: store.latitude,
                longitude: store.longitude,
            })),
            skipDuplicates: true,
        })

        await prisma.shift.createMany({
            data: [
                { startTime: new Date('2024-12-24T08:00:00Z'), endTime: new Date('2024-12-24T16:00:00Z') },
                { startTime: new Date('2024-12-24T16:00:00Z'), endTime: new Date('2024-12-24T23:59:59Z') }
            ]
        })

        const hashedPassword = await hashPassword("12312312");

        const findShift = await prisma.shift.findMany()
        if (findShift?.length > 0) {
            await prisma.worker.createMany({
                data: dataWorker.map((worker) => ({
                    email: worker.email,
                    password: hashedPassword,
                    workerRole: worker.workerRole,
                    firstName: worker.firstName,
                    lastName: worker.lastName,
                    phoneNumber: worker.phoneNumber,
                    profilePicture: worker.profilePicture,
                    identityNumber: worker.identityNumber,
                    motorcycleType: worker.motorcycleType || null,
                    plateNumber: worker.plateNumber || null,
                    storeId: String(worker.storeId),
                    shiftId: Number(worker?.shiftId)
                })),
                skipDuplicates: true,
            });
        }

        const userPromises = dataUser.map(async (user) => {
            return prisma.user.upsert({
                where: { email: user.email },
                update: {},
                create: {
                    email: user.email,
                    role: 'CUSTOMER',
                    password: hashedPassword,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    phoneNumber: user.phoneNumber,
                    profilePicture: user.profilePicture,
                    isVerified: user.isVerified,
                    verifyCode: user.verifyCode,
                    isGoogleRegister: user.isGoogleRegister,
                    forgotPasswordToken: user.forgotPasswordToken,
                    isDiscountUsed: user.isDiscountUsed,
                    isGooglePasswordChange: user.isGooglePasswordChange
                },
            });
        });

        const createdUsers = await Promise.all(userPromises);
        const firstUserId = createdUsers[0].id;
        const userAddresses = dataUserAddress.map((address) => ({ ...address, userId: firstUserId }));

        await prisma.userAddress.createMany({
            data: userAddresses,
            skipDuplicates: true,
        });

        await prisma.laundryItem.createMany({
            data: dataItem.map((item) => ({
                itemName: item.itemName,
            })),
            skipDuplicates: true,
        });

        await prisma.orderType.createMany({
            data: dataOrderType.map((item) => ({
                type: item.type,
                price: item.price,
            })),
            skipDuplicates: true,
        });

        const dateNow = Date.now() * Math.random()
        const id = `CUST${Math.floor(dateNow)}ANDI`
        const findStore = await prisma.store.findFirst({ where: { id: '1' } })

        if (findStore) {
            await prisma.user.create({
                data: {
                    id,
                    email: "kickandi@cnc.com",
                    firstName: "Andi",
                    lastName: "Kick",
                    phoneNumber: "082308124081",
                    profilePicture: profilePict,
                    role: "CUSTOMER",
                    isVerified: true,
                    verifyCode: "701274",
                    isGoogleRegister: false,
                    password: hashedPassword,
                    userAddress: {
                        create: [
                            {
                                id: 10,
                                addressName: "Rumah",
                                addressDetail: "Jln. Haji Kurun No. 14",
                                city: "Bogor",
                                province: "Jawa Barat",
                                country: "Indonesia",
                                zipCode: "141250",
                                latitude: -6.23348808466673,
                                longitude: 106.6331260189041,
                                isMain: true,
                            },
                        ],
                    },
                    contact: {
                        create: dataContactMessage,
                    },
                    order: {
                        create: dataOrderAndi,
                    },
                },
            })
        }

        console.log("Data seeded successfully.")

    } catch (error) {}
}

main()
    .catch((error) => {
        console.error("Error seeding data:", error);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });