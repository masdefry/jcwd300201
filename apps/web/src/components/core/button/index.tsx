import { ReactNode } from "react";

interface IButtonProps {
    width?: string
    btnColor?: string
    txtColor?: string
    disabled?: boolean
    onClick?: () => void
    type?: 'button' | 'submit' | 'reset'
    children: ReactNode
    rounded?: string
    py?: string
    disabledBtn?: string
}

export default function ButtonCustom({
    width = 'w-fit',
    btnColor = 'bg-black hover:bg-neutral-800',
    txtColor = 'text-white',
    children,
    disabled,
    onClick,
    disabledBtn = 'disabled:bg-neutral-400',
    py = 'py-2',
    rounded = 'rounded-lg',
    type }: IButtonProps) {
    return (
        <button onClick={onClick} className={`${width} focus:outline-none
        transform active:scale-90 active:ring-4 active:ring-white active:ring-opacity-30
        relative overflow-hidden group transition-all duration-300 px-5 ${py} ${disabledBtn} 
        flex items-center text-center justify-center disabled:scale-100 disabled:ring-0 disabled:pointer-events-none
         ${btnColor} ${rounded} ${txtColor}`} disabled={disabled} type={type}>
            {children}
            {!disabled && (<span className="absolute inset-0 w-full h-full bg-white opacity-0 transform scale-0 group-hover:opacity-30 group-hover:scale-110 transition-all duration-300 rounded-full"></span>)}
        </button>
    );
}