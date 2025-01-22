'use client'

import { useRouter } from "next/navigation";
import { CgArrowLeft } from "react-icons/cg";
import { IContentMobile } from "./type";

export default function MobileSessionLayout({ getDataStore, setOutletId, showStoreSelect = false, outletId, isStoreLoading, isStoreError, children, title = 'Menu' }: IContentMobile) {
    const router = useRouter()
    return (
        <main className="w-full bg-orange-500 block md:hidden">
            <div className="w-full pt-10 h-fit bg-[url('/images/patts.png')]">
                <section className="w-full h-fit space-y-4 min-h-screen px-2 bg-white rounded-t-3xl">
                    <div className="px-3 pt-5 pb-3 border-b flex justify-between gap-2 text-black items-center">
                        <div className="flex gap-2">
                            <button onClick={() => router.back()} className="font-bold"><CgArrowLeft size={20} /> </button>
                            <h1 className="font-bold text-lg">{title}</h1>
                        </div>
                        {showStoreSelect && (
                            <div>
                                <select
                                    className="border rounded px-4 py-1"
                                    value={outletId || ""}
                                    onChange={(e) => {
                                        setOutletId?.(e.target.value);
                                    }}

                                    disabled={isStoreLoading || isStoreError}
                                >
                                    <option value="" disabled>
                                        {isStoreLoading
                                            ? "Memuat..."
                                            : isStoreError
                                                ? "Gagal Memuat"
                                                : "Pilih Toko"}
                                    </option>
                                    <option value="">Semua</option>

                                    {getDataStore?.map((store: any) => (
                                        <option key={store?.storeId} value={store?.storeId}>
                                            {store?.storeName}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        )}
                    </div>
                    {children}
                </section>
            </div>
        </main>
    );
}