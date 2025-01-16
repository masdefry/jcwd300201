import Image from "next/image";

export default function MengapaKamiComponent({ boxContent }: { boxContent: any }) {
    return (
        <div className="flex md:flex-row flex-col w-full px-4 md:px-10 gap-2 h-fit bg-gradient-to-b from-white via-white rounded-br-full pb-10 to-orange-100">
            <section className="w-full h-fit py-10 flex flex-col text-right">
                <div className="w-full p-5">
                    <h1 className="font-bold text-orange-500 text-3xl lg:text-5xl">Mengapa Kami?</h1>
                </div>
                <div className="w-full px-5">
                    <h2 className="text-lg text-neutral-600">Alasan Kami Menjadi Pilihan Tepat untuk Layanan Anda</h2>
                </div>

                <div className="flex md:flex-row flex-col w-full gap-2 h-fit mt-6">
                    <section className="h-fit md:w-1/2 md:block hidden w-full py-5">
                        <div className="h-fit w-full bg-white space-y-2 rounded-2xl">
                            <div className="h-[350px] w-full">
                                <div className="w-full p-5">
                                    <h1 className="text-xl pt-5 text-orange-500 font-sans font-semibold hidden md:block">Kami Bangga Menjadi Bagian dari Perjalanan Anda</h1>
                                </div>
                                <div className="w-full p-5">
                                    <h1 className="text-xl md:text-5xl font-bold text-neutral-700">Bersama, Kami Mewujudkan Impian dengan <span className="text-orange-500">Pelayanan Terbaik dan Dedikasi</span></h1>
                                </div>
                            </div>
                            <div className="h-[250px] w-full flex items-center p-5">
                                <p className="text-neutral-600 mt-2 leading-relaxed">
                                    Tim kami terdiri dari individu-individu yang berdedikasi tinggi untuk
                                    memberikan pelayanan laundry terbaik. Dengan semangat profesionalisme dan kerja sama, kami terus berusaha melebihi harapan pelanggan kami.
                                    Bergabunglah dengan kami untuk menikmati layanan laundry yang cepat, terpercaya, dan berkualitas tinggi.
                                </p>
                            </div>
                        </div>
                    </section>
                    <section className="h-fit md:w-1/2 w-full py-5 space-y-2">
                        <div className="h-[350px] w-full bg-white rounded-2xl">
                            <Image width={500} height={500} alt="our-team" src='/images/our-team.jpg' className="w-full h-[350px] rounded-2xl object-cover" />
                        </div>
                        <div className="h-[250px] md:block hidden w-full bg-white rounded-2xl p-5">
                            <div className="w-full flex justify-center items-center h-full">
                                <div className="w-full h-full grid grid-cols-2 gap-2">
                                    {boxContent?.map((content: any, i: number) => (
                                        <div key={i} className="h-full text-neutral-700 w-full gap-3 flex items-center p-5 bg-gradient-to-r from-neutral-200 to-white rounded-full">
                                            <span className="text-base md:text-5xl">{content?.icon} </span><p className="flex items-center">{content?.boxCaption}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </section>
        </div>
    );
}