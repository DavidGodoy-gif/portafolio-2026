type PdfAsset = {
  url?: string;
  originalFilename?: string;
  mimeType?: string;
};

type PortablePdfProps = {
  value: {
    title?: string;
    file?: {
      asset?: PdfAsset | null;
    } | null;
  };
};

export default function PortablePdf({ value }: PortablePdfProps) {
  const url = value?.file?.asset?.url;
  if (!url) return null;

  const filename =
    value?.file?.asset?.originalFilename?.trim() || "documento.pdf";
  const heading = value?.title?.trim();

  return (
    <section className="my-10">
      {heading && (
        <h3 className="text-xl font-semibold mb-4 text-neutral-100">
          {heading}
        </h3>
      )}

      <div className="overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-950">
        <iframe
          title={heading || filename}
          src={`${url}#view=FitH`}
          className="w-full min-h-[min(70vh,720px)] border-0 bg-neutral-900"
        />
      </div>

      <p className="mt-3 text-sm text-neutral-500">
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-cyan-400/90 underline underline-offset-2 hover:text-cyan-300"
        >
          Abrir o descargar PDF
        </a>
        <span className="mx-2 text-neutral-400">·</span>
        <span className="text-neutral-400">{filename}</span>
      </p>
    </section>
  );
}
