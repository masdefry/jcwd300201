import Link from "next/link";

export default function TermsConditionComponent() {
    return (
        <main className='w-full md:lg:pt-[90px] pt-5 md:pb-0  pb-28 h-fit flex justify-center'>
        <div className="h-fit w-full px-3 md:px-0 md:max-w-[70vw] py-10">
            <div className='flex flex-col justify-center w-full items-center mb-10'>
                <h1 className="text-3xl font-bold text-center flex">Syarat dan Ketentuan <span className="ml-1 md:block hidden">- Clean&Click</span></h1>
                <div className="flex gap-2 text-center w-full justify-center items-center">
                    <Link href='/privacy-policy' className="hover:underline hover:text-neutral-400 text-neutral-500">Kebijakan Privasi</Link>
                    <div className="w-1 h-1 bg-black rounded-full"></div>
                    <Link href='/faq' className="hover:underline hover:text-neutral-400 text-neutral-500">FAQ</Link>
                    <div className="w-1 h-1 bg-black rounded-full"></div>
                    <Link href='/help' className="hover:underline hover:text-neutral-400 text-neutral-500">Bantuan</Link>
                </div>
            </div>
            <div className="text-neutral-500">
                <h2 className="text-2xl font-semibold mb-5">Penerimaan Syarat dan Ketentuan</h2>
                <p className="mb-4">
                    Dengan mengakses atau menggunakan layanan Clean&Click, Anda setuju untuk mematuhi dan terikat oleh
                    syarat dan ketentuan yang tercantum dalam halaman ini. Jika Anda tidak setuju dengan ketentuan ini,
                    Anda tidak diperkenankan untuk menggunakan layanan kami.
                </p>
                <h2 className="text-2xl font-semibold mb-5">Layanan Kami</h2>
                <p className="mb-4">
                    Clean&Click adalah layanan laundry online yang menyediakan layanan cuci pakaian berkualitas dengan
                    pengambilan dan pengantaran. Kami berhak mengubah atau menghentikan layanan kapan saja dengan pemberitahuan
                    sebelumnya.
                </p>
                <h2 className="text-2xl font-semibold mb-5">Penggunaan Layanan</h2>
                <p className="mb-4">
                    Anda bertanggung jawab untuk memastikan informasi yang diberikan kepada kami adalah akurat dan lengkap.
                    Anda setuju untuk tidak menggunakan layanan Clean&Click untuk tujuan ilegal atau yang melanggar hukum.
                </p>
                <h2 className="text-2xl font-semibold mb-5">Pembayaran</h2>
                <p className="mb-4">
                    Semua pembayaran untuk layanan Clean&Click dilakukan sesuai dengan harga yang ditentukan pada saat pemesanan.
                    Pembayaran dapat dilakukan melalui metode yang kami sediakan di situs atau aplikasi.
                </p>
                <h2 className="text-2xl font-semibold mb-5">Pengembalian dan Pembatalan</h2>
                <p className="mb-4">
                    Pengembalian atau pembatalan pesanan hanya dapat dilakukan dalam waktu tertentu sebelum pengambilan dilakukan.
                    Silakan hubungi tim layanan pelanggan untuk informasi lebih lanjut.
                </p>
                <h2 className="text-2xl font-semibold mb-5">Kebijakan Privasi</h2>
                <p className="mb-4">
                    Kami menghargai privasi Anda. Semua informasi pribadi yang kami kumpulkan akan digunakan sesuai dengan Kebijakan
                    Privasi Clean&Click yang terpisah, yang dapat Anda baca lebih lanjut di halaman tersebut.
                </p>
                <h2 className="text-2xl font-semibold mb-5">Penyelesaian Sengketa</h2>
                <p className="mb-4">
                    Jika terjadi sengketa atau masalah terkait layanan, kami akan berusaha untuk menyelesaikan masalah tersebut melalui
                    mediasi terlebih dahulu. Jika tidak dapat diselesaikan, masalah tersebut akan diselesaikan sesuai dengan hukum yang
                    berlaku di wilayah hukum yang relevan.
                </p>
                <h2 className="text-2xl font-semibold mb-5">Perubahan pada Syarat dan Ketentuan</h2>
                <p className="mb-4">
                    Kami berhak untuk memperbarui atau mengubah syarat dan ketentuan ini kapan saja tanpa pemberitahuan sebelumnya.
                    Anda disarankan untuk memeriksa halaman ini secara berkala untuk mengetahui pembaruan atau perubahan.
                </p>
            </div>
        </div>
    </main>
    );
}