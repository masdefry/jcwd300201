import { ReactNode } from "react";

export default function TableHeadLayout({ children }: { children: ReactNode }) {
    return (
        <thead className="bg-gray-200">
            {children}
        </thead>
    );
}