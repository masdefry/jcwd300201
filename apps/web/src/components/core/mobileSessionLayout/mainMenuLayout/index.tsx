import { ReactNode } from "react";

export default function ContentMobileLayout({ children, title = 'Menu', icon, notification = null }: { notification?: ReactNode | null, children: ReactNode, icon?: ReactNode, title: string }) {
    return (
        <main className="w-full bg-orange-500 block md:hidden">
            <div className="w-full pt-10 h-fit bg-[url('/images/patts.png')]">
                <section className="w-full h-fit space-y-4 min-h-screen px-2 bg-white rounded-t-3xl">
                    <div className="px-3 pt-5 pb-3 border-b flex gap-2 text-black items-center justify-between">
                        <div className="flex items-center gap-2">
                            {icon}
                            <h1 className="font-bold text-lg">{title}</h1>
                        </div>
                        {notification && notification}
                    </div>
                    {children}
                </section>
            </div>
        </main>
    );
}