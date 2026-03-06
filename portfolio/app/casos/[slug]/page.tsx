import MetricsChart from '@/components/MetricsChart'
import { client } from "@/lib/sanity";
import { PortableText } from "@portabletext/react";
import { style } from 'framer-motion/client';
import { h3 } from 'framer-motion/m';

const styles = {
  h2: {
    fontSize: '1.2rem',
    fontWeight: 'bold',
    marginTop: '1.5rem',
    marginBottom: '0.5rem',
  },
  h3: {
    fontSize: '1rem',
    fontWeight: 'bold',
    marginTop: '1rem',
    marginBottom: '0.3rem',
    textDecoration: 'underline',
  },
  ul: {
    listStyleType: 'disc',
    marginLeft: '1.5rem',
    marginBottom: '1rem',
  },
  li: {
    marginBottom: '0.3rem',
  },
}

const components = {
  block: {
    h2: (props: any) => <h2 style={styles.h2}>{props.children}</h2>,
    h3: (props: any) => <h3 style={styles.h3}>{props.children}</h3>,
  },
  list: {
    bullet: (props: any) => <ul style={styles.ul}>{props.children}</ul>,
    number: (props: any) => <ol style={styles.ul}>{props.children}</ol>,
  },
  listItem: {
    bullet: (props: any) => <li style={styles.li}>{props.children}</li>,
    number: (props: any) => <li style={styles.li}>{props.children}</li>,
  },
}

async function getCaso(slug: string) {
  return client.fetch(
    `*[_type == "case" && slug.current == $slug][0]{
      title,
      problem,
      process,
      metrics
    }`,
    { slug }
  );
}


export default async function Caso({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const caso = await getCaso(slug);

  return (
    <main className="px-16 py-24">
      <h1 className="text-4xl font-bold">
        {caso?.title}
      </h1>

      <p className="mt-6 text-neutral-400">
        {caso?.problem}
      </p>
      {caso?.process && (
      <section className="mt-16 max-w-3xl">
        <h2 className="text-2xl font-semibold mb-4">Proceso</h2>

        <div className="text-neutral-400">
          <PortableText value={caso.process} components={components} />
        </div>
      </section>
    )}
    {caso?.metrics && (
      <MetricsChart data={caso.metrics} />
    )}
    </main>
  );
}