export interface IAuthStore {
    token: string,
    firstName: string
    lastName: string,
    email: string,
    role: string, 
    isVerified: boolean, 
    profilePicture: string, 
    isDiscountUsed: boolean, 
    totalWorker: number | null, 
    orders: number | null,
    store: string
}