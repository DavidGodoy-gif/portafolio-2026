"use client";

import MetricsChart from "@/components/MetricsChart";

export default function PortableChart({ value }: any) {
  if (!value?.metrics?.length) return null;

  return (
    <section className="my-0 flex min-h-[390px] w-full flex-col overflow-hidden rounded-[14px] bg-[#18181b] p-5">
      {value.title && (
        <h3 className="m-0 mb-3 text-center text-base font-semibold text-[#d00084]">{value.title}</h3>
      )}
      <MetricsChart data={value.metrics} />
    </section>
  );
}
