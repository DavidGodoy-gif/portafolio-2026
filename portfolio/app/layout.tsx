import "./globals.css";

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
      <body className="bg-white text-black">

      <header className="fixed top-0 left-0 right-0 z-50 flex justify-between items-center px-16 py-6 backdrop-blur border-gray-200">
        <a href="/">
          <img src="/Logo_DG.svg" alt="Logo" width={52} height={28} />
        </a>

        <nav className="space-x-6 text-sm">
          <a href="/">Inicio</a>
          <a href="/casos">Casos</a>
          <a href="/sobre-mi">Sobre mí</a>
        </nav>
      </header>

      <main className="pt-20">
        {children}
      </main>

      </body>

    </html>
  );
}
