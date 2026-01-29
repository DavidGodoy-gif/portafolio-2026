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
      <body className="bg-black text-white antialiased">

      <header className="flex justify-between items-center px-16 py-6">
        <span className="font-bold">DG</span>

        <nav className="space-x-6 text-sm text-neutral-400">
          <a href="/">Inicio</a>
          <a href="/casos">Casos</a>
          <a href="/sobre-mi">Sobre mí</a>
        </nav>
      </header>

      {children}

      </body>

    </html>
  );
}
