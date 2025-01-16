import Image from "next/image";
import Link from "next/link";
import { FaHandsWash } from "react-icons/fa";

export default function LayananComponent({ productArr }: { productArr: any }) {
    return (
        <div className="w-full h-fit py-5 md:py-10 mt-2 md:mt-6 bg-gradient-to-t from-sky-100 via-orange-100 to-white px-4 md:px-10 rounded-tl-full">
            <div className="flex flex-wrap justify-between items-start w-full">
                <div className="text-left space-y-4">
                    <h1 className="text-orange-500 font-bold text-3xl md:text-4xl lg:text-5xl leading-tight">Layanan Kami</h1>
                    <p className="text-neutral-600 text-base md:text-lg">Temukan berbagai layanan terbaik kami yang siap membantu kebutuhan Anda.</p>
                </div>
                <div className="mt-4 md:mt-0">
                    <Link href='/service' className="border-b-2 border-transparent text-neutral-700 font-medium hover:border-orange-500 transition-all">
                        Lihat Selengkapnya
                    </Link>
                </div>
            </div>
            <div className='w-full py-16 flex justify-center'>
                <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5'>
                    {productArr?.map((prod: any, index: number) => (
                        <Link href='/service' key={index} className='w-full relative rounded-2xl overflow-hidden shadow-lg transform hover:scale-105 transition-transform duration-300 group'>
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
        </div>
    )
}