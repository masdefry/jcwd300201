const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const dotenv = require('dotenv')

const prisma = new PrismaClient()
dotenv.config()
const hashPassword = async (password) => {
    const saltRound = 10;
    return await bcrypt.hash(password, saltRound);
};

const profilePict = process.env.PROFILE_PICTURE

const dataStore = [
    {
        id: 1,
        storeName: 'CnC - Tangerang',
        address: 'Ruko Gading Serpong Boulevard, Jl. Gading Serpong Boulevard No.AA3/19',
        city: 'Tangerang',
        province: 'Banten',
        country: 'Indonesia',
        zipCode: '15810',
        latitude: -6.23348808466673,
        longitude: 106.63212601890415
    },
    {
        id: 2,
        storeName: 'CnC - Jakarta',
        address: 'Jl. Sudirman No. 123, Blok A',
        city: 'Jakarta',
        province: 'DKI Jakarta',
        country: 'Indonesia',
        zipCode: '10210',
        latitude: -6.2088,
        longitude: 106.8456
    },
    {
        id: 3,
        storeName: 'CnC - Bandung',
        address: 'Jl. Dago No. 45',
        city: 'Bandung',
        province: 'Jawa Barat',
        country: 'Indonesia',
        zipCode: '40135',
        latitude: -6.9147,
        longitude: 107.6098
    },
    {
        id: 4,
        storeName: 'CnC - Surabaya',
        address: 'Jl. Basuki Rahmat No. 87',
        city: 'Surabaya',
        province: 'Jawa Timur',
        country: 'Indonesia',
        zipCode: '60271',
        latitude: -7.2504,
        longitude: 112.7688
    },
    {
        id: 5,
        storeName: 'CnC - Medan',
        address: 'Jl. Gatot Subroto No. 32',
        city: 'Medan',
        province: 'Sumatera Utara',
        country: 'Indonesia',
        zipCode: '20112',
        latitude: 3.5952,
        longitude: 98.6722
    },
]

