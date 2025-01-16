interface IUser {
    firstName: string;
    lastName: string;
    profilePicture: string;
}

interface IMessage {
    User: IUser;
    createdAt: string;
    email: string;
    phoneNumber: string;
    textHelp: string;
}


export interface IContactMobile {
    message: IMessage;
    formatDistanceToNow: any;
    messageWhatsapp: string;
    id: any;
    i: number;
}
