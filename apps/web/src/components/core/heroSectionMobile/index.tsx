'use client';

import Autoplay from 'embla-carousel-autoplay';
import React, { useState } from 'react';
import {
    Carousel,
    CarouselContent,
    CarouselItem,
} from '@/components/ui/carousel';
import ButtonCustom from '@/components/core/buttonCustom';
import Image from 'next/image';
import { FaHome, FaInfoCircle,FaTshirt } from 'react-icons/fa';
import { MdBusiness, MdContactMail, MdDesignServices, MdEmail } from 'react-icons/md';
import Link from 'next/link';
import { FaServicestack } from 'react-icons/fa6';
import { useRouter } from 'next/navigation';
import { MenuItem } from './type';

export default function HeroSectionMobile() {
    const [isFade, setIsFade] = useState<boolean>(false);
    const router = useRouter()

    const imageCarousell = [
        '/images/people-mobile.png',
        '/images/people-new-mobile.png',
    ];

    const captionImage = [
        {
            title: 'Layanan Laundry Berkualitas',
            description: 'Nikmati layanan laundry profesional yang cepat, efisien, dan ramah lingkungan bersama Clean&Click.',
        },
        {
            title: 'Cepat dan Tepat',
            description: 'Kami memastikan pakaian Anda sampai di depan pintu dengan cepat dan dalam kondisi sempurna. Hemat waktu Anda bersama kami!',
        },
    ];

    const arrMenu: MenuItem[] = [
        { icon: <FaHome />, url: '/', name: 'Beranda' },
        { icon: <MdDesignServices />, url: '/service', name: 'Layanan' },
        { icon: <MdBusiness />, url: '/about-us', name: 'Tentang' },
        { icon: <MdContactMail />, url: '/contact', name: 'Kontak' },
    ];

    const plugin = React.useRef(Autoplay({ delay: 4000, stopOnInteraction: false }));
    const handleImageLoad = () => setIsFade(false);

    return (
        <>
            <Carousel
                plugins={[plugin.current]}
                className="w-full mt-0 md:mt-2 md:hidden block"
                onMouseEnter={plugin.current.stop}
                onMouseLeave={plugin.current.reset}>
                <CarouselContent>
                    {imageCarousell.map((image, index) => (
                        <CarouselItem key={index}>
                            <div className="relative w-full h-[70vh] bg-gradient-to-r from-blue-50 via-white to-blue-50">
                                <Image
                                    width={2000}
                                    height={2000}
                                    src={image}
                                    onLoad={handleImageLoad}
                                    alt={`hero-image-${index}`}
                                    className={`w-full h-full object-cover object-center transition-opacity duration-1000 ease-in-out ${isFade ? 'opacity-0' : 'opacity-100'}`}
                                />
                                <div className="absolute inset-0 flex flex-col items-center justify-end py-20 bg-gradient-to-t from-black/70 via-black/40 to-transparent bg-opacity-35">
                                    <div className="text-center pb-2 text-white px-4 space-y-4">
                                        <h2 className="text-3xl font-bold tracking-tight">{captionImage[index].title}</h2>
                                        <p className="text-sm md:text-base lg:text-lg text-gray-300 leading-relaxed">{captionImage[index].description}</p>
                                    </div>
                                    <ButtonCustom onClick={() => router.push('/user/dashboard/pickup')} rounded='rounded-full' btnColor="bg-orange-500 hover:bg-orange-500">
                                        Pesan Sekarang
                                    </ButtonCustom>
                                </div>
                                <div className='absolute top-5 w-full flex justify-between gap-1 px-2'>
                                    <div className='flex gap-1'>
                                        <Link href='/user/dashboard/pickup' className="text-white text-opacity-75 text-2xl"><FaTshirt /></Link>
                                        <Link href='/about-us' className="text-white text-opacity-75 text-2xl"><FaInfoCircle /></Link>
                                    </div>
                                    <div className='flex gap-1'>
                                        <Link href='/service' className="text-white text-opacity-75 text-2xl"><FaServicestack /></Link>
                                        <Link href='/contact' className="text-white text-opacity-75 text-2xl"><MdEmail /></Link>
                                    </div>
                                </div>
                            </div>
                        </CarouselItem>
                    ))}
                </CarouselContent>
                <div className="flex justify-center h-fit w-full p-2 mt-2 bg-gradient-to-tr from-white via-sky-50 to-sky-100 rounded-2xl">
                    <div className="grid grid-cols-4 gap-2 w-full">
                        {arrMenu?.map((item, i: number) => (
                            <Link href={item?.url} className="w-full p-3 flex flex-col items-center justify-center gap-2 bg-white shadow-sm border rounded-2xl hover:shadow-md transition-all" key={i}>
                                <span className="text-2xl text-orange-500">{item?.icon}</span>
                                <h1 className="text-xs text-gray-700">{item?.name}</h1>
                            </Link>
                        ))}
                    </div>
                </div>
            </Carousel>
        </>
    );
}
