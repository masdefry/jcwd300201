'use client'

import MobileWebLayout from "@/components/core/mobileSessionLayout/subMenuLayout";
import { useRouter } from "next/navigation";
import { CgArrowLeft } from "react-icons/cg";

export default function Page() {

    return (
        <>
            <MobileWebLayout title="Bantuan">
                <div className="w-full h-fit">
                    <h1>Hallo</h1>
                </div>
            </MobileWebLayout>
        </>
    );
}