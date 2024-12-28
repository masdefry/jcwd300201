import Image from "next/image"
import header from "./../../../../public/images/New Project (1).webp"

export default function HeaderMobile() {
    return (
        <Image
            src={header}
            alt=""
            className="fixed z-50 md:hidden block"
        />
    )
}