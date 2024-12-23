import { ReactNode } from "react";

export default function ContentWebLayout({ caption = 'Caption disini', height = 'h-full', children }: { caption: string, children: ReactNode, height?: string }) {
    return (
        <main className="w-full h-full bg-neutral-200 p-4 gap-2 hidden md:flex">
            <section className="w-full flex flex-col p-4 rounded-xl h-full bg-white overflow-y-auto">
                <div className={`flex flex-col w-full ${height} gap-5`}>
                    <div className="w-full py-4 bg-orange-500 px-14 rounded-xl">
                        <h1 className="font-bold text-white">{caption}</h1>
                    </div>
                    {children}
                </div>
            </section>
        </main>
    );
}