const dataWorker = [
    {
        email: 'superadmin@cnc.com',
        workerRole: 'SUPER_ADMIN',
        firstName: 'Super',
        lastName: 'Saia',
        phoneNumber: '08123123124',
        profilePicture: profilePict,
        identityNumber: '302138124',
        storeId: 1
    },
    {
        email: "outletadmin@example.com",
        workerRole: "OUTLET_ADMIN",
        firstName: "Budi",
        lastName: "Santoso",
        phoneNumber: "081234567890",
        profilePicture: profilePict,
        identityNumber: "1234567890",
        storeId: 1
    },
    {
        email: "washingworker@example.com",
        workerRole: "WASHING_WORKER",
        firstName: "Siti",
        lastName: "Aminah",
        phoneNumber: "081234567891",
        profilePicture: profilePict,
        identityNumber: "1234567891",
        storeId: 1
    },
    {
        email: "ironingworker@example.com",
        workerRole: "IRONING_WORKER",
        firstName: "Joko",
        lastName: "Pratama",
        phoneNumber: "081234567892",
        profilePicture: profilePict,
        identityNumber: "1234567892",
        storeId: 1
    },
    {
        email: "packingworker@example.com",
        workerRole: "PACKING_WORKER",
        firstName: "Ani",
        lastName: "Wijaya",
        phoneNumber: "081234567893",
        profilePicture: profilePict,
        identityNumber: "1234567893",
        storeId: 1
    },
    {
        email: "driver@example.com",
        workerRole: "DRIVER",
        firstName: "Ahmad",
        lastName: "Subroto",
        phoneNumber: "081234567894",
        profilePicture: profilePict,
        identityNumber: "1234567894",
        motorcycleType: 'Ninja 4 tak',
        plateNumber: "B 666 DEV",
        storeId: 1
    },
    {
        email: "outletadmin2@example.com",
        workerRole: "OUTLET_ADMIN",
        firstName: "Budi",
        lastName: "Santoso",
        phoneNumber: "081234567890",
        profilePicture: profilePict,
        identityNumber: "1234567890",
        storeId: 5
    },
    {
        email: "washingworker2@example.com",
        workerRole: "WASHING_WORKER",
        firstName: "Siti",
        lastName: "Aminah",
        phoneNumber: "081234567891",
        profilePicture: profilePict,
        identityNumber: "1234567891",
        storeId: 5
    },
    {
        email: "ironingworke2@example.com",
        workerRole: "IRONING_WORKER",
        firstName: "Joko",
        lastName: "Pratama",
        phoneNumber: "081234567892",
        profilePicture: profilePict,
        identityNumber: "1234567892",
        storeId: 5
    },
    {
        email: "packingworker2@example.com",
        workerRole: "PACKING_WORKER",
        firstName: "Ani",
        lastName: "Wijaya",
        phoneNumber: "081234567893",
        profilePicture: profilePict,
        identityNumber: "1234567893",
        storeId: 5
    },
    {
        email: "driver2@example.com",
        workerRole: "DRIVER",
        firstName: "Ahmad",
        lastName: "Subroto",
        phoneNumber: "081234567894",
        profilePicture: profilePict,
        identityNumber: "1234567894",
        motorcycleType: 'Ninja 4 tak',
        plateNumber: "B 666 DEV",
        storeId: 2
    },
    {
        email: "outletadmin2@example.com",
        workerRole: "OUTLET_ADMIN",
        firstName: "Rina",
        lastName: "Saputra",
        phoneNumber: "081245678900",
        profilePicture: profilePict,
        identityNumber: "2014567890",
        storeId: 2,
    },
    {
        email: "washingworker2@example.com",
        workerRole: "WASHING_WORKER",
        firstName: "Yudi",
        lastName: "Kusuma",
        phoneNumber: "081245678901",
        profilePicture: profilePict,
        identityNumber: "2014567891",
        storeId: 2,
    },
    {
        email: "ironingworker2@example.com",
        workerRole: "IRONING_WORKER",
        firstName: "Sari",
        lastName: "Andini",
        phoneNumber: "081245678902",
        profilePicture: profilePict,
        identityNumber: "2014567892",
        storeId: 2,
    },
    {
        email: "packingworker2@example.com",
        workerRole: "PACKING_WORKER",
        firstName: "Bambang",
        lastName: "Wijaya",
        phoneNumber: "081245678903",
        profilePicture: profilePict,
        identityNumber: "2014567893",
        storeId: 2,
    },
    {
        email: "driver2@example.com",
        workerRole: "DRIVER",
        firstName: "Dedi",
        lastName: "Pratama",
        phoneNumber: "081245678904",
        profilePicture: profilePict,
        identityNumber: "2014567894",
        motorcycleType: "Vario 125",
        plateNumber: "B 1234 ABC",
        storeId: 2,
    },
    {
        email: "outletadmin3@example.com",
        workerRole: "OUTLET_ADMIN",
        firstName: "Dewi",
        lastName: "Lestari",
        phoneNumber: "081345678900",
        profilePicture: profilePict,
        identityNumber: "3014567890",
        storeId: 3,
    },
    {
        email: "washingworker3@example.com",
        workerRole: "WASHING_WORKER",
        firstName: "Eko",
        lastName: "Susanto",
        phoneNumber: "081345678901",
        profilePicture: profilePict,
        identityNumber: "3014567891",
        storeId: 3,
    },
    {
        email: "ironingworker3@example.com",
        workerRole: "IRONING_WORKER",
        firstName: "Lina",
        lastName: "Wulandari",
        phoneNumber: "081345678902",
        profilePicture: profilePict,
        identityNumber: "3014567892",
        storeId: 3,
    },
    {
        email: "packingworker3@example.com",
        workerRole: "PACKING_WORKER",
        firstName: "Anton",
        lastName: "Rahman",
        phoneNumber: "081345678903",
        profilePicture: profilePict,
        identityNumber: "3014567893",
        storeId: 3,
    },
    {
        email: "driver3@example.com",
        workerRole: "DRIVER",
        firstName: "Rizky",
        lastName: "Aditya",
        phoneNumber: "081345678904",
        profilePicture: profilePict,
        identityNumber: "3014567894",
        motorcycleType: "Beat Street",
        plateNumber: "B 5678 DEF",
        storeId: 3,
    },
    {
        email: "outletadmin4@example.com",
        workerRole: "OUTLET_ADMIN",
        firstName: "Rani",
        lastName: "Haryanto",
        phoneNumber: "081445678900",
        profilePicture: profilePict,
        identityNumber: "4014567890",
        storeId: 4,
    },
    {
        email: "washingworker4@example.com",
        workerRole: "WASHING_WORKER",
        firstName: "Fajar",
        lastName: "Santoso",
        phoneNumber: "081445678901",
        profilePicture: profilePict,
        identityNumber: "4014567891",
        storeId: 4,
    },
    {
        email: "ironingworker4@example.com",
        workerRole: "IRONING_WORKER",
        firstName: "Nia",
        lastName: "Anggraini",
        phoneNumber: "081445678902",
        profilePicture: profilePict,
        identityNumber: "4014567892",
        storeId: 4,
    },
    {
        email: "packingworker4@example.com",
        workerRole: "PACKING_WORKER",
        firstName: "Hendra",
        lastName: "Gunawan",
        phoneNumber: "081445678903",
        profilePicture: profilePict,
        identityNumber: "4014567893",
        storeId: 4,
    },
    {
        email: "driver4@example.com",
        workerRole: "DRIVER",
        firstName: "Agus",
        lastName: "Putra",
        phoneNumber: "081445678904",
        profilePicture: profilePict,
        identityNumber: "4014567894",
        motorcycleType: "Mio M3",
        plateNumber: "B 6789 GHI",
        storeId: 4,
    },
    {
        email: "outletadmin5@example.com",
        workerRole: "OUTLET_ADMIN",
        firstName: "Mira",
        lastName: "Kartika",
        phoneNumber: "081545678900",
        profilePicture: profilePict,
        identityNumber: "5014567890",
        storeId: 5,
    },
    {
        email: "washingworker5@example.com",
        workerRole: "WASHING_WORKER",
        firstName: "Deni",
        lastName: "Supriyadi",
        phoneNumber: "081545678901",
        profilePicture: profilePict,
        identityNumber: "5014567891",
        storeId: 5,
    },
    {
        email: "ironingworker5@example.com",
        workerRole: "IRONING_WORKER",
        firstName: "Fira",
        lastName: "Widyaningrum",
        phoneNumber: "081545678902",
        profilePicture: profilePict,
        identityNumber: "5014567892",
        storeId: 5,
    },
    {
        email: "packingworker5@example.com",
        workerRole: "PACKING_WORKER",
        firstName: "Bayu",
        lastName: "Pangestu",
        phoneNumber: "081545678903",
        profilePicture: profilePict,
        identityNumber: "5014567893",
        storeId: 5,
    },
    {
        email: "driver5@example.com",
        workerRole: "DRIVER",
        firstName: "Iqbal",
        lastName: "Hakim",
        phoneNumber: "081545678904",
        profilePicture: profilePict,
        identityNumber: "5014567894",
        motorcycleType: "NMAX",
        plateNumber: "B 8901 JKL",
        storeId: 5,
    }
]

