import Link from "next/link";

export default function PrivacyComponent() {
    return (
        <main className='w-full md:pb-0 md:pt-[90px] pb-28 h-fit flex justify-center'>
            <div className="h-fit w-full px-3 md:px-0 md:max-w-[70vw] py-10">
                <div className='flex flex-col justify-center w-full items-center mb-10'>
                    <h1 className="text-3xl font-bold text-center flex">Kebijakan Privasi <span className="ml-1 md:block hidden">- Clean&Click</span></h1>
                    <div className="flex gap-2 text-center w-full justify-center items-center">
                        <Link href='/terms-condition' className="hover:underline hover:text-neutral-400 text-neutral-500">Syarat dan Ketentuan</Link>
                        <div className="w-1 h-1 bg-black rounded-full"></div>
                        <Link href='/faq' className="hover:underline hover:text-neutral-400 text-neutral-500">FAQ</Link>
                        <div className="w-1 h-1 bg-black rounded-full"></div>
                        <Link href='/help' className="hover:underline hover:text-neutral-400 text-neutral-500">Bantuan</Link>
                    </div>
                </div>
                <div className="text-neutral-500">
                    <h2 className="text-2xl font-semibold mb-5">Pengantar</h2>
                    <p className="mb-4">
                        Clean&Click menghargai privasi Anda dan berkomitmen untuk melindungi informasi pribadi yang Anda berikan.
                        Kebijakan Privasi ini menjelaskan bagaimana kami mengumpulkan, menggunakan, melindungi, dan membagikan data pribadi Anda.
                    </p>
                    <h2 className="text-2xl font-semibold mb-5">Informasi yang Kami Kumpulkan</h2>
                    <p className="mb-4">
                        Kami mengumpulkan informasi pribadi seperti nama, alamat, nomor telepon, alamat email, dan informasi pembayaran
                        yang diperlukan untuk memproses pesanan dan memberikan layanan kami. Kami juga dapat mengumpulkan informasi tentang
                        penggunaan situs dan aplikasi kami melalui teknologi pelacakan seperti cookie.
                    </p>
                    <h2 className="text-2xl font-semibold mb-5">Bagaimana Kami Menggunakan Informasi Anda</h2>
                    <div className="mb-4">
                        <span>Informasi yang kami kumpulkan digunakan untuk:</span>
                        <ul className="list-inside list-disc ml-5">
                            <li>Memproses pesanan dan pengiriman layanan.</li>
                            <li>Memberikan dukungan pelanggan yang lebih baik.</li>
                            <li>Menyesuaikan pengalaman pengguna di situs atau aplikasi kami.</li>
                            <li>Memperbarui Anda mengenai status pesanan atau perubahan kebijakan.</li>
                            <li>Melakukan analisis untuk meningkatkan layanan kami.</li>
                        </ul>
                    </div>
                    <h2 className="text-2xl font-semibold mb-5">Keamanan Informasi</h2>
                    <p className="mb-4">
                        Kami berkomitmen untuk melindungi informasi pribadi Anda. Kami menggunakan langkah-langkah keamanan fisik, teknis, dan
                        administratif untuk menjaga informasi Anda tetap aman dan mencegah akses yang tidak sah.
                    </p>
                    <h2 className="text-2xl font-semibold mb-5">Berbagi Informasi dengan Pihak Ketiga</h2>
                    <div className="mb-4">
                        <span>Kami tidak menjual, menyewakan, atau membagikan informasi pribadi Anda dengan pihak ketiga untuk tujuan pemasaran.
                            Namun, kami dapat membagikan informasi Anda dengan pihak ketiga dalam hal berikut:</span>
                        <ul className="list-inside list-disc ml-5">
                            <li>Dengan penyedia layanan pihak ketiga yang membantu kami dalam menjalankan bisnis kami, seperti pengiriman dan pembayaran.</li>
                            <li>Jika diwajibkan oleh hukum atau proses hukum yang sah, seperti perintah pengadilan.</li>
                            <li>Untuk melindungi hak, properti, atau keselamatan kami, pelanggan kami, atau pihak lain.</li>
                        </ul>
                    </div>
                    <h2 className="text-2xl font-semibold mb-5">Penggunaan Cookie dan Teknologi Pelacakan</h2>
                    <p className="mb-4">
                        Kami menggunakan cookie dan teknologi pelacakan lainnya untuk meningkatkan pengalaman pengguna Anda di situs kami.
                        Cookie membantu kami mengingat preferensi Anda dan memberikan fungsionalitas yang lebih baik. Anda dapat mengatur
                        browser Anda untuk menolak cookie, tetapi ini mungkin mempengaruhi pengalaman Anda dalam menggunakan situs kami.
                    </p>
                    <h2 className="text-2xl font-semibold mb-5">Hak Akses dan Pengendalian Informasi Anda</h2>
                    <p className="mb-4">
                        Anda berhak untuk mengakses, memperbarui, atau menghapus informasi pribadi yang kami simpan tentang Anda.
                        Jika Anda ingin mengakses atau mengubah informasi pribadi Anda, atau jika Anda memiliki pertanyaan tentang kebijakan privasi ini,
                        silakan hubungi kami di info@cnc.com.
                    </p>
                    <h2 className="text-2xl font-semibold mb-5">Perubahan pada Kebijakan Privasi</h2>
                    <p className="mb-4">
                        Kami dapat memperbarui Kebijakan Privasi ini dari waktu ke waktu. Setiap perubahan akan diposting di halaman ini dengan
                        tanggal pembaruan yang baru. Kami mendorong Anda untuk memeriksa halaman ini secara berkala untuk mengetahui perubahan terbaru.
                    </p>
                </div>
            </div>
        </main>
    );
}