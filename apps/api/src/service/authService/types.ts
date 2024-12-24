import { Role } from "@prisma/client";

export interface ILoginBody {
    email: string,
    password: string
}

export interface IRegisterBody {
    id: string,
    email: string,
    firstName: string,
    lastName: string,
    phoneNumber: string,
    verifyCode: string,
}

export interface ILoginBody {
    email: string,
    password: string
}

export interface ICreateWorkerService {
    id: string,
    email: string,
    firstName: string,
    lastName: string,
    phoneNumber: string,
    workerRole: Role,
    identityNumber: string,
    storeId: string,
    motorcycleType: string, 
    plateNumber: string
    shiftId: number
}