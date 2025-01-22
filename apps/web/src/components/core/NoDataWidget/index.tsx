import Image from "next/image"

export default function NoDataWidget() {
    return (
        <div className="flex flex-col items-center justify-center text-center">
            <Image
                src="/images/nodata.png"
                alt="No Data Found"
                width={150}
                height={150}
            />
        </div>
    )
}