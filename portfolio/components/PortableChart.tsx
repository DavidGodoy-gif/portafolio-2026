"use client";

import MetricsChart from "@/components/MetricsChart";

export default function PortableChart({ value }: any) {
  if (!value?.metrics?.length) return null;

  return (
    <section className="my-12">
      {value.title && (
        <h3 className="text-xl font-semibold mb-4">{value.title}</h3>
      )}
      <MetricsChart data={value.metrics} />
    </section>
  );
}