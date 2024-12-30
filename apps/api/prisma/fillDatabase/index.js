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
    { totalPrice: 200000, deliveryFee: 45000, discount: 0, isPaid: false, isProcessed: false, isDone: false, isReqDelivery: false, isConfirm: false, isSolved: false, notes: null, storeId: "1", orderTypeId: 1, userAddressId: 10, orderStatus: { create: { status: 'AWAITING_DRIVER_PICKUP', createdAt: new Date('2024-02-07') } }, createdAt: new Date('2024-02-07') },
    { totalPrice: 200000, deliveryFee: 75000, discount: 0, isPaid: false, isProcessed: false, isDone: false, isReqDelivery: false, isConfirm: false, isSolved: false, notes: null, storeId: "1", orderTypeId: 1, userAddressId: 10, orderStatus: { create: { status: 'AWAITING_DRIVER_PICKUP', createdAt: new Date('2024-02-18') } }, createdAt: new Date('2024-02-18') },
    { totalPrice: 200000, deliveryFee: 85000, discount: 0, isPaid: false, isProcessed: false, isDone: false, isReqDelivery: false, isConfirm: false, isSolved: false, notes: null, storeId: "1", orderTypeId: 1, userAddressId: 10, orderStatus: { create: { status: 'AWAITING_DRIVER_PICKUP', createdAt: new Date('2024-02-25') } }, createdAt: new Date('2024-02-25') },
    { totalPrice: 200000, deliveryFee: 25000, discount: 0, isPaid: false, isProcessed: false, isDone: false, isReqDelivery: false, isConfirm: false, isSolved: false, notes: null, storeId: "1", orderTypeId: 1, userAddressId: 10, orderStatus: { create: { status: 'AWAITING_DRIVER_PICKUP', createdAt: new Date('2024-03-03') } }, createdAt: new Date('2024-03-03') },
    { totalPrice: 200000, deliveryFee: 45000, discount: 0, isPaid: false, isProcessed: false, isDone: false, isReqDelivery: false, isConfirm: false, isSolved: false, notes: null, storeId: "1", orderTypeId: 1, userAddressId: 10, orderStatus: { create: { status: 'AWAITING_DRIVER_PICKUP', createdAt: new Date('2024-03-10') } }, createdAt: new Date('2024-03-10') },
    { totalPrice: 200000, deliveryFee: 35000, discount: 0, isPaid: false, isProcessed: false, isDone: false, isReqDelivery: false, isConfirm: false, isSolved: false, notes: null, storeId: "1", orderTypeId: 1, userAddressId: 10, orderStatus: { create: { status: 'AWAITING_DRIVER_PICKUP', createdAt: new Date('2024-03-17') } }, createdAt: new Date('2024-03-17') },
    { totalPrice: 200000, deliveryFee: 67000, discount: 0, isPaid: false, isProcessed: false, isDone: false, isReqDelivery: false, isConfirm: false, isSolved: false, notes: null, storeId: "1", orderTypeId: 1, userAddressId: 10, orderStatus: { create: { status: 'AWAITING_DRIVER_PICKUP', createdAt: new Date('2024-03-21') } }, createdAt: new Date('2024-03-21') },
    { totalPrice: 200000, deliveryFee: 67000, discount: 0, isPaid: false, isProcessed: false, isDone: false, isReqDelivery: false, isConfirm: false, isSolved: false, notes: null, storeId: "1", orderTypeId: 1, userAddressId: 10, orderStatus: { create: { status: 'AWAITING_DRIVER_PICKUP', createdAt: new Date('2024-04-21') } }, createdAt: new Date('2024-04-21') },
    { totalPrice: 200000, deliveryFee: 67000, discount: 0, isPaid: false, isProcessed: false, isDone: false, isReqDelivery: false, isConfirm: false, isSolved: false, notes: null, storeId: "1", orderTypeId: 1, userAddressId: 10, orderStatus: { create: { status: 'AWAITING_DRIVER_PICKUP', createdAt: new Date('2024-04-22') } }, createdAt: new Date('2024-04-22') },
    { totalPrice: 200000, deliveryFee: 67000, discount: 0, isPaid: false, isProcessed: false, isDone: false, isReqDelivery: false, isConfirm: false, isSolved: false, notes: null, storeId: "1", orderTypeId: 1, userAddressId: 10, orderStatus: { create: { status: 'AWAITING_DRIVER_PICKUP', createdAt: new Date('2024-05-05') } }, createdAt: new Date('2024-05-05') },
    { totalPrice: 200000, deliveryFee: 67000, discount: 0, isPaid: false, isProcessed: false, isDone: false, isReqDelivery: false, isConfirm: false, isSolved: false, notes: null, storeId: "1", orderTypeId: 1, userAddressId: 10, orderStatus: { create: { status: 'AWAITING_DRIVER_PICKUP', createdAt: new Date('2024-06-20') } }, createdAt: new Date('2024-06-20') },
    { totalPrice: 200000, deliveryFee: 67000, discount: 0, isPaid: false, isProcessed: false, isDone: false, isReqDelivery: false, isConfirm: false, isSolved: false, notes: null, storeId: "1", orderTypeId: 1, userAddressId: 10, orderStatus: { create: { status: 'AWAITING_DRIVER_PICKUP', createdAt: new Date('2024-07-21') } }, createdAt: new Date('2024-07-21') },
    { totalPrice: 200000, deliveryFee: 67000, discount: 0, isPaid: false, isProcessed: false, isDone: false, isReqDelivery: false, isConfirm: false, isSolved: false, notes: null, storeId: "1", orderTypeId: 1, userAddressId: 10, orderStatus: { create: { status: 'AWAITING_DRIVER_PICKUP', createdAt: new Date('2024-08-16') } }, createdAt: new Date('2024-08-16') },
    { totalPrice: 200000, deliveryFee: 67000, discount: 0, isPaid: false, isProcessed: false, isDone: false, isReqDelivery: false, isConfirm: false, isSolved: false, notes: null, storeId: "1", orderTypeId: 1, userAddressId: 10, orderStatus: { create: { status: 'AWAITING_DRIVER_PICKUP', createdAt: new Date('2024-09-02') } }, createdAt: new Date('2024-09-02') },
    { totalPrice: 200000, deliveryFee: 67000, discount: 0, isPaid: false, isProcessed: false, isDone: false, isReqDelivery: false, isConfirm: false, isSolved: false, notes: null, storeId: "1", orderTypeId: 1, userAddressId: 10, orderStatus: { create: { status: 'AWAITING_DRIVER_PICKUP', createdAt: new Date('2024-10-05') } }, createdAt: new Date('2024-10-05') },
    { totalPrice: 200000, deliveryFee: 67000, discount: 0, isPaid: false, isProcessed: false, isDone: false, isReqDelivery: false, isConfirm: false, isSolved: false, notes: null, storeId: "1", orderTypeId: 1, userAddressId: 10, orderStatus: { create: { status: 'AWAITING_DRIVER_PICKUP', createdAt: new Date('2024-11-05') } }, createdAt: new Date('2024-11-05') },
    { totalPrice: 200000, deliveryFee: 42000, discount: 0, isPaid: false, isProcessed: false, isDone: false, isReqDelivery: false, isConfirm: false, isSolved: false, notes: null, storeId: "1", orderTypeId: 1, userAddressId: 10, orderStatus: { create: { status: 'AWAITING_DRIVER_PICKUP', createdAt: new Date() } }, createdAt: new Date() },
    { totalPrice: 200000, deliveryFee: 42000, discount: 0, isPaid: false, isProcessed: false, isDone: false, isReqDelivery: false, isConfirm: false, isSolved: false, notes: null, storeId: "1", orderTypeId: 1, userAddressId: 10, orderStatus: { create: { status: 'AWAITING_DRIVER_PICKUP', createdAt: new Date() } }, createdAt: new Date() },
    { totalPrice: 200000, deliveryFee: 42000, discount: 0, isPaid: false, isProcessed: false, isDone: false, isReqDelivery: false, isConfirm: false, isSolved: false, notes: null, storeId: "1", orderTypeId: 1, userAddressId: 10, orderStatus: { create: { status: 'AWAITING_DRIVER_PICKUP', createdAt: new Date() } }, createdAt: new Date() },
    { totalPrice: 200000, deliveryFee: 42000, discount: 0, isPaid: false, isProcessed: false, isDone: false, isReqDelivery: false, isConfirm: false, isSolved: false, notes: null, storeId: "1", orderTypeId: 1, userAddressId: 10, orderStatus: { create: { status: 'AWAITING_DRIVER_PICKUP', createdAt: new Date() } }, createdAt: new Date() },
    { totalPrice: 200000, deliveryFee: 42000, discount: 0, isPaid: false, isProcessed: false, isDone: false, isReqDelivery: false, isConfirm: false, isSolved: false, notes: null, storeId: "1", orderTypeId: 1, userAddressId: 10, orderStatus: { create: { status: 'AWAITING_DRIVER_PICKUP', createdAt: new Date() } }, createdAt: new Date() },
    { totalPrice: 200000, deliveryFee: 42000, discount: 0, isPaid: false, isProcessed: false, isDone: false, isReqDelivery: false, isConfirm: false, isSolved: false, notes: null, storeId: "1", orderTypeId: 1, userAddressId: 10, orderStatus: { create: { status: 'AWAITING_DRIVER_PICKUP', createdAt: new Date() } }, createdAt: new Date() },
    { totalPrice: 200000, deliveryFee: 42000, discount: 0, isPaid: false, isProcessed: false, isDone: false, isReqDelivery: false, isConfirm: false, isSolved: false, notes: null, storeId: "1", orderTypeId: 1, userAddressId: 10, orderStatus: { create: { status: 'AWAITING_DRIVER_PICKUP', createdAt: new Date() } }, createdAt: new Date() },
    { totalPrice: 200000, deliveryFee: 46000, discount: 0, isPaid: false, isProcessed: false, isDone: false, isReqDelivery: false, isConfirm: false, isSolved: false, notes: null, storeId: "1", orderTypeId: 1, userAddressId: 10, orderStatus: { create: { status: 'AWAITING_DRIVER_PICKUP', createdAt: new Date() } }, createdAt: new Date() },
]

