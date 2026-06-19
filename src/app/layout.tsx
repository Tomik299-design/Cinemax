import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "react-hot-toast";
import "./globals.css";
import { Providers } from "@/components/Providers";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: { default: "CineMax", template: "%s | CineMax" },
  description: "Premium movie streaming platform",
  icons: { icon: "/favicon.ico" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} bg-background text-white antialiased`}>
        <Providers>
          {children}
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                background: "#111827",
                color: "#fff",
                border: "1px solid #1f2937",
                borderRadius: "12px",
              },
            }}
          />
        </Providers>
      </body>
    </html>
  );
}
