import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import Link from "next/link";

export default function HelpComponent() {
    return (
        <main className='w-full pt-0 md:pt-[90px] pb-28 md:pb-0 h-fit flex justify-center'>
            <div className="h-fit w-full px-3 md:px-0 md:max-w-[70vw] py-10">
                <div className='flex flex-col justify-center w-full items-center mb-10'>
                    <h1 className="text-3xl font-bold text-center flex">Bantuan <span className="md:block ml-1 hidden">- Clean&Click</span></h1>
                    <div className="flex gap-2 text-center w-full justify-center items-center">
                        <Link href='/terms-condition' className="hover:underline hover:text-neutral-400 text-neutral-500">Syarat dan ketentuan</Link>
                        <div className="w-1 h-1 bg-black rounded-full"></div>
                        <Link href='/privacy-policy' className="hover:underline hover:text-neutral-400 text-neutral-500">Kebijakan Privasi</Link>
                        <div className="w-1 h-1 bg-black rounded-full"></div>
                        <Link href='/faq' className="hover:underline hover:text-neutral-400 text-neutral-500">FAQ</Link>
                    </div>
                </div>
                <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="item-1">
                        <AccordionTrigger className="text-neutral-500 pb-5 text-xl font-sans font-semibold">Apa yang harus saya lakukan jika layanan tidak tersedia di lokasi saya?</AccordionTrigger>
                        <AccordionContent className="text-neutral-400">
                            Jika layanan belum tersedia di lokasi Anda, Anda dapat menghubungi tim kami untuk mengetahui
                            kapan layanan akan tersedia di area Anda. Kami juga akan menginformasikan pembaruan melalui
                            email atau notifikasi di aplikasi.
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-2">
                        <AccordionTrigger className="text-neutral-500 pb-5 text-xl font-sans font-semibold">Bagaimana cara melacak status cucian saya?</AccordionTrigger>
                        <AccordionContent className="text-neutral-400">
                            Anda dapat melacak status cucian Anda melalui aplikasi atau situs web Clean&Click dengan
                            login ke akun Anda. Anda akan mendapatkan pembaruan secara real-time mengenai status cucian
                            Anda.
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-3">
                        <AccordionTrigger className="text-neutral-500 pb-5 text-xl font-sans font-semibold">Bagaimana jika ada kerusakan pada pakaian saya?</AccordionTrigger>
                        <AccordionContent className="text-neutral-400">
                            Jika ada kerusakan pada pakaian Anda, kami akan mengganti atau memperbaikinya sesuai dengan
                            kebijakan perusahaan. Anda dapat menghubungi tim layanan pelanggan kami untuk melaporkan masalah
                            tersebut dan kami akan segera menyelesaikannya.
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-4">
                        <AccordionTrigger className="text-neutral-500 pb-5 text-xl font-sans font-semibold">Bagaimana cara menghubungi tim dukungan pelanggan?</AccordionTrigger>
                        <AccordionContent className="text-neutral-400">
                            Anda dapat menghubungi tim dukungan pelanggan melalui email di support@cleanandclick.com
                            atau melalui fitur chat langsung yang tersedia di aplikasi atau situs web Clean&Click.
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-5">
                        <AccordionTrigger className="text-neutral-500 pb-5 text-xl font-sans font-semibold">Apakah saya bisa membatalkan pesanan setelah dibuat?</AccordionTrigger>
                        <AccordionContent className="text-neutral-400">
                            Pembatalan pesanan dapat dilakukan dalam waktu tertentu sebelum pengambilan dilakukan. Anda
                            dapat membatalkan pesanan melalui aplikasi atau menghubungi tim layanan pelanggan kami.
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-6">
                        <AccordionTrigger className="text-neutral-500 pb-5 text-xl font-sans font-semibold">Bagaimana cara mengubah informasi akun saya?</AccordionTrigger>
                        <AccordionContent className="text-neutral-400">
                            Untuk mengubah informasi akun, Anda dapat masuk ke halaman pengaturan akun di aplikasi atau situs
                            web Clean&Click dan memperbarui detail yang ingin diubah seperti alamat, nomor telepon, atau
                            preferensi lainnya.
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-7">
                        <AccordionTrigger className="text-neutral-500 pb-5 text-xl font-sans font-semibold">Apakah Clean&Click menawarkan layanan khusus untuk pelanggan korporat?</AccordionTrigger>
                        <AccordionContent className="text-neutral-400">
                            Ya, kami menawarkan layanan khusus untuk pelanggan korporat yang mencakup layanan laundry dalam
                            jumlah besar dengan harga khusus dan jadwal antar-jemput yang fleksibel. Hubungi tim
                            pelanggan kami untuk informasi lebih lanjut.
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </div>
        </main>
    );
}
