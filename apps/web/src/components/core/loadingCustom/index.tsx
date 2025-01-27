import Image from "next/image"

export default function Loading() {
    return (
        <div className="flex flex-col items-center justify-center text-center py-10">
            <Image
                src="/images/loading.gif"
                alt="Loading..."
                width={100}
                height={100}
            />
        </div>
    )
}