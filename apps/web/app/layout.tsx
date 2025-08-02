import type { Metadata } from "next";
import './globals.css'
import { Poppins } from "next/font/google";
import NextTopLoader from "nextjs-toploader";
import { Toaster } from "sonner";
import React from "react";


export const metadata: Metadata = {
  title: "Avadhi",
  description: "Get your website status in real-time and get notified when they are down.",
};
import { ThemeProvider } from "../components/themeProvider";

const fontSans = Poppins({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-poppins",
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export default function RootLayout({ children }: { children: React.ReactNode }): React.ReactElement {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${fontSans.className} min-h-screen bg-neutral-50 dark:bg-neutral-950 overflow-x-hidden antialiased`}
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <NextTopLoader color="#85ffc7" height={2} />
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}