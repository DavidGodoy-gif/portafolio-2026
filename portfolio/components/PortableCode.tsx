"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import mermaid from "mermaid";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";

type PortableCodeProps = {
  value: {
    title?: string;
    language?: string;
    code?: string;
  };
};

let mermaidInitialized = false;

function initMermaid() {
  if (mermaidInitialized) return;
  mermaid.initialize({
    startOnLoad: false,
    theme: "base",
    themeVariables: {
      background: "#101828",
      primaryColor: "#101828",
      primaryTextColor: "#99A1AF",
      primaryBorderColor: "#5B4FAC",
      lineColor: "#660c54",
      secondaryColor: "#302856",
      tertiaryColor: "#321339",
      fontSize: "20px",
      fontFamily: "Inter, sans-serif",
    },
  });
  mermaidInitialized = true;
}

function formatMermaidError(e: unknown): string {
  if (e instanceof Error) return e.message;
  if (typeof e === "string") return e;
  if (typeof e === "object" && e !== null && Object.keys(e as object).length === 0) {
    return "Diagrama inválido o sintaxis no reconocida; revisa el código Mermaid.";
  }
  try {
    return JSON.stringify(e);
  } catch {
    return String(e);
  }
}

/** Montado con `key={code}` para resetear estado al cambiar el diagrama sin setState síncrono en el efecto. */
function MermaidDiagram({ code }: { code: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [rendered, setRendered] = useState(false);
  const [initialScale, setInitialScale] = useState(1);
  const [mermaidError, setMermaidError] = useState<string | null>(null);
  const reactId = useId();
  const diagramId = useMemo(
    () => `mmd-${reactId.replace(/[^a-zA-Z0-9_-]/g, "_")}`,
    [reactId],
  );

  useEffect(() => {
    if (!ref.current) return;

    initMermaid();

    let cancelled = false;

    mermaid
      .render(diagramId, code)
      .then(({ svg, bindFunctions }) => {
        if (cancelled || !ref.current) return;
        ref.current.innerHTML = svg;
        bindFunctions?.(ref.current);

        const svgNode = ref.current.querySelector("svg");
        const container = wrapperRef.current;

        if (svgNode && container) {
          const svgWidth = svgNode.getBoundingClientRect().width;
          const svgHeight = svgNode.getBoundingClientRect().height;
          const containerWidth = container.clientWidth;
          const containerHeight = container.clientHeight;

          const scaleX = containerWidth / svgWidth;
          const scaleY = containerHeight / svgHeight;
          const scale = Math.min(scaleX, scaleY) * 0.9;
          setInitialScale(Math.min(scale, 1));
        }

        setRendered(true);
      })
      .catch((e) => {
        if (cancelled) return;
        const msg = formatMermaidError(e);
        console.error("Mermaid error:", msg, e);
        setMermaidError(msg);
        setRendered(true);
      });

    return () => {
      cancelled = true;
    };
  }, [diagramId, code]);

  return (
    <div
      ref={wrapperRef}
      className="rounded-2xl border codetheme overflow-hidden"
      style={{ height: 600 }}
    >
      <TransformWrapper
        key={initialScale}
        initialScale={initialScale}
        minScale={1}
        maxScale={9}
        centerOnInit
      >
        {({ zoomIn, zoomOut, resetTransform }) => (
          <>
            <div className="flex gap-2 px-4 py-3 border-b codetheme">
              <button
                type="button"
                onClick={() => zoomIn()}
                className="btnzoom transition-colors"
              >
                +
              </button>
              <button
                type="button"
                onClick={() => zoomOut()}
                className="btnzoom transition-colors"
              >
                -
              </button>
              <button
                type="button"
                onClick={() => resetTransform()}
                className="btnzoom transition-colors"
              >
                Resetear
              </button>
            </div>

            <TransformComponent
              wrapperStyle={{ width: "100%", height: "calc(100% - 53px)" }}
              contentStyle={{
                width: "100%",
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <div className="relative flex min-h-[200px] w-full flex-col items-center justify-center">
                <div
                  ref={ref}
                  className="mermaid"
                  style={{
                    opacity: rendered && !mermaidError ? 1 : 0,
                    transition: "opacity 0.3s ease",
                  }}
                />
                {mermaidError && (
                  <p className="absolute inset-x-4 top-1/2 max-w-prose -translate-y-1/2 text-center text-sm text-red-400">
                    No se pudo dibujar el diagrama Mermaid: {mermaidError}
                  </p>
                )}
              </div>
            </TransformComponent>
          </>
        )}
      </TransformWrapper>
    </div>
  );
}

export default function PortableCode({ value }: PortableCodeProps) {
  const isMermaid = value?.language === "mermaid";

  if (!value?.code) return null;

  return (
    <section className="my-12">
      {value.title && (
        <h3 className="text-xl font-semibold mb-4">{value.title}</h3>
      )}

      {isMermaid ? (
        <MermaidDiagram key={value.code} code={value.code} />
      ) : (
        <div className="overflow-hidden rounded-2xl border codetheme min-h-[500px] w-full">
          <div className="flex items-center justify-between border-b border-neutral-800 px-4 py-2 text-xs uppercase tracking-wide text-neutral-500">
            <span>{value.language || "code"}</span>
          </div>
          <pre className="overflow-auto h-full p-4 text-sm text-neutral-200">
            <code>{value.code}</code>
          </pre>
        </div>
      )}
    </section>
  );
}
