export default function ServicePage() {
    const services = [
        {
            title: "Dry Cleaning",
            description: "Layanan dry cleaning profesional untuk kain halus dan pakaian khusus.",
            button: "Pelajari Lebih Lanjut"
        },
        {
            title: "Cuci & Lipat",
            description: "Layanan pencucian dan pelipatan yang praktis untuk kebutuhan sehari-hari Anda.",
            button: "Pelajari Lebih Lanjut"
        },
        {
            title: "Setrika",
            description: "Dapatkan pakaian rapi tanpa kerutan dengan layanan setrika profesional kami.",
            button: "Pelajari Lebih Lanjut"
        }
    ];

    return (
        <main className='w-full h-fit flex flex-col pt-[90px] bg-gray-100'>
            <section className="w-full py-12 px-10 bg-orange-500 text-white text-center">
                <h1 className="text-4xl font-bold mb-4">Layanan Laundry Kami</h1>
                <p className="text-lg">Cepat, Terpercaya, dan Terjangkau untuk Kebutuhan Laundry Anda</p>
            </section>

            <section className="flex flex-col w-full h-full py-12 px-10 gap-12 bg-gray-50">
                <h2 className="text-3xl font-semibold text-center text-gray-800">Pilihan Layanan</h2>
                <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {services.map((service, index) => (
                        <div key={index} className="w-full h-auto bg-white shadow-lg rounded-lg p-8 flex flex-col items-center text-center">
                            <h3 className="text-2xl font-semibold text-gray-800">{service.title}</h3>
                            <p className="text-gray-600 mt-4">{service.description}</p>
                            <button className="mt-6 bg-fuchsia-800 text-white py-2 px-6 rounded hover:bg-fuchsia-900">{service.button}</button>
                        </div>
                    ))}
                </div>
            </section>

            <section className="w-full py-16 px-10 bg-blue-600 text-white text-center relative">
                <h2 className="text-3xl font-bold">Siap Mencoba Layanan Laundry Terbaik?</h2>
                <p className="text-lg mt-4">Hubungi kami sekarang dan biarkan kami menangani kebutuhan laundry Anda!</p>
                <div className="mt-8">
                    <button className="bg-white text-blue-600 py-3 px-8 rounded shadow-md hover:bg-gray-200">Pesan Sekarang</button>
                </div>
            </section>
        </main>
    );
}