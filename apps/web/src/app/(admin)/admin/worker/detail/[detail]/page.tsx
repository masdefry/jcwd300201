'use client'

import { ConfirmAlert } from "@/components/core/confirmAlertCustom";
import MobileSessionLayout from "@/components/core/mobileSessionLayout/subMenuLayout";
import LayoutDetailWorker from "@/features/superAdmin/components/layoutDetailWorker";
import { useDetailWorkerHook } from "@/features/superAdmin/hooks/useDetailWorkerHook";
import Image from "next/image";
import { BsTrash3 } from "react-icons/bs";

export default function Page({ params }: { params: Promise<{ detail: string }> }) {
    const { workerData, isFetching,
        handleDeleteData, isPendingDelete } = useDetailWorkerHook({ params })

    if (isFetching) return <div></div>

    return (
        <>
            <MobileSessionLayout title="Detail Pekerja">
                <div className="bg-orange-500 flex items-center rounded-t-xl justify-between  p-6">
                    <div className="flex gap-3 items-center">
                        <Image
                            src={workerData?.profilePicture || ""}
                            alt="Profile Picture"
                            width={128}
                            height={128}
                            className="w-10 h-10 rounded-full border-4 border-white"
                        />
                        <div className="flex flex-col">
                            <h1 className="font-bold text-white text-sm">{workerData?.firstName} {workerData?.lastName}</h1>
                            <p className="text-neutral-100 italic text-sm">{workerData?.id.length > 15 ? <span>{workerData?.id.slice(0, 15)}..</span> : workerData?.id}</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-3">
                        <ConfirmAlert caption="Apakah anda yakin ingin menghapus data pekerja?" description="Berhati-hati, dikarenakan data akan hilang secara permanen" onClick={() => handleDeleteData()}
                            disabled={isPendingDelete}>
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
            </MobileSessionLayout>

            {/* web sesi */}
            <LayoutDetailWorker>
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
                                <ConfirmAlert caption="Apakah anda yakin ingin menghapus data pekerja?" description="Berhati-hati, dikarenakan data akan hilang secara permanen" onClick={() => handleDeleteData()}
                                    disabled={isPendingDelete}>
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
            </LayoutDetailWorker>
        </>
    );
}