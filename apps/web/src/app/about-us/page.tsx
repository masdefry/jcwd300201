'use client'

import { useAboutUsHooks } from "@/features/aboutUs/hooks/useAboutUsHooks";
import React from "react";
import AboutUsComponent from "@/features/aboutUs/components/aboutUsComponent";
import TimComponent from "@/features/aboutUs/components/timComponent";
export default function Page() {
    const { boxContent, teamContent } = useAboutUsHooks()
    return (
        <main className="w-full h-fit flex-col pt-0 md:pb-0 pb-28 flex md:pt-[90px]">
            <AboutUsComponent boxContent={boxContent} />
            <TimComponent teamContent={teamContent} />
        </main>
    );
}