const dataContactMessage = [
    { name: "Andi Saputra", email: "andisaputra@cnc.com", phoneNumber: "081742107412", textHelp: "Halo Admin, Bisakah anda membantu menjelaskan cara ordernya?" },
    { name: "Budi Santoso", email: "budisantoso@cnc.com", phoneNumber: "081742107413", textHelp: "Halo Admin, Apakah ada panduan penggunaan layanan?" },
    { name: "Citra Maharani", email: "citramaharani@cnc.com", phoneNumber: "081742107414", textHelp: "Halo Admin, Bagaimana cara saya mengubah metode pembayaran?" },
    { name: "Dewi Anggraeni", email: "dewianggraeni@cnc.com", phoneNumber: "081742107415", textHelp: "Halo Admin, Apakah pengiriman tersedia ke luar negeri?" },
    { name: "Eka Pratama", email: "ekapratama@cnc.com", phoneNumber: "081742107416", textHelp: "Halo Admin, Berapa lama proses refund biasanya?" },
    { name: "Fajar Setiawan", email: "fajarsetiawan@cnc.com", phoneNumber: "081742107417", textHelp: "Halo Admin, Bisakah saya mendapatkan katalog produk terbaru?" },
    { name: "Gita Pertiwi", email: "gitapertiwi@cnc.com", phoneNumber: "081742107418", textHelp: "Halo Admin, Apakah ada garansi untuk produk yang saya beli?" },
    { name: "Hadi Susilo", email: "hadisusilo@cnc.com", phoneNumber: "081742107419", textHelp: "Halo Admin, Bagaimana saya melaporkan masalah teknis pada layanan ini?" },
    { name: "Indah Lestari", email: "indahlestari@cnc.com", phoneNumber: "081742107420", textHelp: "Halo Admin, Apakah ada nomor WhatsApp untuk dukungan pelanggan?" },
    { name: "Joko Agus", email: "jokgus@cnc.com", phoneNumber: "081742107421", textHelp: "Halo Admin, Bagaimana cara mendapatkan invoice untuk transaksi saya?" },
    { name: "Kartini Dewi", email: "kartinidewi@cnc.com", phoneNumber: "081742107422", textHelp: "Halo Admin, Apakah layanan ini tersedia selama liburan?" },
    { name: "Lukman Hakim", email: "lukmanhakim@cnc.com", phoneNumber: "081742107423", textHelp: "Halo Admin, Saya ingin tahu lebih banyak tentang fitur premium." }
];

