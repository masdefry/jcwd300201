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
    disabled, children, onClick }: IConfirmAlert) {

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                {children}
            </AlertDialogTrigger>
            < AlertDialogContent >
                <AlertDialogHeader>
                    <AlertDialogTitle>Apakah anda yakin ingin {caption}?</AlertDialogTitle>
                    <AlertDialogDescription>
                        {description}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                < AlertDialogFooter >
                    <AlertDialogCancel>{btnCancelCaption}</AlertDialogCancel>
                    <AlertDialogAction className="bg-red-600 hover:bg-red-700" onClick={onClick} disabled={disabled}>{btnConfrimCaption}</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
