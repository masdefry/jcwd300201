'use client'

import Link from "next/link";
import { MdArrowRight } from "react-icons/md";
import { IMenuCustom } from "./types";

export default function MenuCustom({ children, navigation, url }: IMenuCustom) {
    return (
        <Link href={url} className="pb-2 border-b flex items-center px-2 w-full hover:text-neutral-600">
            <div className="w-full flex justify-between">
                <span className="flex items-center gap-3">
                    {children} {navigation}
                </span>
                <span className="flex items-center gap-3">
                    <MdArrowRight />
                </span>
            </div>
        </Link>
    );
}