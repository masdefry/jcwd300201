import ButtonCustom from "@/components/core/button";
import { RiShutDownLine } from "react-icons/ri";
import HeaderMobile from "@/components/core/headerMobile";
import { FaUser, FaStore, FaEdit, FaTrashAlt, FaArrowLeft } from 'react-icons/fa';
import Image from "next/image";
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
import Link from "next/link";

const settingsItems = [
    { name: 'nama outlet', description: 'alamat outlet', icon: FaUser },
    { name: 'nama outlet', description: 'alamat outlet', icon: FaStore },
];

export default function Outlet() {
    return (
        <>
            <HeaderMobile />
            <main className="mx-8">
                <section className="flex gap-2 items-center bg-white font-bold w-full fixed pt-16 text-lg border-b-2 pb-4">
                    <Link href='/admin/settings'><FaArrowLeft /></Link> OUTLET
                </section>
                <div className="py-28 space-y-4">
                    {settingsItems.map((item, index) => (
                        <div
                            key={index}
                            className="flex items-center justify-between bg-white py-4 px-2 rounded-lg shadow-sm transition-all duration-200 hover:bg-gray-100"
                        >
                            <div className="flex items-center">
                                <div className="flex-shrink-0 p-1 bg-orange-400 rounded-lg">
                                    <Image
                                        src="https://img.freepik.com/premium-vector/shopping-store-building-icon-vector_620118-14.jpg?semt=ais_hybrid"
                                        alt="store"
                                        height={200}
                                        width={200}
                                        className="h-10 w-10 rounded-lg object-cover"
                                    />
                                </div>
                                <div className="ml-2">
                                    <h2 className="font-medium text-gray-900">{item.name}</h2>
                                    <p className="text-xs text-gray-500">{item.description}</p>
                                    <p className="text-xs text-gray-500">+62 8464654653515</p>
                                </div>
                            </div>

                            <div className="flex space-x-1">
                                <button className="flex items-center space-x-2 px-2 py-2 bg-yellow-500 hover:bg-yellow-600 text-white font-semibold rounded-lg">
                                    <FaEdit />
                                </button>

                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <div className="flex items-center space-x-2 px-2 py-2 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg">
                                            <FaTrashAlt />
                                        </div>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>Hapus "Nama Outlet"?</AlertDialogTitle>
                                            <AlertDialogDescription>
                                                Semua data yang berkaitan dengan outlet ini akan ikut terhapus.
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel>Batal</AlertDialogCancel>
                                            <AlertDialogAction>Hapus</AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            </div>
                        </div>
                    ))}
                </div>
            </main>
        </>
    );

}