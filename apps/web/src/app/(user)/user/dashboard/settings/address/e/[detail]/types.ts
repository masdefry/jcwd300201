export interface IAddressDetail {
    addressName: String,
    addressDetail: String,
    province: String,
    city: String,
    zipCode: String,
    latitude: String,
    longitude: String
}

export interface IAddressFormValues {
    addressName: string
    addressDetail: string
    province: string
    city: string
    zipCode: string
    latitude: string
    longitude: string
}

export interface IPosition {
    lat: number;
    lng: number;
}

export interface ILocationPicker {
    setFieldValue: any
    position: IPosition
    setPosition: React.Dispatch<React.SetStateAction<IPosition>>
}