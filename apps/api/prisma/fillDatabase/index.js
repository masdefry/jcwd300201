const { addHours } = require('date-fns')
const dotenv = require('dotenv')

dotenv.config()
const profilePict = process.env.PROFILE_PICTURE

const randomPart = Math.random().toString(36).substring(2, 6).toUpperCase()
const datePart = `${new Date().getFullYear()}${new Date().getMonth()}`.slice(-4)
const timePart = Date.now().toString().slice(-4)

const orderId = `ORD${datePart}${randomPart}${timePart}`;

const dataOrderAndi = [
    { totalPrice: 200000, deliveryFee: 65000, discount: 0, isPaid: false, isProcessed: false, isDone: false, isReqDelivery: false, isConfirm: false, isSolved: false, notes: null, storeId: "1", orderTypeId: 1, userAddressId: 10, orderStatus: { create: { status: 'AWAITING_DRIVER_PICKUP', createdAt: new Date('2024-12-01') } }, createdAt: new Date('2024-12-01') },
    { totalPrice: 200000, deliveryFee: 65000, discount: 0, isPaid: false, isProcessed: false, isDone: false, isReqDelivery: false, isConfirm: false, isSolved: false, notes: null, storeId: "1", orderTypeId: 1, userAddressId: 10, orderStatus: { create: { status: 'AWAITING_DRIVER_PICKUP', createdAt: new Date('2024-01-25') } }, createdAt: new Date('2024-01-25') },
]

const dataContactMessage = [
    { name: "Andi Saputra", email: "andisaputra@cnc.com", phoneNumber: "081742107412", textHelp: "Halo Admin, Bisakah anda membantu menjelaskan cara ordernya?" },
    { name: "Budi Santoso", email: "budisantoso@cnc.com", phoneNumber: "081742107413", textHelp: "Halo Admin, Apakah ada panduan penggunaan layanan?" },
];

const dataStore = [
    { id: 1, storeName: 'CNC - Tangerang', address: 'Ruko Gading Serpong Boulevard, Jl. Gading Serpong Boulevard No.AA3/19', city: 'Tangerang', province: 'Banten', country: 'Indonesia', zipCode: '15810', latitude: -6.23348808466673, longitude: 106.63212601890415 },
    { id: 2, storeName: 'CNC - Jakarta', address: 'Jl. Sudirman No. 123, Blok A', city: 'Jakarta', province: 'DKI Jakarta', country: 'Indonesia', zipCode: '10210', latitude: -6.2088, longitude: 106.8456 },
    { id: 3, storeName: 'CNC - Bandung', address: 'Jl. Dago No. 45', city: 'Bandung', province: 'Jawa Barat', country: 'Indonesia', zipCode: '40135', latitude: -6.9147, longitude: 107.6098 },
    { id: 4, storeName: 'CNC - Surabaya', address: 'Jl. Basuki Rahmat No. 87', city: 'Surabaya', province: 'Jawa Timur', country: 'Indonesia', zipCode: '60271', latitude: -7.2504, longitude: 112.7688 },
    { id: 5, storeName: 'CNC - Medan', address: 'Jl. Gatot Subroto No. 32', city: 'Medan', province: 'Sumatera Utara', country: 'Indonesia', zipCode: '20112', latitude: 3.5952, longitude: 98.6722 },
]

