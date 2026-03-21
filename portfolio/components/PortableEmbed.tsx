type PortableEmbedProps = {
    value: {
      title?: string;
      url?: string;
    };
  };
  
  export default function PortableEmbed({ value }: PortableEmbedProps) {
    if (!value?.url) return null;
  
    return (
      <section className="my-12">
        {value.title && (
          <h3 className="text-xl font-semibold mb-4">{value.title}</h3>
        )}
  
        <div className="overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-950">
          <iframe
            src={value.url}
            className="w-full aspect-video"
            allowFullScreen
          />
        </div>
      </section>
    );
  }