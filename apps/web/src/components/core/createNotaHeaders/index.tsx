import Image from "next/image";

export default function NotaHeader({ email = 'clicknclick@indonesia' }: { email?: string }) {
    return (
        <div className="w-full flex flex-col sm:flex-row justify-between items-center border-b-2 px-5 py-2 bg-neutral-50">
            <div className="flex items-center space-x-2">
                <Image
                    src="/images/logo-no-text.png"
                    alt='logo'
                    width={150}
                    height={150}
                    className="w-fit h-20"
                />
                <div>
                    <h1 className="text-2xl font-bold text-orange-400">CLEAN&CLICK</h1>
                    <p className="text-neutral-400">Laundry & Wash</p>
                </div>
            </div>
            <div className="space-y-2 sm:space-y-1 text-center sm:text-left">
                <p className="text-sm font-medium text-neutral-700">{email}</p>
                <p className="text-sm font-medium text-neutral-700">021-001-420</p>
                <p className="text-sm text-neutral-600">www.cleannclick.com</p>
            </div>
        </div>
    );
}