const dataWorker = [
    { email: 'superadmin@cnc.com', shiftId: 1, workerRole: 'SUPER_ADMIN', firstName: 'Andi', lastName: 'Saputra', phoneNumber: '628123123124', profilePicture: profilePict, identityNumber: '302138124', storeId: 1 },
    { email: 'admin@cnc.com', shiftId: 1, workerRole: 'SUPER_ADMIN', firstName: 'Mark', lastName: 'Sumenep', phoneNumber: '6281233463124', profilePicture: profilePict, identityNumber: '302162424', storeId: 1 },

    { email: "outletadmin@example.com", shiftId: 1, workerRole: "OUTLET_ADMIN", firstName: "Budi", lastName: "Santoso", phoneNumber: "6281234567890", profilePicture: profilePict, identityNumber: "1234567890", storeId: 1 },
    { email: "washingworker@example.com", shiftId: 1, workerRole: "WASHING_WORKER", firstName: "Siti", lastName: "Aminah", phoneNumber: "6281234567891", profilePicture: profilePict, identityNumber: "1234567891", storeId: 1 },
    { email: "ironingworker@example.com", shiftId: 1, workerRole: "IRONING_WORKER", firstName: "Joko", lastName: "Pratama", phoneNumber: "6281234567892", profilePicture: profilePict, identityNumber: "1234567892", storeId: 1 },
    { email: "packingworker@example.com", shiftId: 1, workerRole: "PACKING_WORKER", firstName: "Ani", lastName: "Wijaya", phoneNumber: "6281234567893", profilePicture: profilePict, identityNumber: "1234567893", storeId: 1 },
    { email: "driver1@example.com", shiftId: 1, workerRole: "DRIVER", firstName: "Ahmad", lastName: "Subroto", phoneNumber: "6281234567894", profilePicture: profilePict, identityNumber: "1234567894", motorcycleType: 'Ninja 4 tak', plateNumber: "B 666 DEV", storeId: 1 },
    { email: "driver11@example.com", shiftId: 1, workerRole: "DRIVER", firstName: "Gatot", lastName: "Sumiwa", phoneNumber: "6281234567894", profilePicture: profilePict, identityNumber: "1234567894", motorcycleType: 'Ninja 4 tak', plateNumber: "B 666 DEV", storeId: 1 },

    { email: "outletadmin2@example.com", shiftId: 2, workerRole: "OUTLET_ADMIN", firstName: "Rina", lastName: "Saputra", phoneNumber: "6281245678900", profilePicture: profilePict, identityNumber: "2014567890", storeId: 2, },
    { email: "washingworker2@example.com", shiftId: 1, workerRole: "WASHING_WORKER", firstName: "Yudi", lastName: "Kusuma", phoneNumber: "6281245678901", profilePicture: profilePict, identityNumber: "2014567891", storeId: 2, },
    { email: "ironingworker2@example.com", shiftId: 2, workerRole: "IRONING_WORKER", firstName: "Sari", lastName: "Andini", phoneNumber: "6281245678902", profilePicture: profilePict, identityNumber: "2014567892", storeId: 2, },
    { email: "packingworker2@example.com", shiftId: 1, workerRole: "PACKING_WORKER", firstName: "Bambang", lastName: "Wijaya", phoneNumber: "6281245678903", profilePicture: profilePict, identityNumber: "2014567893", storeId: 2, },
    { email: "driver2@example.com", shiftId: 2, workerRole: "DRIVER", firstName: "Dedi", lastName: "Pratama", phoneNumber: "6281245678904", profilePicture: profilePict, identityNumber: "2014567894", motorcycleType: "Vario 125", plateNumber: "B 1234 ABC", storeId: 2, },
    { email: "driver22@example.com", shiftId: 2, workerRole: "DRIVER", firstName: "Mulyadi", lastName: "Pratama", phoneNumber: "6281245678904", profilePicture: profilePict, identityNumber: "2014567894", motorcycleType: "Vario 125", plateNumber: "B 1234 ABC", storeId: 2, },
    
    { email: "outletadmin3@example.com", shiftId: 1, workerRole: "OUTLET_ADMIN", firstName: "Dewi", lastName: "Lestari", phoneNumber: "6281345678900", profilePicture: profilePict, identityNumber: "3014567890", storeId: 3, },
    { email: "washingworker3@example.com", shiftId: 2, workerRole: "WASHING_WORKER", firstName: "Eko", lastName: "Susanto", phoneNumber: "6281345678901", profilePicture: profilePict, identityNumber: "3014567891", storeId: 3, },
    { email: "ironingworker3@example.com", shiftId: 1, workerRole: "IRONING_WORKER", firstName: "Lina", lastName: "Wulandari", phoneNumber: "6281345678902", profilePicture: profilePict, identityNumber: "3014567892", storeId: 3, },
    { email: "packingworker3@example.com", shiftId: 2, workerRole: "PACKING_WORKER", firstName: "Anton", lastName: "Rahman", phoneNumber: "6281345678903", profilePicture: profilePict, identityNumber: "3014567893", storeId: 3, },
    { email: "driver3@example.com", shiftId: 1, workerRole: "DRIVER", firstName: "Rizky", lastName: "Aditya", phoneNumber: "6281345678904", profilePicture: profilePict, identityNumber: "3014567894", motorcycleType: "Beat Street", plateNumber: "B 5678 DEF", storeId: 3, },
    { email: "driver33@example.com", shiftId: 1, workerRole: "DRIVER", firstName: "Aditya", lastName: "Sukma", phoneNumber: "6281345678904", profilePicture: profilePict, identityNumber: "3014567894", motorcycleType: "Beat Street", plateNumber: "B 5678 DEF", storeId: 3, },
    
    { email: "outletadmin4@example.com", shiftId: 2, workerRole: "OUTLET_ADMIN", firstName: "Rani", lastName: "Haryanto", phoneNumber: "6281445678900", profilePicture: profilePict, identityNumber: "4014567890", storeId: 4, },
    { email: "washingworker4@example.com", shiftId: 1, workerRole: "WASHING_WORKER", firstName: "Fajar", lastName: "Santoso", phoneNumber: "6281445678901", profilePicture: profilePict, identityNumber: "4014567891", storeId: 4, },
    { email: "ironingworker4@example.com", shiftId: 2, workerRole: "IRONING_WORKER", firstName: "Nia", lastName: "Anggraini", phoneNumber: "6281445678902", profilePicture: profilePict, identityNumber: "4014567892", storeId: 4, },
    { email: "packingworker4@example.com", shiftId: 1, workerRole: "PACKING_WORKER", firstName: "Hendra", lastName: "Gunawan", phoneNumber: "6281445678903", profilePicture: profilePict, identityNumber: "4014567893", storeId: 4, },
    { email: "driver4@example.com", shiftId: 2, workerRole: "DRIVER", firstName: "Agus", lastName: "Putra", phoneNumber: "6281445678904", profilePicture: profilePict, identityNumber: "4014567894", motorcycleType: "Mio M3", plateNumber: "B 6789 GHI", storeId: 4, },
    { email: "driver44@example.com", shiftId: 2, workerRole: "DRIVER", firstName: "Putra", lastName: "Gawan", phoneNumber: "6281445678904", profilePicture: profilePict, identityNumber: "4014567894", motorcycleType: "Mio M3", plateNumber: "B 6789 GHI", storeId: 4, },
    
    { email: "outletadmin5@example.com", shiftId: 1, workerRole: "OUTLET_ADMIN", firstName: "Mira", lastName: "Kartika", phoneNumber: "6281545678900", profilePicture: profilePict, identityNumber: "5014567890", storeId: 5, },
    { email: "washingworker5@example.com", shiftId: 2, workerRole: "WASHING_WORKER", firstName: "Deni", lastName: "Supriyadi", phoneNumber: "6281545678901", profilePicture: profilePict, identityNumber: "5014567891", storeId: 5, },
    { email: "ironingworker5@example.com", shiftId: 1, workerRole: "IRONING_WORKER", firstName: "Fira", lastName: "Widyaningrum", phoneNumber: "6281545678902", profilePicture: profilePict, identityNumber: "5014567892", storeId: 5, },
    { email: "packingworker5@example.com", shiftId: 2, workerRole: "PACKING_WORKER", firstName: "Bayu", lastName: "Pangestu", phoneNumber: "6281545678903", profilePicture: profilePict, identityNumber: "5014567893", storeId: 5, },
    { email: "driver5@example.com", shiftId: 1, workerRole: "DRIVER", firstName: "Iqbal", lastName: "Hakim", phoneNumber: "6281545678904", profilePicture: profilePict, identityNumber: "5014567894", motorcycleType: "NMAX", plateNumber: "B 8901 JKL", storeId: 5, },
    { email: "driver55@example.com", shiftId: 1, workerRole: "DRIVER", firstName: "Jarwo", lastName: "Kemal", phoneNumber: "6281545678904", profilePicture: profilePict, identityNumber: "5014567894", motorcycleType: "NMAX", plateNumber: "B 8901 JKL", storeId: 5, }
]

