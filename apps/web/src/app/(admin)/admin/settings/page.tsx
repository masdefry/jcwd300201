import ButtonCustom from "@/components/core/button";
import { RiShutDownLine } from "react-icons/ri";
import HeaderMobile from "@/components/core/headerMobile";
import { FaUser, FaStore, FaClock, FaCut, FaTags, FaTruck, FaCashRegister, FaUsers, FaReceipt, FaHome, FaClipboardList, FaChartBar, FaCog } from 'react-icons/fa';

const settingsItems = [
    { name: 'Pengaturan Akun', description: 'Ubah password akun anda', icon: FaUser },
    { name: 'Pengaturan Outlet', description: 'Tambah, ubah, hapus outlet laundry', icon: FaStore },
    { name: 'Pengaturan Layanan', description: 'Tambah, ubah, hapus layanan', icon: FaCut },
    { name: 'Pengaturan Antar-Jemput', description: 'Tambah, ubah, hapus antar-jemput', icon: FaTruck },
    { name: 'Pengaturan Kasir', description: 'Atur, tambah, ubah, hapus kasir', icon: FaCashRegister },
    { name: 'Pengaturan Pelanggan', description: 'Tambah, ubah, hapus pelanggan', icon: FaUsers },
    { name: 'Pengaturan Nota', description: 'Atur tampilan nota', icon: FaReceipt },
];

export default function pengaturanAdmin() {
    return (
        <main className="w-full h-fit">
            <section className="w-full h-fit max-w-[425px] md:max-w-full md:w-full block md:hidden">
                <HeaderMobile />
                <main className="mx-8">
                    <section className="bg-white font-bold w-full fixed pt-16 text-lg border-b-2 pb-4">
                        PENGATURAN
                    </section>
                    <div className="py-28 space-y-4">
                        {settingsItems.map((item, index) => (
                            <div
                                key={index}
                                className="flex items-center bg-white p-4 rounded-lg shadow-sm transition-all duration-200 hover:bg-gray-100"
                            >
                                <div className="flex-shrink-0 p-3 bg-orange-400 rounded-lg">
                                    <item.icon className="h-6 w-6 text-white" />
                                </div>
                                <div className="ml-4">
                                    <h2 className="font-medium text-gray-900">{item.name}</h2>
                                    <p className="text-sm text-gray-500">{item.description}</p>
                                </div>
                            </div>
                        ))}
                        <div className="flex justify-center w-full ">
                            <ButtonCustom rounded="rounded-lg" btnColor="bg-red-500"><RiShutDownLine />
                                <span className="ml-2">Keluar Akun</span></ButtonCustom>
                        </div>
                    </div>
                </main>
            </section>
        </main>
    )
}