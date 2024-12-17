import { ReactNode } from "react";

export interface IConfirmAlert {
    btnCancelCaption?: string,
    btnConfrimCaption?: string,
    caption: string,
    children: ReactNode,
    onClick: () => void,
    description?: string,
    colorConfirmation?:string,
    disabled?: boolean,
    type?: "button" | "submit" | "reset",
    hideButtons?: boolean
    hideCaption?:boolean
}