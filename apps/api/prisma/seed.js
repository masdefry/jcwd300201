// import { PrismaClient } from '@prisma/client'
// import bcrypt from 'bcrypt'
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient()
const hashPassword = async (password) => {
    const saltRound = 10;
    return await bcrypt.hash(password, saltRound);
};

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
    {
        id: 6,
        storeName: 'CnC - Yogyakarta',
        address: 'Jl. Malioboro No. 12',
        city: 'Yogyakarta',
        province: 'DI Yogyakarta',
        country: 'Indonesia',
        zipCode: '55271',
        latitude: -7.7956,
        longitude: 110.3695
    },
    {
        id: 7,
        storeName: 'CnC - Bali',
        address: 'Jl. Sunset Road No. 56',
        city: 'Denpasar',
        province: 'Bali',
        country: 'Indonesia',
        zipCode: '80361',
        latitude: -8.6500,
        longitude: 115.2167
    },
    {
        id: 8,
        storeName: 'CnC - Makassar',
        address: 'Jl. Andi Pangerang No. 78',
        city: 'Makassar',
        province: 'Sulawesi Selatan',
        country: 'Indonesia',
        zipCode: '90115',
        latitude: -5.1478,
        longitude: 119.4328
    },
    {
        id: 9,
        storeName: 'CnC - Semarang',
        address: 'Jl. Pemuda No. 101',
        city: 'Semarang',
        province: 'Jawa Tengah',
        country: 'Indonesia',
        zipCode: '50135',
        latitude: -7.0055,
        longitude: 110.4381
    },
    {
        id: 10,
        storeName: 'CnC - Palembang',
        address: 'Jl. Pahlawan No. 67',
        city: 'Palembang',
        province: 'Sumatera Selatan',
        country: 'Indonesia',
        zipCode: '30125',
        latitude: -2.9978,
        longitude: 104.7750
    },
]

