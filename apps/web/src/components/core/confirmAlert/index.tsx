import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { IConfirmAlert } from "./types"

export function ConfirmAlert({ caption, btnConfrimCaption = 'Konfirmasi', btnCancelCaption = 'Batal',
    description = 'Anda akan keluar dari aplikasi. Pastikan semua perubahan telah disimpan sebelum melanjutkan.',
    children, onClick, disabled, type = 'submit', hideButtons = false, colorConfirmation = 'red' }: IConfirmAlert) {

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                {children}
            </AlertDialogTrigger>
            < AlertDialogContent >
                <AlertDialogHeader>
                        <AlertDialogTitle>{caption}</AlertDialogTitle>
                    <AlertDialogDescription>
                        {description}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>{btnCancelCaption}</AlertDialogCancel>
                {!hideButtons && (
                        <AlertDialogAction
                            disabled={disabled}
                            type={type}
                            className={`bg-${colorConfirmation}-600 hover:bg-${colorConfirmation}-700`}
                            onClick={onClick}
                        >
                            {btnConfrimCaption}
                        </AlertDialogAction>
                )}
                    </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
