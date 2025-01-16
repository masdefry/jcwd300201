import Image from "next/image";
import * as React from 'react'

export default function AboutUsComponent({ boxContent }: { boxContent: any }) {
    return (
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
                            {boxContent?.map((content: any, i: number) => (
                                <div key={i} className="h-full text-neutral-700 w-full gap-3 flex items-center p-5 bg-neutral-100 rounded-2xl">
                                    <span className="text-5xl">{React.createElement(content?.icon)} </span><p className="flex items-center">{content?.boxCaption}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}