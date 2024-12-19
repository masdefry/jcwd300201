import Image from "next/image"
import header from "./../../../../public/images/headeruser.jpg"

export default function HeaderMobileUser() {
    return (
        <Image
            src={header}
            alt=""
            className="fixed z-50 md:hidden block"
        />
    )
}