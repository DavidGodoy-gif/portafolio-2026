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

      <a className="skip-link" href="#contenido">Saltar al contenido</a>
      <header className="site-header">
       <div className="site-header-inner">
        <a href="/" className="brand" aria-label="David Godoy, inicio">
          <img src="/Logo_DG.svg" alt="DG" width={52} height={28} />
        </a>

        <HeaderNav />
       </div>
      </header>

      <div className="pt-20" id="contenido" tabIndex={-1}>
        {children}
      </div>

      <Footer />

      </body>

    </html>
  );
}
