'use client'

import * as React from "react"
import Autoplay from "embla-carousel-autoplay"
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel"
import Image from "next/image"
import ButtonCustom from "../buttonCustom"
import { useRouter } from "next/navigation"

export default function HeroSection() {
    const [currentIndex, setCurrentIndex] = React.useState(0)
    const [isFade, setIsFade] = React.useState(false)
    const router = useRouter()

    const imageCarousell = [
        '/images/people.png',
        '/images/people-new.png'
    ];

    const plugin = React.useRef(Autoplay({ delay: 4000, stopOnInteraction: false }));
    const handleImageLoad = () => setIsFade(false)

    return (
        <Carousel
            plugins={[plugin.current]}
            className="w-full mt-2 md:block hidden"
            onMouseEnter={plugin.current.stop}
            onMouseLeave={plugin.current.reset}>
            <CarouselContent>
                {imageCarousell.map((image, index) => (
                    <CarouselItem key={index}>
                        <div className="relative w-full h-[50vh] lg:h-fit bg-gradient-to-r from-sky-100 via-orange-100 to-white">
                            <Image
                                width={2000}
                                height={2000}
                                src={image}
                                onLoad={handleImageLoad}
                                alt={`hero-image-${index}`}
                                className={`w-full h-full object-cover transition-opacity duration-1000 ease-in-out ${isFade ? 'opacity-0' : 'opacity-100'}`}
                            />
                            <div className={`absolute inset-0 w-full items-center ${index === 0 ? 'justify-start' : 'justify-end'} flex transition-opacity duration-1000 ease-in-out`}>
                                <div className={`lg:w-1/2 px-10 text-center ${index === 0 ? 'lg:text-left' : 'lg:text-left'}`}>
                                    <div className="w-full flex flex-col gap-2">
                                        {index === 0 ? (
                                            <>
                                                <h1 className="text-xl md:text-5xl font-extrabold text-gray-800 leading-tight">Permudah Semua dengan</h1>
                                                <div className="flex gap-2">
                                                    <span className="text-blue-500 text-xl md:text-5xl font-extrabold leading-tight">Clean&Click</span>
                                                    <span className="text-orange-500 text-xl md:text-5xl font-extrabold leading-tight">Laundry</span>
                                                </div>
                                                <p className="text-gray-600 mt-4 text-lg">Kami telah berkomitmen untuk memberikan layanan pelanggan yang luar biasa dan layanan cuci kering serta laundry berkualitas tinggi.</p>
                                            </>
                                        ) : (
                                            <>
                                                <h1 className="text-xl md:text-5xl font-extrabold text-gray-800 leading-tight">Cepat dan Tepat dengan</h1>
                                                <h1 className="text-xl md:text-5xl font-extrabold text-blue-500 leading-tight">Clean&Click <span className="text-orange-500">Delivery</span></h1>
                                                <p className="text-gray-600 mt-4 text-sm md:text-lg">Kami memastikan pakaian Anda sampai di depan pintu dengan cepat dan dalam kondisi sempurna. Hemat waktu Anda bersama kami!</p>
                                            </>
                                        )}
                                    </div>
                                    <div className="md:flex hidden gap-4 mt-6 items-center">
                                        <ButtonCustom onClick={() => router.push('/user/dashboard/pickup')} rounded="rounded-full" btnColor="bg-orange-500 hover:bg-orange-500">Pelajari Selengkapnya</ButtonCustom>
                                        <div className="flex items-center gap-2">
                                            <span className="text-yellow-400 text-xl">{'⭐'.repeat(5)}</span>
                                            <p className="text-gray-600 font-medium">4.8 Total Ulasan</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </CarouselItem>
                ))}
            </CarouselContent>
        </Carousel>
    );
}
