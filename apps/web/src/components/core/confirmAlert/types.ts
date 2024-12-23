import { ReactNode } from "react";

export interface IConfirmAlert {
    btnCancelCaption?: string,
    btnConfrimCaption?: string,
    caption: string,
    children: ReactNode,
    onClick: () => void,
    description?: string | ReactNode,
    colorConfirmation?: string,
    disabled?: boolean,
    type?: "button" | "submit" | "reset",
    hideButtons?: boolean
    hideAllButtons?: boolean
    hideCaption?: boolean
    hoverColorConfirmation?: string
}