export interface ILoginBody {
    email: string,
    password: string
}

export interface IRegisterBody {
    email: string,
    password: string,
    firstName: string,
    lastName: string,
    phoneNumber: string,
    verifyCode: string,
}