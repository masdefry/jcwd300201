export default function LoadingDashboardWeb() {
    return (
        <main className="w-full h-full bg-neutral-200 p-4 gap-2 hidden md:flex flex-col">
            <section className="w-full h-1/2 rounded-xl flex gap-2">
                <div className="w-full rounded-xl h-full flex items-center bg-neutral-300 animate-pulse p-5">
                    <div className="w-full h-fit"></div>
                </div>
                <div className="w-full rounded-xl h-full bg-gradient-to-tr bg-neutral-300 animate-pulse p-2 gap-2 flex items-center">
                    <div className="w-1/2 h-full flex items-center px-2 flex-col justify-center rounded-xl bg-neutral-300 animate-pulse bg-opacity-45">
                        <div className="py-4 space-y-2 w-full"></div>
                    </div>
                    <div className="w-1/2 h-full bg-neutral-300 animate-pulse bg-opacity-45 rounded-xl"></div>
                </div>
            </section>
            <section className="w-full flex gap-2 h-1/2 bg-gradient-to-tr bg-neutral-300 animate-pulse rounded-xl p-2">
                <div className="w-full px-5 h-full bg-neutral-300 animate-pulse bg-opacity-45 rounded-2xl flex items-center justify-center"></div>
                <div className="w-fit h-full bg-neutral-300 animate-pulse bg-opacity-45 py-3 rounded-2xl flex items-center justify-center"></div>
            </section>
        </main>
    );
}