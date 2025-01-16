import Image from "next/image";

export default function CaptionComponent() {
    return (
        <div className="relative h-full md:w-8/12 md:block hidden min-h-screen rounded-2xl bg-blue-700 p-10">
            <div className="absolute inset-0 flex flex-col justify-center p-10">
                <h1 className="text-xl font-semibold text-white md:text-2xl lg:text-4xl">Hubungi Kami</h1>
                <p className="mt-4 text-neutral-200">
                    Apakah Anda memiliki pertanyaan, masukan, atau membutuhkan bantuan? Tim Clean&Click siap membantu Anda!
                    Jangan ragu untuk mengisi formulir kontak di sebelah kiri atau hubungi kami melalui email dan nomor telepon yang tertera.
                    Kami akan merespons Anda secepat mungkin.
                </p>
            </div>
            <div className="flex h-full flex-col">
                <div className="flex items-center">
                    <Image src="/images/logo-no-text.png" alt="logo" width={600} height={500} className="h-16 w-fit object-cover" />
                    <h1 className="ml-2 font-semibold text-orange-300">CLEAN&CLICK</h1>
                </div>
                <div className="mt-auto font-sans text-sm text-white">
                    &copy; 2024. Clean&Click. All rights reserved.
                </div>
            </div>
        </div>
    );
}