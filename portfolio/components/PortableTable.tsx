type PortableTableProps = {
    value: {
      title?: string;
      headers?: string[];
      rows?: { cells?: string[] }[];
    };
  };
  
  export default function PortableTable({ value }: PortableTableProps) {
    if (!value?.headers?.length && !value?.rows?.length) return null;
  
    return (
      <section className="my-0 flex h-full min-h-0 w-full flex-col overflow-hidden rounded-[14px] bg-zinc-900 p-5">
        {value.title && (
          <h3 className="m-0 mb-4 text-center text-base font-semibold text-[#d00084]">
            {value.title}
          </h3>
        )}

        <div className="portable-table-scroll min-h-0 flex-1 overflow-auto rounded-xl border border-zinc-800">
        <table className="w-full min-w-max border-collapse bg-zinc-900 text-sm">
          {value.headers?.length ? (
            <thead className="sticky top-0 z-10 bg-zinc-900">
              <tr>
                {value.headers.map((header, index) => (
                  <th
                    key={index}
                    className="border-b codetheme px-4 py-3 text-left font-semibold text-white"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
          ) : null}
  
          <tbody>
            {value.rows?.map((row, rowIndex) => (
              <tr key={rowIndex} className="odd:bg-neutral-950 even:bg-neutral-900/40">
                {row.cells?.map((cell, cellIndex) => (
                  <td
                    key={cellIndex}
                    className="border-t codetheme px-4 py-3 text-neutral-400"
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      </section>
    );
  }
