import { ReactNode } from 'react'
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Clean & Click | Syarat dan Ketentuan',
    description: 'Welcome to Clean & Click',
}

export default function Layout({ children }: { children: ReactNode }) {
    return (
        <>
            {children}
        </>
    );
}