const dataStore = [
    { id: 1, storeName: 'CNC - Tangerang', address: 'Ruko Gading Serpong Boulevard, Jl. Gading Serpong Boulevard No.AA3/19', city: 'Tangerang', province: 'Banten', country: 'Indonesia', zipCode: '15810', latitude: -6.23348808466673, longitude: 106.63212601890415 },
    { id: 2, storeName: 'CNC - Jakarta', address: 'Jl. Sudirman No. 123, Blok A', city: 'Jakarta', province: 'DKI Jakarta', country: 'Indonesia', zipCode: '10210', latitude: -6.2088, longitude: 106.8456 },
    { id: 3, storeName: 'CNC - Bandung', address: 'Jl. Dago No. 45', city: 'Bandung', province: 'Jawa Barat', country: 'Indonesia', zipCode: '40135', latitude: -6.9147, longitude: 107.6098 },
    { id: 4, storeName: 'CNC - Surabaya', address: 'Jl. Basuki Rahmat No. 87', city: 'Surabaya', province: 'Jawa Timur', country: 'Indonesia', zipCode: '60271', latitude: -7.2504, longitude: 112.7688 },
    { id: 5, storeName: 'CNC - Medan', address: 'Jl. Gatot Subroto No. 32', city: 'Medan', province: 'Sumatera Utara', country: 'Indonesia', zipCode: '20112', latitude: 3.5952, longitude: 98.6722 },
]

