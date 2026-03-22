import { client } from "@/lib/sanity";
import { FooterCopyButton } from "@/components/FooterCopyButton";

const FOOTER_QUERY = `
  *[_type == "footer"][0]{
    copyrightLine,
    linkedinLabel,
    linkedinUrl,
    githubLabel,
    githubUrl,
    emailLabel,
    email,
    phoneLabel,
    phone
  }
`;

const DEFAULTS = {
  copyrightLine: "© 2026 David Godoy. Todos los derechos reservados.",
  linkedinLabel: "LinkedIn",
  linkedinUrl: "https://www.linkedin.com/in/david-godoy-ux-engineer/",
  githubLabel: "GitHub",
  githubUrl: "https://github.com/davidgodoy",
  emailLabel: "Correo",
  email: "davidgodoy@gmail.com",
  phoneLabel: "Teléfono",
  phone: "+52 123 456 7890",
} as const;

type FooterDoc = {
  copyrightLine?: string | null;
  linkedinLabel?: string | null;
  linkedinUrl?: string | null;
  githubLabel?: string | null;
  githubUrl?: string | null;
  emailLabel?: string | null;
  email?: string | null;
  phoneLabel?: string | null;
  phone?: string | null;
};

async function getFooter(): Promise<FooterDoc | null> {
  return client.fetch(
    FOOTER_QUERY,
    {},
    { next: { revalidate: 60, tags: ["footer"] } },
  );
}

function LinkedInIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="h-5 w-5 shrink-0"
      aria-hidden
    >
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

function GitHubIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="h-5 w-5 shrink-0"
      aria-hidden
    >
      <path
        fillRule="evenodd"
        d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="h-5 w-5 shrink-0"
      aria-hidden
    >
      <path d="M1.5 8.67v8.58a3 3 0 003 3h15a3 3 0 003-3V8.67l-8.928 5.493a3 3 0 01-3.144 0L1.5 8.67z" />
      <path d="M22.5 6.908V6.75a3 3 0 00-3-3h-15a3 3 0 00-3 3v.158l9.714 5.978a1.5 1.5 0 001.572 0L22.5 6.908z" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="h-5 w-5 shrink-0"
      aria-hidden
    >
      <path
        fillRule="evenodd"
        d="M1.5 4.5a3 3 0 013-3h1.372c.86 0 1.61.586 1.819 1.42l1.105 4.423a1.875 1.875 0 01-.694 1.955l-1.293.97c-.135.101-.164.249-.126.352a11.285 11.285 0 006.697 6.697c.103.038.25.009.352-.126l.97-1.293a1.875 1.875 0 011.955-.694l4.423 1.105c.834.209 1.42.959 1.42 1.82V19.5a3 3 0 01-3 3h-2.25C8.552 22.5 1.5 15.448 1.5 6.75V4.5z"
        clipRule="evenodd"
      />
    </svg>
  );
}

export async function Footer() {
  const data = await getFooter();

  const copyrightLine = data?.copyrightLine ?? DEFAULTS.copyrightLine;
  const linkedinLabel = data?.linkedinLabel ?? DEFAULTS.linkedinLabel;
  const linkedinUrl = data?.linkedinUrl ?? DEFAULTS.linkedinUrl;
  const githubLabel = data?.githubLabel ?? DEFAULTS.githubLabel;
  const githubUrl = data?.githubUrl ?? DEFAULTS.githubUrl;
  const emailLabel = data?.emailLabel ?? DEFAULTS.emailLabel;
  const email = data?.email ?? DEFAULTS.email;
  const phoneLabel = data?.phoneLabel ?? DEFAULTS.phoneLabel;
  const phone = data?.phone ?? DEFAULTS.phone;

  const footerSocialClass = "footer-social-icon text-sm";

  return (
    <footer className="bg-gray-950 px-6 py-10 md:px-16">
      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4 md:justify-start">
          <a
            href={linkedinUrl}
            className={footerSocialClass}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={linkedinLabel}
          >
            <LinkedInIcon />
          </a>
          <a
            href={githubUrl}
            className={footerSocialClass}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={githubLabel}
          >
            <GitHubIcon />
          </a>
          <FooterCopyButton copyText={email} label={emailLabel} className={footerSocialClass}>
            <MailIcon />
          </FooterCopyButton>
          <FooterCopyButton copyText={phone} label={phoneLabel} className={footerSocialClass}>
            <PhoneIcon />
          </FooterCopyButton>
        </div>
        <p className="max-w-xl whitespace-pre-line text-center text-sm text-gray-600 md:text-right">
          {copyrightLine}
        </p>
      </div>
    </footer>
  );
}
