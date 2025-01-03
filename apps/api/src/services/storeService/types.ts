export interface IGetAllStore {
    search: string,
    sort: string,
    take: number,
    skip: number,
    limit: string,
}

export interface IStoreMap {
    id: string
    storeName: string
    address: string
    city: string
    province: string
    country: string
    zipCode: string
    latitude: number
    longitude: number
    createdAt: Date
    updatedAt: Date
    deletedAt: Date | null
}

export interface IUpdateStore {
    storeName: string
    address: string
    city: string
    province: string
    zipCode: string
    latitude: string
    longitude: string
    outletId: string
}

export interface ICreateStore {
    storeName: string,
    address: string,
    province: string,
    city: string,
    zipCode: string,
    latitude: string,
    longitude: string
}