const dataWorker = [
    { email: 'superadmin@cnc.com', shiftId: 1, workerRole: 'SUPER_ADMIN', firstName: 'Andi', lastName: 'Saputra', phoneNumber: '08123123124', profilePicture: profilePict, identityNumber: '302138124', storeId: 1 },
    { email: 'admin@cnc.com', shiftId: 1, workerRole: 'SUPER_ADMIN', firstName: 'Mark', lastName: 'Sumenep', phoneNumber: '081233463124', profilePicture: profilePict, identityNumber: '302162424', storeId: 1 },

    { email: "outletadmin@example.com", shiftId: 1, workerRole: "OUTLET_ADMIN", firstName: "Budi", lastName: "Santoso", phoneNumber: "081234567890", profilePicture: profilePict, identityNumber: "1234567890", storeId: 1 },
    { email: "washingworker@example.com", shiftId: 1, workerRole: "WASHING_WORKER", firstName: "Siti", lastName: "Aminah", phoneNumber: "081234567891", profilePicture: profilePict, identityNumber: "1234567891", storeId: 1 },
    { email: "ironingworker@example.com", shiftId: 1, workerRole: "IRONING_WORKER", firstName: "Joko", lastName: "Pratama", phoneNumber: "081234567892", profilePicture: profilePict, identityNumber: "1234567892", storeId: 1 },
    { email: "packingworker@example.com", shiftId: 1, workerRole: "PACKING_WORKER", firstName: "Ani", lastName: "Wijaya", phoneNumber: "081234567893", profilePicture: profilePict, identityNumber: "1234567893", storeId: 1 },
    { email: "driver@example.com", shiftId: 1, workerRole: "DRIVER", firstName: "Ahmad", lastName: "Subroto", phoneNumber: "081234567894", profilePicture: profilePict, identityNumber: "1234567894", motorcycleType: 'Ninja 4 tak', plateNumber: "B 666 DEV", storeId: 1 },

    { email: "outletadmin2@example.com", shiftId: 1, workerRole: "OUTLET_ADMIN", firstName: "Budi", lastName: "Santoso", phoneNumber: "081234567890", profilePicture: profilePict, identityNumber: "1234567890", storeId: 5 },
    { email: "washingworker2@example.com", shiftId: 2, workerRole: "WASHING_WORKER", firstName: "Siti", lastName: "Aminah", phoneNumber: "081234567891", profilePicture: profilePict, identityNumber: "1234567891", storeId: 5 },
    { email: "ironingworke2@example.com", shiftId: 1, workerRole: "IRONING_WORKER", firstName: "Joko", lastName: "Pratama", phoneNumber: "081234567892", profilePicture: profilePict, identityNumber: "1234567892", storeId: 5 },
    { email: "packingworker2@example.com", shiftId: 2, workerRole: "PACKING_WORKER", firstName: "Ani", lastName: "Wijaya", phoneNumber: "081234567893", profilePicture: profilePict, identityNumber: "1234567893", storeId: 5 },
    { email: "driver2@example.com", shiftId: 1, workerRole: "DRIVER", firstName: "Ahmad", lastName: "Subroto", phoneNumber: "081234567894", profilePicture: profilePict, identityNumber: "1234567894", motorcycleType: 'Ninja 4 tak', plateNumber: "B 666 DEV", storeId: 2 },
    { email: "outletadmin2@example.com", shiftId: 2, workerRole: "OUTLET_ADMIN", firstName: "Rina", lastName: "Saputra", phoneNumber: "081245678900", profilePicture: profilePict, identityNumber: "2014567890", storeId: 2, },
    { email: "washingworker2@example.com", shiftId: 1, workerRole: "WASHING_WORKER", firstName: "Yudi", lastName: "Kusuma", phoneNumber: "081245678901", profilePicture: profilePict, identityNumber: "2014567891", storeId: 2, },
    { email: "ironingworker2@example.com", shiftId: 2, workerRole: "IRONING_WORKER", firstName: "Sari", lastName: "Andini", phoneNumber: "081245678902", profilePicture: profilePict, identityNumber: "2014567892", storeId: 2, },
    { email: "packingworker2@example.com", shiftId: 1, workerRole: "PACKING_WORKER", firstName: "Bambang", lastName: "Wijaya", phoneNumber: "081245678903", profilePicture: profilePict, identityNumber: "2014567893", storeId: 2, },
    { email: "driver2@example.com", shiftId: 2, workerRole: "DRIVER", firstName: "Dedi", lastName: "Pratama", phoneNumber: "081245678904", profilePicture: profilePict, identityNumber: "2014567894", motorcycleType: "Vario 125", plateNumber: "B 1234 ABC", storeId: 2, },
    { email: "outletadmin3@example.com", shiftId: 1, workerRole: "OUTLET_ADMIN", firstName: "Dewi", lastName: "Lestari", phoneNumber: "081345678900", profilePicture: profilePict, identityNumber: "3014567890", storeId: 3, },
    { email: "washingworker3@example.com", shiftId: 2, workerRole: "WASHING_WORKER", firstName: "Eko", lastName: "Susanto", phoneNumber: "081345678901", profilePicture: profilePict, identityNumber: "3014567891", storeId: 3, },
    { email: "ironingworker3@example.com", shiftId: 1, workerRole: "IRONING_WORKER", firstName: "Lina", lastName: "Wulandari", phoneNumber: "081345678902", profilePicture: profilePict, identityNumber: "3014567892", storeId: 3, },
    { email: "packingworker3@example.com", shiftId: 2, workerRole: "PACKING_WORKER", firstName: "Anton", lastName: "Rahman", phoneNumber: "081345678903", profilePicture: profilePict, identityNumber: "3014567893", storeId: 3, },
    { email: "driver3@example.com", shiftId: 1, workerRole: "DRIVER", firstName: "Rizky", lastName: "Aditya", phoneNumber: "081345678904", profilePicture: profilePict, identityNumber: "3014567894", motorcycleType: "Beat Street", plateNumber: "B 5678 DEF", storeId: 3, },
    { email: "outletadmin4@example.com", shiftId: 2, workerRole: "OUTLET_ADMIN", firstName: "Rani", lastName: "Haryanto", phoneNumber: "081445678900", profilePicture: profilePict, identityNumber: "4014567890", storeId: 4, },
    { email: "washingworker4@example.com", shiftId: 1, workerRole: "WASHING_WORKER", firstName: "Fajar", lastName: "Santoso", phoneNumber: "081445678901", profilePicture: profilePict, identityNumber: "4014567891", storeId: 4, },
    { email: "ironingworker4@example.com", shiftId: 2, workerRole: "IRONING_WORKER", firstName: "Nia", lastName: "Anggraini", phoneNumber: "081445678902", profilePicture: profilePict, identityNumber: "4014567892", storeId: 4, },
    { email: "packingworker4@example.com", shiftId: 1, workerRole: "PACKING_WORKER", firstName: "Hendra", lastName: "Gunawan", phoneNumber: "081445678903", profilePicture: profilePict, identityNumber: "4014567893", storeId: 4, },
    { email: "driver4@example.com", shiftId: 2, workerRole: "DRIVER", firstName: "Agus", lastName: "Putra", phoneNumber: "081445678904", profilePicture: profilePict, identityNumber: "4014567894", motorcycleType: "Mio M3", plateNumber: "B 6789 GHI", storeId: 4, },
    { email: "outletadmin5@example.com", shiftId: 1, workerRole: "OUTLET_ADMIN", firstName: "Mira", lastName: "Kartika", phoneNumber: "081545678900", profilePicture: profilePict, identityNumber: "5014567890", storeId: 5, },
    { email: "washingworker5@example.com", shiftId: 2, workerRole: "WASHING_WORKER", firstName: "Deni", lastName: "Supriyadi", phoneNumber: "081545678901", profilePicture: profilePict, identityNumber: "5014567891", storeId: 5, },
    { email: "ironingworker5@example.com", shiftId: 1, workerRole: "IRONING_WORKER", firstName: "Fira", lastName: "Widyaningrum", phoneNumber: "081545678902", profilePicture: profilePict, identityNumber: "5014567892", storeId: 5, },
    { email: "packingworker5@example.com", shiftId: 2, workerRole: "PACKING_WORKER", firstName: "Bayu", lastName: "Pangestu", phoneNumber: "081545678903", profilePicture: profilePict, identityNumber: "5014567893", storeId: 5, },
    { email: "driver5@example.com", shiftId: 1, workerRole: "DRIVER", firstName: "Iqbal", lastName: "Hakim", phoneNumber: "081545678904", profilePicture: profilePict, identityNumber: "5014567894", motorcycleType: "NMAX", plateNumber: "B 8901 JKL", storeId: 5, }
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