import HeaderMobileUser from "@/components/core/headerMobileUser";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

export default function pickupLaundry() {
    return (
        <main className="w-full h-fit">
            <section className="w-full h-fit max-w-[425px] md:max-w-full md:w-full block md:hidden">
                <HeaderMobileUser />
                <main className="mx-8">
                    <section className="bg-white font-bold w-full fixed pt-16 text-lg border-b-2 pb-4">
                        REQUEST PICK UP LAUNDRY
                    </section>
                    <section className="space-y-4 ">
                        <section className="pt-32">
                            <div className="font-bold flex justify-center">Alamat</div>
                            <div className="border border-gray-400 rounded-lg p-2 text-center">data alamat utama, kalau diklik masuk bagian address buat setting alamat utama</div>
                        </section>
                        <section className="">
                            <div className="font-bold flex justify-center">Store Terdekat</div>
                            <div className="border border-gray-400 rounded-lg p-2 text-center">muncul list store beserta jaraknya ke alamat user sekarang</div>
                        </section>
                        <section className="">
                            <div className="font-bold flex justify-center">Estimasi Ongkos Kirim</div>
                            <div className="border w-fit flex justify-center p-2 border-gray-400 rounded-lg text-center">Rp9999</div>
                        </section>
                        <section className="">
                            <div className="font-bold">Tipe Laundry</div>
                            <Select>
                                <SelectTrigger className="w-[150px]">
                                    <SelectValue placeholder="Pilih Lokasi" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectItem value="1">Cuci Saja</SelectItem>
                                        <SelectItem value="2">Setrika Saja</SelectItem>
                                        <SelectItem value="3">Cuci dan Setrika</SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </section>
                    </section>
                </main>
            </section>
        </main>
    )
}