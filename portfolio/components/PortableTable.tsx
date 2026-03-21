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
      <section className="my-12 overflow-x-auto">
        {value.title && (
          <h3 className="text-xl font-semibold mb-4">{value.title}</h3>
        )}
  
        <table className="w-full border-collapse overflow-hidden rounded-xl border codetheme text-sm">
          {value.headers?.length ? (
            <thead className="bg-neutral-900">
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
      </section>
    );
  }