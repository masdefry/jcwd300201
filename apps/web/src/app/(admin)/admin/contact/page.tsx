import HeaderMobile from "@/components/core/headerMobile";
import ContentWebLayout from "@/components/core/webSessionContent";
import { formatDistanceToNow } from "date-fns/formatDistanceToNow";
import { id } from 'date-fns/locale'
import { cookies } from "next/headers";
import Image from "next/image";
import Link from "next/link";
import { FaArrowLeft, FaWhatsapp } from "react-icons/fa6";
import { GrMail } from "react-icons/gr";
import { useState } from "react";
import { CardContent } from "@/components/ui/card";
const getMessageCustomer = async () => {
    const token = (await cookies()).get('__toksed')?.value
    try {
        const response = await fetch('http://localhost:5000/api/contact', {
            cache: 'no-store',
            headers: {
                Authorization: `Bearer ${token}`
            }
        })

        const result = await response.json()

        return result
    } catch (error) {
        console.log(error)
    }
}

export default async function Page() {
    const getData = await getMessageCustomer()
    const dataMessage = getData?.data
    const messageWhatsapp = 'Terima kasih telah menghubungi Clean & Click. Kami telah menerima laporan Anda. Ada yang bisa kami bantu lebih lanjut?';

    if (dataMessage?.length == 0) return (
        <ContentWebLayout caption="Pesan Pelanggan">
            <div className="w-full h-full flex justify-center items-center">
                <h1>Data tidak tersedia</h1>
            </div>
        </ContentWebLayout>
    )

    return (
        <>
            <main className="w-full h-fit md:hidden block">
                <section className="w-full h-fit">
                    <HeaderMobile />
                    <main className="w-full">
                        <section className="w-full fixed pt-16 text-lg pb-4 border-b-2 bg-white">
                            <div className="mx-8 flex justify-between gap-2 items-center font-bold w-screen pr-16">
                                <div className="flex justify-center items-center gap-2"><Link href='/admin/settings'><FaArrowLeft /></Link> PESAN PELANGGAN </div>
                            </div>
                        </section>
                        <div className="py-28 mx-4 space-y-4">
                            <CardContent className="space-y-2 pt-2">
                                
                                {dataMessage?.map((message: any, i: number) => (
                                    <div key={i} className="w-full h-fit py-4 px-5 border rounded-2xl flex flex-col bg-white">
                                        <div className="w-full flex justify-between gap-2 items-center">
                                            <div className="flex">
                                                <div className="w-12 h-12 rounded-full">
                                                    <Image
                                                        width={500}
                                                        height={500}
                                                        src={message?.User?.profilePicture?.includes('https://') ?
                                                            message?.User?.profilePicture :
                                                            `http://localhost:5000/api/src/public/images/${message?.User?.profilePicture}`}
                                                        alt="profil"
                                                        className="w-12 h-12 border-2 object-cover rounded-full"
                                                    />
                                                </div>
                                                <div className="px-2 flex items-center gap-2">
                                                    <h1 className="font-sans font-semibold">{message?.User?.firstName} {message?.User?.lastName}</h1>
                                                    <span className="text-neutral-400 w-2 h-2 bg-neutral-300 rounded-full"></span>
                                                    <h1 className="italic text-sm">
                                                        {formatDistanceToNow(new Date(message?.createdAt), { addSuffix: true, locale: id })}
                                                    </h1>
                                                </div>
                                            </div>
                                            <div className="flex gap-2 text-sm">
                                                <Link target='_blank' href={`mailto:${message?.email}?subject=${encodeURIComponent('Terimakasih talah menghubungi Clean & Click')}`} className="py-1 px-2 flex gap-1 items-center bg-orange-500 hover:bg-orange-500 text-white bg-opacity-75 rounded-full">
                                                    <span><GrMail size={20}/> </span>
                                                </Link>
                                                <Link target='_blank' href={`https://wa.me/${message?.phoneNumber?.charAt(0) === '0' ? '62' + message?.phoneNumber?.slice(1) : message?.phoneNumber}?text=${encodeURIComponent(messageWhatsapp.trim())}`} className="py-1 px-2 flex gap-1 items-center bg-green-500 hover:bg-green-500 text-white bg-opacity-75 rounded-full">
                                                    <span><FaWhatsapp size={20} /> </span>
                                                </Link>
                                            </div>
                                        </div>
                                        <h1 className="pt-4 font-bold">Pesan Customer:</h1>
                                        <div className="py-2">
                                            <h1 className="text-lg text-neutral-700">{message?.textHelp}</h1>
                                        </div>
                                    </div>
                                ))}

                            </CardContent>
                        </div>
                    </main>
                </section>
            </main>
            <ContentWebLayout caption="Pesan Pelanggan">
                <div className="w-full h-fit pb-4 flex flex-col gap-2">
                    {dataMessage?.map((message: any, i: number) => (
                        <div key={i} className="w-full h-fit py-4 px-5 border rounded-2xl flex flex-col bg-white">
                            <div className="w-full flex justify-between gap-2 items-center">
                                <div className="flex">
                                    <div className="w-12 h-12 rounded-full">
                                        <Image
                                            width={500}
                                            height={500}
                                            src={message?.User?.profilePicture?.includes('https://') ?
                                                message?.User?.profilePicture :
                                                `http://localhost:5000/api/src/public/images/${message?.User?.profilePicture}`}
                                            alt="profil"
                                            className="w-12 h-12 border-2 object-cover rounded-full"
                                        />
                                    </div>
                                    <div className="px-2 flex items-center gap-2">
                                        <h1 className="font-sans font-semibold">{message?.User?.firstName} {message?.User?.lastName}</h1>
                                        <span className="text-neutral-400 w-2 h-2 bg-neutral-300 rounded-full"></span>
                                        <h1 className="italic text-sm">
                                            {formatDistanceToNow(new Date(message?.createdAt), { addSuffix: true, locale: id })}
                                        </h1>
                                    </div>
                                </div>
                                <div className="flex gap-2 text-sm">
                                    <Link target='_blank' href={`mailto:${message?.email}?subject=${encodeURIComponent('Terimakasih talah menghubungi Clean & Click')}`} className="py-1 px-2 flex gap-1 items-center bg-orange-500 hover:bg-orange-500 text-white bg-opacity-75 rounded-full">
                                        <span><GrMail /> </span><h1>Gmail</h1>
                                    </Link>
                                    <Link target='_blank' href={`https://wa.me/${message?.phoneNumber?.charAt(0) === '0' ? '62' + message?.phoneNumber?.slice(1) : message?.phoneNumber}?text=${encodeURIComponent(messageWhatsapp.trim())}`} className="py-1 px-2 flex gap-1 items-center bg-green-500 hover:bg-green-500 text-white bg-opacity-75 rounded-full">
                                        <span><FaWhatsapp /> </span><h1>Whatsapp</h1>
                                    </Link>
                                </div>
                            </div>
                            <h1 className="pt-4 font-bold">Pesan Customer:</h1>
                            <div className="py-2">
                                <h1 className="text-lg text-neutral-700">{message?.textHelp}</h1>
                            </div>
                        </div>
                    ))}
                </div>
            </ContentWebLayout>
        </>
    );
}