const dataItem = [
    { itemName: "Kaos" },
    { itemName: "Kemaja" },
    { itemName: "Celana Panjang" },
    { itemName: "Celana Pendek" },
    { itemName: "Jeans" },
    { itemName: "Handuk" },
    { itemName: "Sprei & Bed Cover" },
    { itemName: "Boneka" },
    { itemName: "Celana Dalam" },
    { itemName: "Bra" },
    { itemName: "Kaos Kaki" },
    { itemName: "Jaket" },
    { itemName: "Boneka" },
    { itemName: "Jas" },
    { itemName: "Gorden" },
    { itemName: "Karpet" },
    { itemName: "Guling" },
    { itemName: "Bantal" },
    { itemName: "Selimut" },
    { itemName: "Cadar" },
    { itemName: "Tas" },
]

const dataUser = [
    {
        email: "jonathan2323@gmail.com",
        firstName: "Jonathan",
        lastName: "Ezter",
        phoneNumber: "6285632325489",
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
        phoneNumber: "6285632343489",
        isVerified: true,
        profilePicture: profilePict,
        verifyCode: "sd486aa",
        isGoogleRegister: false,
        forgotPasswordToken: "68asd684a",
        isDiscountUsed: false,
        isGooglePasswordChange: false
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

module.exports = {
    dataOrderAndi, dataContactMessage, dataStore,
    dataWorker, dataItem, dataUser, dataOrderType, dataUserAddress
}