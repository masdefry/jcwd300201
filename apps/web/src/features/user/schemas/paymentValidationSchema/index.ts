import * as Yup from 'yup'

export const paymentValidationSchema = Yup.object().shape({
    images: Yup.mixed<File>()
        .required("File wajib dilampirkan.")
        .test("fileSize", "Maksimum ukuran file adalah 1MB.", file => {
                const maxSize = 1 * 1024 * 1024; 
                return file && file.size <= maxSize;
            }
        )
        .test(
            "fileFormat", "Format file tidak diizinkan. Hanya .jpg, .jpeg, .png, .gif.", file => {
                const allowedFormats = ["jpg", "jpeg", "png", "gif"];
                return file && allowedFormats.includes(file.type.split("/")[1]);
            }
        ),
});
