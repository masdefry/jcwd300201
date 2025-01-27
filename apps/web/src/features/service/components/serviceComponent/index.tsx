'use client'

import ButtonCustom from "@/components/core/buttonCustom";
import Image from "next/image";
import Link from "next/link";
import { FaHandsWash } from "react-icons/fa";
import { useServiceHooks } from "../../hooks/useServiceHooks";


export default function ServiceComponent() {
    const { router, services, productArr } = useServiceHooks()
    return (
        <main className='w-full h-fit flex flex-col md:pt-[90px] pt-0 md:pb-0 pb-28'>
            <section className="w-full h-fit pb-0 pt-3 mt-0 md:pt-10 md:pb-5 md:mt-6 bg-gradient-to-t from-sky-100 via-orange-100 to-white px-2 md:px-10 rounded-tl-full">
                <div className="flex flex-wrap justify-between items-start w-full">
                    <div className="text-left space-y-4">
                        <h1 className="text-2xl md:text-5xl font-bold text-neutral-700">Layanan <span className="text-orange-500">Laundry Kami</span></h1>
                        <p className="text-lg">Cepat, Terpercaya, dan Terjangkau untuk Kebutuhan Laundry Anda</p>
                    </div>
                </div>
                <div className='w-full py-16 flex justify-center'>
                    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5'>
                        {productArr?.map((prod, index) => (
                            <Link href='/user/dashboard/pickup' key={index} className='w-full relative rounded-2xl overflow-hidden shadow-lg transform hover:scale-105 transition-transform duration-300 group'>
                                <div className='w-full h-60 relative'>
                                    <Image src={prod?.img} width={500} height={500}
                                        alt={prod?.caption} className='w-full h-full object-cover rounded-2xl transition-opacity' />
                                    <div className='absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-0 group-hover:opacity-50 transition-opacity'></div>
                                </div>
                                <div className='absolute bottom-5 left-5 right-5 py-4 px-6 bg-neutral-300 rounded-2xl shadow-md bg-opacity-80 border-b-4 border-orange-500 group-hover:bg-opacity-90 transition-all'>
                                    <h1 className='font-semibold text-sm text-neutral-700 flex items-center gap-2'>
                                        <FaHandsWash className='text-xl' />
                                        {prod?.caption}
                                    </h1>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>
            <section className="w-full h-fit px-2 md:px-10 pb-10 bg-gradient-to-b from-sky-100 via-orange-100 to-white">
                <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-16">
                    <div className="w-full md:w-1/2 h-72">
                        <Image src="/images/wash.jpg" width={500} height={400}
                            alt="Layanan Mencuci" className="w-full h-full object-cover rounded-2xl shadow-lg" />
                    </div>
                    <div className="w-full md:w-1/2 space-y-6">
                        <h2 className="text-3xl font-semibold text-neutral-700">Layanan Mencuci</h2>
                        <p className="text-neutral-600">
                            Kami menyediakan layanan mencuci yang dirancang untuk memberikan kebersihan optimal pada pakaian Anda.
                            Menggunakan teknologi modern dan detergen ramah lingkungan, pakaian Anda akan selalu segar dan bersih.
                        </p>
                        <ButtonCustom onClick={() => router.push('/service/wash')} rounded="rounded-lg" btnColor="bg-orange-500 hover:bg-orange-400 font-bold" type="button">
                            Pelajari Lebih Lanjut
                        </ButtonCustom>
                    </div>
                </div>

                <div className="flex flex-col-reverse md:flex-row items-center justify-between gap-8 mb-16">
                    <div className="w-full md:w-1/2 space-y-6">
                        <h2 className="text-3xl font-semibold text-neutral-700">Layanan Setrika</h2>
                        <p className="text-neutral-600">
                            Dapatkan pakaian rapi dan tanpa kerutan dengan layanan setrika profesional kami.
                            Kami memastikan setiap pakaian disetrika dengan hati-hati agar terlihat seperti baru.
                        </p>
                        <ButtonCustom onClick={() => router.push('/service/ironing')} rounded="rounded-lg" btnColor="bg-orange-500 hover:bg-orange-400 font-bold" type="button">
                            Pelajari Lebih Lanjut
                        </ButtonCustom>
                    </div>
                    <div className="w-full md:w-1/2 h-72">
                        <Image src="/images/ironing.jpg" width={500} height={400}
                            alt="Layanan Setrika" className="w-full h-full object-cover rounded-2xl shadow-lg" />
                    </div>
                </div>

                <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="w-full md:w-1/2 h-72">
                        <Image src="/images/laundry-img.webp" width={500} height={400}
                            alt="Layanan Mencuci dan Setrika" className="w-full h-full object-cover rounded-2xl shadow-lg" />
                    </div>
                    <div className="w-full md:w-1/2 space-y-6">
                        <h2 className="text-3xl font-semibold text-neutral-700">Layanan Mencuci dan Setrika</h2>
                        <p className="text-neutral-600">
                            Solusi lengkap untuk pakaian Anda! Kami menawarkan layanan mencuci dan setrika dalam satu paket praktis.
                            Hemat waktu dan tenaga Anda dengan mempercayakan pakaian kepada kami.
                        </p>
                        <ButtonCustom onClick={() => router.push('/user/dashboard/pickup')} rounded="rounded-lg" btnColor="bg-orange-500 hover:bg-orange-400 font-bold" type="button">
                            Pelajari Lebih Lanjut
                        </ButtonCustom>
                    </div>
                </div>
            </section>


            <section className="w-full px-2 md:px-10 h-fit pb-5 bg-opacity-80 flex flex-col justify-center items-center">
                <div className="w-full rounded-2xl bg-blue-600 flex py-20 justify-center items-center flex-col">
                    <div className="text-center pb-5">
                        <h1 className="text-white text-xl md:text-3xl font-bold mb-2">Solusi Terbaik untuk <span className="text-white">Kebutuhan Laundry Anda</span></h1>
                        <p className="text-neutral-300 text-lg">Kami menghadirkan layanan laundry berkualitas tinggi, cepat, dan terpercaya.</p>
                    </div>
                    <ButtonCustom onClick={() => router.push('/user/dashboard/pickup')} rounded="rounded-full" btnColor="bg-orange-500 hover:bg-orange-500 font-bold" type="button">Pesan Sekarang</ButtonCustom>
                </div>
            </section>
        </main>
    );
}