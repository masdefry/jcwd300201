import { Role } from "@prisma/client";

export interface ILoginBody {
    email: string,
    password: string
}

export interface ICreateWorkerService {
    email: string,
    firstName: string,
    lastName: string,
    phoneNumber: string,
    workerRole: Role,
    identityNumber: string,
    storesId: string,
    motorcycleType: string, 
    plateNumber: string
}