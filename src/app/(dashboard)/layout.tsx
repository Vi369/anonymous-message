import Navbar from "@/components/Navbar";
import React from "react";

interface RootLayoutProps{
    children: React.ReactNode;
}
export default async function RootLayout({children}:RootLayoutProps) {
    return(
        <>
            <Navbar />
            {children}
        </>
    )
}