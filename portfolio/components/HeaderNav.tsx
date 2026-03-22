"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

const links = [
  { href: "/", label: "Inicio" },
  { href: "/casos", label: "Casos" },
  { href: "/sobre-mi", label: "Sobre mí" },
] as const;

export function HeaderNav() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      <nav
        className="hidden md:flex items-center gap-6 text-sm"
        aria-label="Principal"
      >
        {links.map(({ href, label }) => (
          <Link key={href} href={href}>
            {label}
          </Link>
        ))}
      </nav>

      <button
        type="button"
        className="md:hidden inline-flex h-10 w-10 items-center justify-center rounded-md text-gray-400 hover:bg-white/10"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls="mobile-menu"
        aria-label={open ? "Cerrar menú" : "Abrir menú"}
      >
        {open ? (
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            aria-hidden
          >
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        ) : (
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            aria-hidden
          >
            <path d="M4 7h16M4 12h16M4 17h16" />
          </svg>
        )}
      </button>

      {open &&
        createPortal(
          <div
            id="mobile-menu"
            className="fixed inset-0 z-100 flex min-h-dvh w-full flex-col items-center justify-center bg-black/40 px-6 backdrop-blur-xl md:hidden"
            role="dialog"
            aria-modal="true"
            aria-label="Menú de navegación"
            onClick={() => setOpen(false)}
          >
            <nav
              className="flex flex-col items-center justify-center gap-10 text-center text-lg "
              aria-label="Principal"
              onClick={(e) => e.stopPropagation()}
            >
              {links.map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  className="min-w-48 py-3 bglink"
                  onClick={() => setOpen(false)}
                >
                  {label}
                </Link>
              ))}
            </nav>
          </div>,
          document.body
        )}
    </>
  );
}
