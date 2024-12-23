import multer from "multer";

/* on local images */
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'src/public/images')
    },
    filename: (req, file, cb) => {
        const splitOriginalName = file.originalname.split('.')
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, file.fieldname + '-' + uniqueSuffix + '.' + splitOriginalName[splitOriginalName.length - 1])
    }
})

/* Filtering extension */
const fileFilter = (req: any, file: any, cb: any) => {
    const extensionAccepted = ['jpg', 'png', 'jpeg', 'webp', 'svg']

    const imagesExt = file.originalname.split('.')
    if (!extensionAccepted.includes(imagesExt[imagesExt.length - 1])) {
        return cb(new Error('Format file tidak sesuai'))
    }

    return cb(null, true)
}

/* Set Uploader */
export const uploadMulter = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 5000000 }
})