const dataWorker = [
    {
        email: 'superadmin@cnc.com',
        workerRole: 'SUPER_ADMIN',
        firstName: 'Super',
        lastName: 'Saia',
        phoneNumber: '08123123124',
        profilePicture: 'https://images.ctfassets.net/h6goo9gw1hh6/2sNZtFAWOdP1lmQ33VwRN3/24e953b920a9cd0ff2e1d587742a2472/1-intro-photo-final.jpg?w=1200&h=992&fl=progressive&q=70&fm=jpg',
        identityNumber: '302138124',
        storesId: 1
    },
    {
        email: "outletadmin@example.com",
        workerRole: "OUTLET_ADMIN",
        firstName: "Budi",
        lastName: "Santoso",
        phoneNumber: "081234567890",
        profilePicture: "https://st2.depositphotos.com/5682790/10456/v/450/depositphotos_104564156-stock-illustration-male-user-icon.jpg",
        identityNumber: "1234567890",
        storesId: 1
    },
    {
        email: "washingworker@example.com",
        workerRole: "WASHING_WORKER",
        firstName: "Siti",
        lastName: "Aminah",
        phoneNumber: "081234567891",
        profilePicture: "https://st2.depositphotos.com/5682790/10456/v/450/depositphotos_104564156-stock-illustration-male-user-icon.jpg",
        identityNumber: "1234567891",
        storesId: 1
    },
    {
        email: "ironingworker@example.com",
        workerRole: "IRONING_WORKER",
        firstName: "Joko",
        lastName: "Pratama",
        phoneNumber: "081234567892",
        profilePicture: "https://st2.depositphotos.com/5682790/10456/v/450/depositphotos_104564156-stock-illustration-male-user-icon.jpg",
        identityNumber: "1234567892",
        storesId: 1
    },
    {
        email: "packingworker@example.com",
        workerRole: "PACKING_WORKER",
        firstName: "Ani",
        lastName: "Wijaya",
        phoneNumber: "081234567893",
        profilePicture: "https://st2.depositphotos.com/5682790/10456/v/450/depositphotos_104564156-stock-illustration-male-user-icon.jpg",
        identityNumber: "1234567893",
        storesId: 1
    },
    {
        email: "driver@example.com",
        workerRole: "DRIVER",
        firstName: "Ahmad",
        lastName: "Subroto",
        phoneNumber: "081234567894",
        profilePicture: "https://st2.depositphotos.com/5682790/10456/v/450/depositphotos_104564156-stock-illustration-male-user-icon.jpg",
        identityNumber: "1234567894",
        motorcycleType: 'Ninja 4 tak',
        plateNumber: "B 666 DEV",
        storesId: 1
    },
    {
        email: 'superadmin2@cnc.com',
        workerRole: 'SUPER_ADMIN',
        firstName: 'Super',
        lastName: 'Saia',
        phoneNumber: '08123123124',
        profilePicture: 'https://images.ctfassets.net/h6goo9gw1hh6/2sNZtFAWOdP1lmQ33VwRN3/24e953b920a9cd0ff2e1d587742a2472/1-intro-photo-final.jpg?w=1200&h=992&fl=progressive&q=70&fm=jpg',
        identityNumber: '302138124',
        storesId: 2
    },
    {
        email: "outletadmin2@example.com",
        workerRole: "OUTLET_ADMIN",
        firstName: "Budi",
        lastName: "Santoso",
        phoneNumber: "081234567890",
        profilePicture: "https://st2.depositphotos.com/5682790/10456/v/450/depositphotos_104564156-stock-illustration-male-user-icon.jpg",
        identityNumber: "1234567890",
        storesId: 2
    },
    {
        email: "washingworker2@example.com",
        workerRole: "WASHING_WORKER",
        firstName: "Siti",
        lastName: "Aminah",
        phoneNumber: "081234567891",
        profilePicture: "https://st2.depositphotos.com/5682790/10456/v/450/depositphotos_104564156-stock-illustration-male-user-icon.jpg",
        identityNumber: "1234567891",
        storesId: 2
    },
    {
        email: "ironingworke2@example.com",
        workerRole: "IRONING_WORKER",
        firstName: "Joko",
        lastName: "Pratama",
        phoneNumber: "081234567892",
        profilePicture: "https://st2.depositphotos.com/5682790/10456/v/450/depositphotos_104564156-stock-illustration-male-user-icon.jpg",
        identityNumber: "1234567892",
        storesId: 2
    },
    {
        email: "packingworker2@example.com",
        workerRole: "PACKING_WORKER",
        firstName: "Ani",
        lastName: "Wijaya",
        phoneNumber: "081234567893",
        profilePicture: "https://st2.depositphotos.com/5682790/10456/v/450/depositphotos_104564156-stock-illustration-male-user-icon.jpg",
        identityNumber: "1234567893",
        storesId: 2
    },
    {
        email: "driver2@example.com",
        workerRole: "DRIVER",
        firstName: "Ahmad",
        lastName: "Subroto",
        phoneNumber: "081234567894",
        profilePicture: "https://st2.depositphotos.com/5682790/10456/v/450/depositphotos_104564156-stock-illustration-male-user-icon.jpg",
        identityNumber: "1234567894",
        motorcycleType: 'Ninja 4 tak',
        plateNumber: "B 666 DEV",
        storesId: 2
    },
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
async function main() {
    await prisma.stores.createMany({
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
            storesId: String(worker.storesId),
        })),
        skipDuplicates: true,
    });

    await prisma.itemName.createMany({
        data: dataItem.map((item) => ({
            itemName: item.itemName,
        })),
        skipDuplicates: true,
    });

    await prisma.orderType.createMany({
        data: dataOrderType.map((item) => ({
            Type: item.type,
            Price: item.price
        })),
        skipDuplicates: true,
    })

    console.log("Data seeded successfully.");
}

main()
    .catch((error) => {
        console.error("Error seeding data:", error);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
