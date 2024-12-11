'use client'

import ButtonCustom from "@/components/core/button";
import { ConfirmAlert } from "@/components/core/confirmAlert";
import { toast } from "@/components/hooks/use-toast";
import { instance } from "@/utils/axiosInstance";
import authStore from "@/zustand/authstore";
import { useMutation, useQuery } from "@tanstack/react-query";
import { ErrorMessage, Field, Form, Formik } from "formik";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { use, useEffect } from "react";
import { BsTrash3 } from "react-icons/bs";

export default function Page({ params }: { params: Promise<{ detail: string }> }) {
    const slug = use(params)
    const idUser = slug?.detail
    const token = authStore((state) => state?.token)
    const router = useRouter()

    const { data: workerData, isFetching } = useQuery({
        queryKey: ['get-data-worker'],
        queryFn: async () => {
            const res = await instance.get(`/admin/worker/detail/${idUser}`)
            return res?.data?.data
        }
    })

    const { mutate: handleDeleteData } = useMutation({
        mutationFn: async () => {
            return await instance.delete(`/admin/worker/detail/${idUser}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
        },
        onSuccess: (res) => {
            toast({
                description: res?.data?.message,
                className: "bg-blue-500 text-white p-4 rounded-lg shadow-lg border-none"
            })

            router.push('/admin/worker')

            console.log(res)
        },
        onError: (err: any) => {
            toast({
                description: err?.response?.data?.message,
                className: "bg-red-500 text-white p-4 rounded-lg shadow-lg border-none"
            })

            console.log(err)
        }
    })

    if (isFetching) return <div></div>

    return (
        <>
            {/* web sesi */}
            <main className="w-full h-full bg-neutral-200 p-4 gap-2 hidden md:flex">
                <section className="w-full flex p-4 rounded-xl h-full">
                    <div className="flex flex-col w-full gap-5">
                        <div className="w-full py-4 bg-orange-500 px-14 rounded-xl">
                            <h1 className="font-bold text-white">Data Diri Pekerja</h1>
                        </div>
                        <div className="w-full h-full flex">
                            <div className="w-full h-full bg-white rounded-xl">
                                <div className="bg-orange-500 flex items-center rounded-t-xl justify-between  p-6">
                                    <div className="flex gap-3 items-center">
                                        <Image
                                            src={workerData?.profilePicture || ""}
                                            alt="Profile Picture"
                                            width={128}
                                            height={128}
                                            className="w-20 h-20 rounded-full border-4 border-white"
                                        />
                                        <div className="flex flex-col">
                                            <h1 className="font-bold text-white">{workerData?.firstName} {workerData?.lastName}</h1>
                                            <p className="text-neutral-100 italic text-sm">{workerData?.id}</p>
                                            <p className="text-neutral-100 italic text-sm">{workerData?.email}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <h1 className="rounded-full px-2 py-1 border-2 text-neutral-100 italic text-xs">{workerData?.workerRole}</h1>
                                        <ConfirmAlert caption="menghapus data pekerja" description="Berhati-hati, dikarenakan data akan hilang secara permanen" onClick={() => handleDeleteData()}>
                                            <span className="text-neutral-100 hover:text-neutral-400 cursor-pointer"><BsTrash3 /> </span>
                                        </ConfirmAlert>
                                    </div>
                                </div>
                                <div className="bg-white">
                                    <section className="w-full bg-white p-6">
                                        <h1 className="text-lg font-bold text-gray-800 mb-4">Profile Information</h1>
                                        <div className="w-full flex gap-2">
                                            <div className="flex flex-col w-full">
                                                <div className="py-2">
                                                    <label className="text-sm font-semibold text-gray-600">Nama</label>
                                                    <input
                                                        type="text"
                                                        value={`${workerData?.firstName} ${workerData?.lastName}` || ''}
                                                        readOnly
                                                        className="w-full p-2 text-neutral-700 border-b focus:outline-none bg-neutral-100 rounded"
                                                    />
                                                </div>
                                                <div className="py-2">
                                                    <label className="text-sm font-semibold text-gray-600">Email</label>
                                                    <input
                                                        type="text"
                                                        value={workerData?.email || ''}
                                                        readOnly
                                                        className="w-full p-2 text-neutral-700 border-b focus:outline-none bg-neutral-100 rounded"
                                                    />
                                                </div>
                                                <div className="py-2">
                                                    <label className="text-sm font-semibold text-gray-600">Nomor Telepon</label>
                                                    <input
                                                        type="text"
                                                        value={workerData?.phoneNumber || 'Belum diisi'}
                                                        readOnly
                                                        className="w-full p-2 text-neutral-700 border-b focus:outline-none bg-neutral-100 rounded"
                                                    />
                                                </div>
                                            </div>
                                            <div className="flex flex-col w-full">
                                                <div className="py-2">
                                                    <label className="text-sm font-semibold text-gray-600">Jabatan</label>
                                                    <input
                                                        type="text"
                                                        value={workerData?.workerRole || ''}
                                                        readOnly
                                                        className="w-full p-2 text-neutral-700 border-b focus:outline-none bg-neutral-100 rounded"
                                                    />
                                                </div>
                                                <div className="py-2">
                                                    <label className="text-sm font-semibold text-gray-600">Bergabung pada</label>
                                                    <input
                                                        type="text"
                                                        value={new Date(workerData?.createdAt).toLocaleDateString() || ''}
                                                        readOnly
                                                        className="w-full p-2 text-neutral-700 border-b focus:outline-none bg-neutral-100 rounded"
                                                    />
                                                </div>
                                                <div className="py-2">
                                                    <label className="text-sm font-semibold text-gray-600">Nomor Identitas</label>
                                                    <input
                                                        type="text"
                                                        value={workerData?.identityNumber || ''}
                                                        readOnly
                                                        className="w-full p-2 text-neutral-700 border-b focus:outline-none bg-neutral-100 rounded"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </section>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </>
    );
}