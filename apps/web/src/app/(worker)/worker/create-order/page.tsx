import HeaderMobile from "@/components/core/headerMobile";
import Link from "next/link";
import { FaArrowLeft } from "react-icons/fa";

export default function createOrder() {
    return (
        <>
            <main className="w-full h-fit">
                <section className="w-full h-fit">
                    <HeaderMobile />
                    <main className="mx-8">
                        <section className="flex gap-2 items-center bg-white w-full z-50 font-bold  fixed pt-2 mt-14 text-lg border-b-2 pb-4">
                            <Link href='/worker/dashboard'><FaArrowLeft /></Link> BUAT ORDER
                        </section>
                        
                    </main>
                </section>
            </main>
        </>
    )
}