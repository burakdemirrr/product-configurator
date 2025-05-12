import type { Metadata } from "next";
import { Orbitron, Montserrat } from "next/font/google";
import "./globals.css";

const orbitron = Orbitron({ 
  subsets: ["latin"],
  variable: '--font-orbitron',
  display: 'swap'
});

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: '--font-montserrat',
  display: 'swap'
});

export const metadata: Metadata = {
  title: "3D Product Configurator",
  description: "Interactive 3D product configurator built with Next.js, React Three Fiber, and Zustand",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;600;700&family=Montserrat:wght@300;400;500;600;700&display=swap" />
      </head>
      <body className={`${orbitron.variable} ${montserrat.variable}`}>{children}</body>
    </html>
  );
}
