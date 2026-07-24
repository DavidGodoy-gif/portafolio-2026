import "./globals.css";
import { Footer } from "@/components/Footer";
import { HeaderNav } from "@/components/HeaderNav";
import localFont from "next/font/local";

const figtree = localFont({
  src: [
    { path: "./fonts/Figtree-Regular.ttf", weight: "400", style: "normal" },
    { path: "./fonts/Figtree-Bold.ttf", weight: "700", style: "normal" },
  ],
  variable: "--font-figtree",
  display: "swap",
});

const inter = localFont({
  src: [
    { path: "./fonts/Inter-Regular.ttf", weight: "400", style: "normal" },
    { path: "./fonts/Inter-Bold.ttf", weight: "700", style: "normal" },
  ],
  variable: "--font-inter",
  display: "swap",
});

export const metadata = {
  title: "David Godoy — UX + Frontend",
  description: "UX Developer Portfolio",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className={`${figtree.variable} ${inter.variable} bg-white text-black`}>

      <header className="fixed top-0 left-0 right-0 z-110 flex justify-between items-center px-6 py-6 md:px-16 backdrop-blur border-gray-200">
        <a href="/">
          <img src="/Logo_DG.svg" alt="Logo" width={52} height={28} />
        </a>

        <HeaderNav />
      </header>

      <main className="pt-20">
        {children}
      </main>

      <Footer />

      </body>

    </html>
  );
}
