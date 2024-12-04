import { IoAddCircleSharp, IoSearchSharp, IoPersonSharp } from "react-icons/io5";
import { GrUserWorker } from "react-icons/gr";
import { FaWhatsapp, FaStore } from "react-icons/fa";
import { MdOutlineStickyNote2 } from "react-icons/md";
import Image from "next/image";

const iconButtons = [
    { icon: FaStore, label: "Data Outlet" },
    { icon: IoSearchSharp, label: "Cari Pesanan" },
    { icon: IoPersonSharp, label: "Data Pelanggan" },
    { icon: GrUserWorker, label: "Data Pekerja" },
];

export default function AdminDashboard() {
    return (
        <main className="w-full h-fit">
           <section className="w-full h-fit md:hidden block md:max-w-full max-w-[425px]">
                <section>
                    <Image src={'/images/New Project.webp'} alt="header" 
                    height={500} width={500}/>
                </section>
                {/* Header Image */}

                {/* Location Section */}
                <section className="border border-gray-400 rounded-t-lg p-4 mt-4 mx-8">
                    <div className="flex justify-between items-center">
                        <div className="font-semibold text-gray-600">CnC Jakarta</div>
                        <button className="text-sm flex items-center border rounded-lg border-gray-400 p-2 gap-1">
                            Tambah Lokasi <IoAddCircleSharp />
                        </button>
                    </div>
                </section>

                {/* Orders Section */}
                <section className="border border-gray-400 bg-sky-200 rounded-b-lg text-sm p-4 mx-8 text-gray-700">
                    <div className="flex justify-between">
                        <div className="flex items-center gap-1">
                            <MdOutlineStickyNote2 size={20} /> Pesanan Hari Ini
                        </div>
                        <div className="font-semibold text-right">
                            <div>Rp0</div>
                            <div>0 pesanan</div>
                        </div>
                    </div>
                    <div className="border-t-2 border-gray-400 mt-4 pt-4 flex">
                        <div className="flex-1 text-center text-lg font-bold">
                            0 <span className="text-sm">kg</span>
                        </div>
                        <div className="flex-1 text-center text-lg font-bold">
                            0 <span className="text-sm">pcs</span>
                        </div>
                    </div>
                </section>

                {/* Icon Buttons Section */}
                <section className="bg-white mx-8 grid grid-cols-2 gap-y-6 justify-around my-6">
                    {iconButtons.map((item, index) => (
                        <button key={index} className="flex flex-col items-center space-y-1">
                            <item.icon className="text-gray-500 text-5xl border-2 w-24 h-24 rounded-lg border-gray-300 p-6 bg-white transition-colors ease-in-out duration-200 active:bg-gray-300" />
                            <span className="text-base">{item.label}</span>
                        </button>
                    ))}
                </section>

                {/* Help Section */}
                <section className="bg-green-100 p-4 mx-8 mb-4 rounded-lg">
                    <div className="flex items-center space-x-2">
                        <FaWhatsapp className="text-gray-600" size={24} />
                        <span className="font-semibold">Butuh bantuan?</span>
                    </div>
                    <div className="mt-2 text-sm text-gray-600">
                        Chat kami di WhatsApp apabila terdapat error.
                    </div>
                </section>
           </section>
        </main>
    );
}
