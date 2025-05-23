import { config } from "@/config";
import { cookieToInitialState } from "@account-kit/core";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { headers } from "next/headers";
import "./globals.css";
import { Providers } from "./providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Fanbase",
  description: "Fanbase - The Ultimate Community Platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Persist state across pages
  // https://accountkit.alchemy.com/react/ssr#persisting-the-account-state
  const initialState = cookieToInitialState(
    config,
    headers().get("cookie") ?? undefined
  );

  return (
    <html lang="en">
      <head>
        <link rel="icon" type="image/png" href="/fanbase_logo.png" />
      </head>
      <body className={inter.className}>
        <Providers initialState={initialState}>{children}</Providers>
      </body>
    </html>
  );
}
