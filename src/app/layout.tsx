import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster"
import AuthProvider from "@/context/AuthProvider";


const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Anonymous-message",
  description: "Users can receive anonymous feedback by sharing a unique URL. They share the URL with others, who can then anonymously submit their thoughts. The feedback is accessible to the user through the platform's interface, ensuring privacy and security for both parties",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
        <AuthProvider>
            <body className={inter.className}>
                {children}
                <Toaster />
            </body>
      </AuthProvider>
    </html>
  );
}
