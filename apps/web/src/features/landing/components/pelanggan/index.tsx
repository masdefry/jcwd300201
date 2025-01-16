import Image from "next/image";

export default function PelangganComponent({ testimonialData }: { testimonialData: any }) {
    return (
        <div className='w-full h-fit flex bg-gradient-to-b from-sky-100 via-sky-50 to-white px-4 md:px-10 pb-5'>
            <div className='w-full h-fit text-black flex flex-col items-center text-center'>
                <h1 className="text-3xl lg:text-5xl font-extrabold text-orange-500 mb-4">Pelanggan Kami</h1>
                <p className="lg:text-lg text-gray-600 mb-14 max-w-3xl">Kami bangga memiliki berbagai pelanggan yang puas dengan layanan kami. Berikut adalah beberapa testimoni dari mereka yang telah merasakan kualitas terbaik dari produk dan layanan kami.</p>
                <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {testimonialData.map((item: any, i: number) => (
                        <div key={item.id || i} className="w-full border-b-2 border-orange-500 bg-white rounded-3xl p-8 transform hover:scale-105 transition-all duration-300 ease-in-out">
                            <div className="flex justify-center mb-6">
                                <Image
                                    src={item?.imageSrc}
                                    alt={item?.name}
                                    width={100}
                                    height={100}
                                    className="w-24 h-24 rounded-full object-cover border-4 border-orange-500"
                                />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900">{item?.name}</h3>
                            <p className="text-md text-gray-600 mb-4">{item?.position}</p>
                            <p className="text-gray-500 text-sm">{item?.testimonial}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}