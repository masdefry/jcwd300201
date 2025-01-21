export interface IUser {
    id: string;
    firstName: string;
    lastName: string;
    profilePicture: string;
}

export interface IMessage {
    id: string;
    createdAt: string; 
    email: string;
    phoneNumber: string;
    textHelp: string; 
    User: IUser; 
}