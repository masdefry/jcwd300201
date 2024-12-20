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

export interface ICreateAddressUser {
    userId: string
    addressName: string
    addressDetail: string
    province: string
    city: string
    zipCode: string
    latitude: string
    longitude: string
    country: string
}

export interface IEditAddressUser {
    addressId: string
    addressName: string
    addressDetail: string
    province: string
    city: string
    zipCode: string
    latitude: string
    longitude: string
    country: string
    userId: string
}

export interface IUpdateProfileUser {
    userId: string
    email: string
    phoneNumber: string
    firstName: string
    lastName: string
    imageUploaded: any
}