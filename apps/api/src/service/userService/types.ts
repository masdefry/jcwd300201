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