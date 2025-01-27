import Image from "next/image"

export default function NoData() {
    return (
        <div className="flex flex-col items-center justify-center text-center py-10">
            <Image
                src="/images/nodata.png"
                alt="No Data Found"
                width={250}
                height={250}
            />
        </div>
    )
}