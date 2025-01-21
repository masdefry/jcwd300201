export interface IWorker {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    workerRole: string;
    profilePicture: string;
    identityNumber?: string;
    motorcycleType?: string;
    plateNumber?: string;
    createdAt: string;
    updatedAt: string;
    deletedAt?: string | null;
}
