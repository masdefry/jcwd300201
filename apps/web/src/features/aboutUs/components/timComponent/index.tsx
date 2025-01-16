import Image from "next/image";

export default function TimComponent({ teamContent }: { teamContent: any }) {
    return (
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
                        {teamContent.map((team: any, i: number) => (
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
    );
}