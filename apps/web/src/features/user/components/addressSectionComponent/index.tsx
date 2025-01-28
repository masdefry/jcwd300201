'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { IAddress, IAddressPopUpDialogProps } from './type';


export const AddressPopUpDialog = ({ setUserAddress, handleAddressSelect, dataAllAddress, dataAllAddressLoading, openDialog, setOpenDialog }: IAddressPopUpDialogProps) => (
    <Dialog open={openDialog} onOpenChange={(open) => setOpenDialog(open)}>
        <DialogTrigger className="hidden"></DialogTrigger>
        <DialogContent className="w-[90%] md:w-[60%] max-w-md">
            <DialogHeader>
                <DialogTitle>Pilih Alamat</DialogTitle>
            </DialogHeader>
            <div className="space-y-2">
                {dataAllAddressLoading ? (
                    <div className="border border-gray-300 p-4 rounded-lg bg-gray-50">
                        <span className="text-gray-500">Memuat alamat...</span>
                    </div>
                ) : dataAllAddress && dataAllAddress.length > 0 ? (
                    dataAllAddress.map((address: IAddress) => (
                        <div
                            key={address.id}
                            className="border p-3 rounded-lg bg-gray-100 cursor-pointer hover:bg-gray-200"
                            onClick={() => { handleAddressSelect(address), setUserAddress(address.id) }}
                        >
                            <p className="font-semibold">{address?.addressName}</p>
                            <p className="text-gray-600">{address?.addressDetail}</p>
                            <p className="text-gray-600">{address?.city} {address?.province}</p>
                        </div>
                    ))
                ) : (
                    <span className="text-gray-500">Tidak ada alamat tersedia.</span>
                )}
            </div>
        </DialogContent>
    </Dialog>
)

