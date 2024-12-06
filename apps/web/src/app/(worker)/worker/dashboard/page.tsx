import { FaWhatsapp, FaStore } from "react-icons/fa";
import { MdOutlineStickyNote2 } from "react-icons/md";
import Image from "next/image";
import { MdOutlineIron } from "react-icons/md";
import { CgSmartHomeWashMachine } from "react-icons/cg";
import { FaMotorcycle } from "react-icons/fa6";
import { IoLocationOutline } from "react-icons/io5";
import RealTimeClock from "@/features/worker/components/realTimeClock";
import { BsPerson } from "react-icons/bs";

const iconButtons = [
    { icon: BsPerson, label: "Admin Outlet" },
    { icon: CgSmartHomeWashMachine, label: "Cuci" },
    { icon: MdOutlineIron, label: "Setrika" },
    { icon: FaMotorcycle, label: "Driver" },
];

export default function WorkerDashboard() {
    return (
        <main className="w-full h-fit">
            <section className="w-full h-fit md:hidden block md:max-w-full max-w-[425px]">
                <section>
                    <Image src={'/images/New Project.webp'} alt="header"
                        height={500} width={500} />
                </section>
                {/* Header Image */}

                {/* Location Section */}
                <section className="border border-gray-400 rounded-t-lg p-3 mt-4 mx-8">
                    <div className="flex justify-center items-center">
                        <div className="font-semibold text-gray-600 text-base">Halo, -Nama-</div>
                    </div>
                </section>

                {/* Orders Section */}
                <section className="border border-gray-400 bg-sky-200 rounded-b-lg text-base p-4 mx-8 text-gray-700">
                    <div className="flex justify-center items-center">
                        
                        <IoLocationOutline size={30} /> Lokasi Kerja
                        
                    </div>
                    <div className="border-t-2 border-gray-400 mt-3 pt-3 flex justify-center">
                        <RealTimeClock/>
                    </div>
                </section>

                <section className="flex justify-center font-bold mt-3 ">
                    Silahkan pilih pekerjaan anda :
                </section>
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