const dataItem = [
    {
        itemName: "Kaos"
    },
    {
        itemName: "Kemaja"
    },
    {
        itemName: "Celana Panjang"
    },
    {
        itemName: "Celana Pendek"
    },
    {
        itemName: "Jeans"
    },
    {
        itemName: "Handuk"
    },
    {
        itemName: "Sprei & Bed Cover"
    },
    {
        itemName: "Boneka"
    },
    {
        itemName: "Celana Dalam"
    },
    {
        itemName: "Bra"
    },
    {
        itemName: "Kaos Kaki"
    },
    {
        itemName: "Jaket"
    },
    {
        itemName: "Boneka"
    },
    {
        itemName: "Jas"
    },
    {
        itemName: "Gorden"
    },
    {
        itemName: "Karpet"
    },
    {
        itemName: "Guling"
    },
    {
        itemName: "Bantal"
    },
    {
        itemName: "Selimut"
    },
    {
        itemName: "Cadar"
    },
    {
        itemName: "Tas"
    },
]


const dataOrderType = [
    {
        type: "Wash Only",
        price: 6500
    },
    {
        type: "Iron Only",
        price: 6000
    },
    {
        type: "Wash & Iron",
        price: 9000
    },
]


const dataUser = [
    {
        email: "jonathan2323@gmail.com",
        firstName: "Jonathan",
        lastName: "Ezter",
        phoneNumber: "085632325489",
        profilePicture: profilePict,
        isVerified: true,
        verifyCode: "sd486aa",
        isGoogleRegister: false,
        forgotPasswordToken: "68asd684a",
        isDiscountUsed: false,
        isGooglePasswordChange: false
    },
    {
        email: "gaga@gmail.com",
        firstName: "gaga",
        lastName: "gugu",
        phoneNumber: "085632343489",
        isVerified: true,
        profilePicture: profilePict,
        verifyCode: "sd486aa",
        isGoogleRegister: false,
        forgotPasswordToken: "68asd684a",
        isDiscountUsed: false,
        isGooglePasswordChange: false
    },
]

const dataUserAddress = [
    {
        addressName: "Rumah",
        addressDetail: "Jl. Kebangsaan no.23",
        city: "Tangerang",
        isMain: true,
        province: "Banten",
        country: "Indonesia",
        zipCode: "15123",
        latitude: -6.23348808466673,
        longitude: 106.6331260189041,
    },
    {
        addressName: "Kantor",
        addressDetail: "Jl. Makmur no.23",
        city: "Jakarta",
        isMain: false,
        province: "Banten",
        country: "Indonesia",
        zipCode: "15123",
        latitude: -6.2088,
        longitude: 106.8466,
    },
    {
        addressName: "Rumah",
        addressDetail: "Jl. Kebangsaan no.23",
        city: "Tangerang",
        isMain: true,
        province: "Banten",
        country: "Indonesia",
        zipCode: "15123",
        latitude: -6.23348808466673,
        longitude: 106.6331260189041,
    },
    {
        addressName: "Kantor",
        addressDetail: "Jl. Makmur no.23",
        city: "Jakarta",
        isMain: false,
        province: "Banten",
        country: "Indonesia",
        zipCode: "15123",
        latitude: -6.2088,
        longitude: 106.8466,
    },
]

async function main() {
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
    });

    const hashedPassword = await hashPassword("12312312");

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
        })),
        skipDuplicates: true,
    });

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

    const userAddresses = dataUserAddress.map((address) => ({
        ...address,
        userId: firstUserId, 
    }));

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
            Type: item.type,
            Price: item.price,
        })),
        skipDuplicates: true,
    });
  
    console.log("Data seeded successfully.");
}

main()
    .catch((error) => {
        console.error("Error seeding data:", error);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });