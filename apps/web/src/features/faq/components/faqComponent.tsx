import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import Link from "next/link";
export default function FaqComponent() {
    return (
        <main className='w-full pt-5 md:pt-[90px] pb-28 md:pb-0 h-fit flex justify-center'>
            <div className="h-fit w-full px-3 md:px-0 md:max-w-[70vw] py-10">
                <div className='flex flex-col justify-center w-full items-center mb-10'>
                    <h1 className="text-3xl font-bold text-center flex">FAQ <span className="md:block hidden ml-1"> - Clean&Click</span></h1>
                    <div className="flex gap-2 text-center w-full justify-center items-center">
                        <Link href='/terms-condition' className="hover:underline hover:text-neutral-400 text-neutral-500">Syarat dan ketentuan</Link>
                        <div className="w-1 h-1 bg-black rounded-full"></div>
                        <Link href='/privacy-policy' className="hover:underline hover:text-neutral-400 text-neutral-500">Kebijakan Privasi</Link>
                        <div className="w-1 h-1 bg-black rounded-full"></div>
                        <Link href='/help' className="hover:underline hover:text-neutral-400 text-neutral-500">Bantuan</Link>
                    </div>
                </div>
                <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="item-1">
                        <AccordionTrigger className="text-neutral-500 pb-5 text-xl font-sans font-semibold">Apa itu Clean&Click?</AccordionTrigger>
                        <AccordionContent className="text-neutral-400">
                            Clean&Click adalah layanan laundry online yang menyediakan solusi cuci pakaian
                            berkualitas tinggi dengan layanan antar-jemput, proses cepat, dan hasil yang memuaskan.
                            Kami hadir untuk mempermudah kehidupan Anda!
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-2">
                        <AccordionTrigger className="text-neutral-500 pb-5 text-xl font-sans font-semibold">Bagaimana cara memesan layanan laundry?</AccordionTrigger>
                        <AccordionContent className="text-neutral-400">
                            Anda dapat memesan layanan kami langsung melalui website Clean&Click. Pilih jenis layanan,
                            jadwal antar-jemput, dan lokasi Anda. Kami akan segera menjemput cucian Anda.
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-3">
                        <AccordionTrigger className="text-neutral-500 pb-5 text-xl font-sans font-semibold">Jenis layanan apa saja yang tersedia?</AccordionTrigger>
                        <AccordionContent className="text-neutral-400">
                            Clean&Click menyediakan beberapa layanan seperti cuci biasa, cuci kering,
                            setrika, dry cleaning, dan perawatan khusus untuk kain sensitif seperti
                            gaun pesta dan jas.
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-4">
                        <AccordionTrigger className="text-neutral-500 pb-5 text-xl font-sans font-semibold">Apakah tersedia layanan express?</AccordionTrigger>
                        <AccordionContent className="text-neutral-400">
                            Ya. Layanan express kami memastikan cucian Anda selesai dalam waktu 6 jam
                            tanpa mengurangi kualitas hasil cucian.
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-5">
                        <AccordionTrigger className="text-neutral-500 pb-5 text-xl font-sans font-semibold">Di mana saja area layanan Clean&Click?</AccordionTrigger>
                        <AccordionContent className="text-neutral-400">
                            Saat ini, Clean&Click melayani area Jabodetabek. Untuk area lainnya,
                            kami sedang dalam proses ekspansi agar lebih banyak pelanggan dapat menikmati layanan kami.
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-6">
                        <AccordionTrigger className="text-neutral-500 pb-5 text-xl font-sans font-semibold">Bagaimana saya tahu cucian saya aman?</AccordionTrigger>
                        <AccordionContent className="text-neutral-400">
                            Kami memastikan cucian Anda aman dengan proses pencucian profesional, menggunakan
                            deterjen ramah lingkungan, dan teknik pencucian yang sesuai untuk setiap jenis kain.
                            Selain itu, Anda dapat melacak status cucian Anda secara real-time melalui akun Clean&Click.
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-7">
                        <AccordionTrigger className="text-neutral-500 pb-5 text-xl font-sans font-semibold">Berapa tarif layanan Clean&Click?</AccordionTrigger>
                        <AccordionContent className="text-neutral-400">
                            Tarif kami bervariasi tergantung jenis layanan. Cuci standar mulai dari Rp 10.000/kg,
                            sedangkan layanan khusus seperti dry cleaning mulai dari Rp 50.000 per item.
                            Silakan kunjungi halaman Harga untuk informasi lebih detail.
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-8">
                        <AccordionTrigger className="text-neutral-500 pb-5 text-xl font-sans font-semibold">Bagaimana jika ada masalah dengan hasil laundry?</AccordionTrigger>
                        <AccordionContent className="text-neutral-400">
                            Kepuasan pelanggan adalah prioritas kami. Jika ada masalah, Anda dapat menghubungi
                            tim layanan pelanggan Clean&Click dalam waktu 24 jam setelah pengiriman.
                            Kami akan membantu menyelesaikan masalah dengan cepat.
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-9">
                        <AccordionTrigger className="text-neutral-500 pb-5 text-xl font-sans font-semibold">Apakah Clean&Click ramah lingkungan?</AccordionTrigger>
                        <AccordionContent className="text-neutral-400">
                            Ya, Clean&Click menggunakan deterjen ramah lingkungan dan mendaur ulang air
                            yang digunakan dalam proses pencucian untuk mengurangi dampak lingkungan.
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-10">
                        <AccordionTrigger className="text-neutral-500 pb-5 text-xl font-sans font-semibold">Apakah saya bisa menjadwalkan pengambilan di waktu tertentu?</AccordionTrigger>
                        <AccordionContent className="text-neutral-400">
                            Tentu saja. Anda dapat memilih waktu pengambilan yang sesuai dengan jadwal Anda
                            saat melakukan pemesanan melalui website.
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </div>
        </main>
    );
}