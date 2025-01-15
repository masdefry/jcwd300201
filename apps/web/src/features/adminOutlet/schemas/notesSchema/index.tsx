import * as Yup from 'yup'


export const notesSchema = Yup.object({
        notes: Yup.string().required("Harap diisi terlebih dahulu"),
    })