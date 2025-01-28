'use client'

import ButtonCustom from "@/components/core/buttonCustom";
import { useRouter } from "next/navigation";

export default function NavigationSection() {
    const router = useRouter()

    return (
        <div className="w-full px-4 md:px-10 h-fit pb-5 bg-opacity-80 flex flex-col justify-center items-center">
            <div className="w-full rounded-2xl bg-blue-600 flex py-20 justify-center items-center flex-col">
                <div className="text-center pb-5">
                    <h1 className="text-white text-3xl font-bold mb-2">Solusi Terbaik untuk <span className="text-white">Kebutuhan Laundry Anda</span></h1>
                    <p className="text-neutral-300 text-lg">Kami menghadirkan layanan laundry berkualitas tinggi, cepat, dan terpercaya.</p>
                </div>
                <ButtonCustom onClick={() => router.push('/user/dashboard/pickup')} rounded="rounded-full" btnColor="bg-orange-500 hover:bg-orange-500 font-bold" type="button">Pesan Sekarang</ButtonCustom>
            </div>
        </div>
    );
}