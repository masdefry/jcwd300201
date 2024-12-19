export interface IUpdateProfileWorker {
    userId: string
    email: string
    phoneNumber: string
    firstName: string
    lastName: string
    imageUploaded: any
}

export interface IChangePasswordWorker {
    userId: string
    password: string
    existingPassword: string
}

export interface ICreateNotes {
    email: string
    notes: string
    orderId: string
}

export interface IGetAllWorker {
    whereClause: any
    take: number
    skip: number
}

export interface IGetLaundryItems {
    page?: string;
    limit?: string;
    search?: string;
    sort?: string;
}