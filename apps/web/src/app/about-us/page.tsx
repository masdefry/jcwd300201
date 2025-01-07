'use client'

import Image from "next/image";
import { FaRegClock, FaCheckCircle, FaRocket, FaUsers, FaStar, FaUsersCog } from 'react-icons/fa';

export default function Page() {
    const boxContent = [
        { boxCaption: 'Pengalaman Bertahun-tahun di Layanan Laundry', icon: <FaRegClock /> },
        { boxCaption: 'Fokus pada Kualitas dan Kecepatan', icon: <FaRocket /> },
        { boxCaption: 'Dipercaya oleh Banyak Pelanggan', icon: <FaUsers /> },
        { boxCaption: 'Tim Profesional yang Berdedikasi', icon: <FaUsersCog /> },
    ]

    const teamContent = [
        { img: '/images/ceo.png', name: 'Andi Setiawan', position: 'CEO' },
        { img: '/images/manager.png', name: 'Budi Santoso', position: 'Manager' },
        { img: '/images/assisten.png', name: 'Rina Dewi', position: 'Asisten Manager' },
        { img: '/images/worker.png', name: 'Agus Pratama', position: 'Akuntan' },
        { img: '/images/admin-outlet.png', name: 'Hani Hanifah', position: 'Admin Outlet' },
        { img: '/images/petugas-pencuci.png', name: 'Farel Putra', position: 'Petugas Pencuci' },
        { img: '/images/ironing-w.png', name: 'Indri', position: 'Petugas Setrika' },
        { img: '/images/kurir.png', name: 'Miftah', position: 'Petugas Pengantar' },
    ]

    return (
        <main className="w-full h-fit flex-col pt-0 md:pb-0 pb-28 flex md:pt-[90px]">
            <div className="flex md:flex-row flex-col w-full px-2 md:px-10 gap-2 h-fit bg-neutral-100">
                <section className="h-fit md:w-1/2 w-full py-5">
                    <div className="h-fit w-full bg-white space-y-2 rounded-2xl shadow-md">
                        <div className="md:h-[350px] h-fit w-full">
                            <div className="w-full p-5">
                                <h1 className="text-xl text-orange-500 font-sans font-semibold">Kami Bangga Menjadi Bagian dari Perjalanan Anda</h1>
                            </div>
                            <div className="w-full p-5">
                                <h1 className="text-xl lg:text-5xl font-bold text-neutral-700">Bersama, Kami Mewujudkan Impian dengan <span className="text-orange-500">Pelayanan Terbaik dan Dedikasi</span></h1>
                            </div>
                        </div>
                        <div className="md:h-[250px] h-fit w-full flex items-center p-5">
                            <p className="text-neutral-600 mt-2 leading-relaxed">
                                Tim kami terdiri dari individu-individu yang berdedikasi tinggi untuk
                                memberikan pelayanan laundry terbaik. Dengan semangat profesionalisme dan kerja sama, kami terus berusaha melebihi harapan pelanggan kami.
                                Bergabunglah dengan kami untuk menikmati layanan laundry yang cepat, terpercaya, dan berkualitas tinggi.
                            </p>
                        </div>
                    </div>

                </section>
                <section className="h-fit md:w-1/2 w-full md:py-5 py-0 md:pb-0 pb-3 space-y-2">
                    <div className="h-[350px] w-full bg-white rounded-2xl">
                        <Image width={500} height={500} alt="our-team" src='/images/our-team.jpg' className="w-full shadow-md h-[350px] rounded-2xl object-cover" />
                    </div>
                    <div className="h-[250px] w-full md:block hidden bg-white rounded-2xl shadow-md p-5">
                        <div className="w-full flex justify-center items-center h-full">
                            <div className="w-full h-full grid grid-cols-2 gap-2">
                                {boxContent?.map((content, i) => (
                                    <div key={i} className="h-full text-neutral-700 w-full gap-3 flex items-center p-5 bg-neutral-100 rounded-2xl">
                                        <span className="text-5xl">{content?.icon} </span><p className="flex items-center">{content?.boxCaption}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>
            </div>

            <div className="flex md:flex-row flex-col w-full px-2 md:px-10 gap-2 h-fit bg-white">
                <section className="w-full h-fit py-10 flex flex-col">
                    <div className="w-full p-5">
                        <h1 className="text-xl text-orange-500 font-sans font-semibold">Tim Kami</h1>
                    </div>
                    <div className="md:w-1/2 w-full px-5">
                        <h1 className="text-2xl font-bold text-neutral-700">Kenali Tim Profesional Kami yang Berdedikasi untuk Layanan Laundry Terbaik</h1>
                    </div>

                    <div className="w-full h-fit flex justify-center items-center">
                        <div className="grid md:grid-cols-4 grid-cols-1 w-full gap-2 px-5 py-10">
                            {teamContent.map((team, i) => (
                                <div key={i} className="h-[330px] relative bg-blue-300 w-full rounded-2xl">
                                    <Image width={500} height={500} alt="our-team" src={team?.img} className="w-full shadow-md h-[330px] rounded-2xl object-cover object-top" />
                                    <div className="p-4 absolute inset-0 flex flex-col items-end bottom-0 w-full justify-end">
                                        <h3 className="text-lg font-semibold text-neutral-700 bg-neutral-50 px-2">{team?.name}</h3>
                                        <p className="text-sm text-neutral-600 bg-neutral-50 px-2">{team?.position}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            </div>
        </main>
    );
}