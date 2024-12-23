import { ReactNode } from "react";

export default function LayoutDetailWorker({ children }: { children: ReactNode }) {
    return (
        <main className="w-full h-full bg-neutral-200 p-4 gap-2 hidden md:flex">
            <section className="w-full flex p-4 rounded-xl h-full">
                <div className="flex flex-col w-full gap-5">
                    <div className="w-full py-4 bg-orange-500 px-14 rounded-xl">
                        <h1 className="font-bold text-white">Data Diri Pekerja</h1>
                    </div>
                    {children}
                </div>
            </section>
        </main>
    );
}