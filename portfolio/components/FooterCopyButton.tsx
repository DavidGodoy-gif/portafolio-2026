"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type FooterCopyButtonProps = {
  copyText: string;
  label: string;
  className?: string;
  children: React.ReactNode;
};

export function FooterCopyButton({
  copyText,
  label,
  className,
  children,
}: FooterCopyButtonProps) {
  const [copied, setCopied] = useState(false);
  const [fadeIn, setFadeIn] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  useEffect(() => {
    if (!copied) {
      setFadeIn(false);
      return;
    }
    setFadeIn(false);
    const id = requestAnimationFrame(() => {
      requestAnimationFrame(() => setFadeIn(true));
    });
    return () => cancelAnimationFrame(id);
  }, [copied]);

  const handleCopy = useCallback(async () => {
    const text = copyText.trim();
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => setCopied(false), 2500);
    } catch {
      setCopied(false);
    }
  }, [copyText]);

  return (
    <span className="inline-flex items-center gap-2 relative">
      <button
        type="button"
        onClick={handleCopy}
        className={className}
        aria-label={label}
      >
        {children}
      </button>
      {copied ? (
        <div
          className={`btncopy ${
            fadeIn ? "opacity-100" : "opacity-0"
          }`}
          role="status"
        >
          Copiado
        </div>
      ) : null}
    </span>
  );
}
