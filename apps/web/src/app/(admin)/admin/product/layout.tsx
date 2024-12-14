import { Metadata } from "next";
import { ReactNode } from "react";

export const metadata: Metadata = {
    title: 'Clean & Click | Produk Laundry',
    description: 'Welcome to Clean & Click',
}

export default function Layout({ children }: { children: ReactNode }) {
    return (
        <>
            {children}
        </>
    );
}