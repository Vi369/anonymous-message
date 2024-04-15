import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

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
      <body className={inter.className}>{children}</body>
    </html>
  );
}
