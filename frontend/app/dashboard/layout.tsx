// app/dashboard/layout.tsx
"use client";
import { ReactNode } from "react";

export default function DashboardLayout({ children }: { children: ReactNode }) {
    return (
        <div className="d-flex">
            <div className="flex-grow-1">
                {children}
            </div>
        </div>
    );
}
