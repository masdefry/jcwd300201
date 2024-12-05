import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardFooter,
} from "@/components/ui/card"

import { FaEdit, FaTrashAlt } from 'react-icons/fa';

import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"
import HeaderMobile from "@/components/core/headerMobile"
import { FaArrowLeft } from 'react-icons/fa';
import Link from "next/link"
import * as React from "react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
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
import LocationAndSearch from "@/features/workerData/components/locationAndSearch";

export default function Worker() {
    return (
        <main className="w-full h-fit">
            <section className="w-full h-fit ">
                <HeaderMobile />
                <main className="w-fit mx-8">
                    <section className="flex gap-2 items-center bg-white font-bold w-full fixed pt-16 text-lg border-b-2 pb-4">
                        <Link href='/admin/settings'><FaArrowLeft /></Link> PEKERJA
                    </section>
                    <div className="py-28 space-y-4">
                        <Tabs defaultValue="semua" className="fit">
                            <TabsList className="grid w-full grid-cols-3">
                                <TabsTrigger value="semua">Semua</TabsTrigger>
                                <TabsTrigger value="pekerja">Pekerja</TabsTrigger>
                                <TabsTrigger value="driver">Driver</TabsTrigger>
                            </TabsList>
                            <TabsContent value="semua">
                                <Card>
                                    <CardContent className="space-y-2 pt-4">
                                        <LocationAndSearch/>
                                        <section className="flex justify-between items-center">
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0 p-1">
                                                    <Avatar>
                                                        <AvatarImage src="https://github.com/shadcn.png" />
                                                        <AvatarFallback>CN</AvatarFallback>
                                                    </Avatar>
                                                </div>
                                                <div className="ml-2">
                                                    <h2 className="font-medium text-gray-900">Nama Pekerja</h2>
                                                    <p className="text-xs text-gray-500">Jabatan</p>
                                                    <p className="text-xs text-gray-500">no Telp</p>
                                                </div>
                                            </div>
                                            <div className="flex gap-1">
                                                <button className="flex items-center h-fit space-x-2 px-2 py-2 bg-yellow-500 hover:bg-yellow-600 text-white font-semibold rounded-lg">
                                                    <FaEdit />
                                                </button>

                                                <AlertDialog>
                                                    <AlertDialogTrigger asChild>
                                                        <div className="flex items-center h-fit space-x-2 px-2 py-2 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg">
                                                            <FaTrashAlt />
                                                        </div>
                                                    </AlertDialogTrigger>
                                                    <AlertDialogContent>
                                                        <AlertDialogHeader>
                                                            <AlertDialogTitle>Hapus &quot;Nama Outlet&quot;?</AlertDialogTitle>
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
                                        </section>
                                    </CardContent>

                                </Card>
                            </TabsContent>
                            <TabsContent value="pekerja">
                                <Card>
                                    <CardContent className="space-y-2 pt-4">
                                        <LocationAndSearch />
                                        <section className="flex justify-between items-center">
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0 p-1">
                                                    <Avatar>
                                                        <AvatarImage src="https://github.com/shadcn.png" />
                                                        <AvatarFallback>CN</AvatarFallback>
                                                    </Avatar>
                                                </div>
                                                <div className="ml-2">
                                                    <h2 className="font-medium text-gray-900">Nama Pekerja</h2>
                                                    <p className="text-xs text-gray-500">Jabatan</p>
                                                    <p className="text-xs text-gray-500">no Telp</p>
                                                </div>
                                            </div>
                                            <div className="flex gap-1">
                                                <button className="flex items-center h-fit space-x-2 px-2 py-2 bg-yellow-500 hover:bg-yellow-600 text-white font-semibold rounded-lg">
                                                    <FaEdit />
                                                </button>

                                                <AlertDialog>
                                                    <AlertDialogTrigger asChild>
                                                        <div className="flex items-center h-fit space-x-2 px-2 py-2 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg">
                                                            <FaTrashAlt />
                                                        </div>
                                                    </AlertDialogTrigger>
                                                    <AlertDialogContent>
                                                        <AlertDialogHeader>
                                                            <AlertDialogTitle>Hapus &quot;Nama Outlet&quot;?</AlertDialogTitle>
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
                                        </section>
                                    </CardContent>
                                </Card>
                            </TabsContent>
                            <TabsContent value="Driver">
                                <Card>
                                    <CardContent className="space-y-2 pt-4">
                                        <LocationAndSearch />
                                        <section className="flex justify-between items-center">
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0 p-1">
                                                    <Avatar>
                                                        <AvatarImage src="https://github.com/shadcn.png" />
                                                        <AvatarFallback>CN</AvatarFallback>
                                                    </Avatar>
                                                </div>
                                                <div className="ml-2">
                                                    <h2 className="font-medium text-gray-900">Nama Pekerja</h2>
                                                    <p className="text-xs text-gray-500">Jabatan</p>
                                                    <p className="text-xs text-gray-500">no Telp</p>
                                                </div>
                                            </div>
                                            <div className="flex gap-1">
                                                <button className="flex items-center h-fit space-x-2 px-2 py-2 bg-yellow-500 hover:bg-yellow-600 text-white font-semibold rounded-lg">
                                                    <FaEdit />
                                                </button>

                                                <AlertDialog>
                                                    <AlertDialogTrigger asChild>
                                                        <div className="flex items-center h-fit space-x-2 px-2 py-2 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg">
                                                            <FaTrashAlt />
                                                        </div>
                                                    </AlertDialogTrigger>
                                                    <AlertDialogContent>
                                                        <AlertDialogHeader>
                                                            <AlertDialogTitle>Hapus &quot;Nama Outlet&quot;?</AlertDialogTitle>
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
                                        </section>
                                    </CardContent>
                                </Card>
                            </TabsContent>
                        </Tabs>

                    </div>
                </main>
            </section>
        </main>
    )
}