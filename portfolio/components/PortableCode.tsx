"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import mermaid from "mermaid";
import {
  TransformWrapper,
  TransformComponent,
  type ReactZoomPanPinchContentRef,
} from "react-zoom-pan-pinch";

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
  /** Evita hidratación: el SVG solo existe en el cliente; SSR y primer paint coinciden en el placeholder. */
  const [mounted, setMounted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  /** Área real del diagrama (excl. barra de zoom); evita height % sin cadena de altura en móvil. */
  const viewportRef = useRef<HTMLDivElement>(null);
  /** Controles del zoom (no usar `key` en `TransformWrapper` con escala: el remount borra el SVG de Mermaid). */
  const transformControlsRef = useRef<ReactZoomPanPinchContentRef | null>(null);
  const fitScaleRef = useRef(1);
  const [rendered, setRendered] = useState(false);
  const [mermaidError, setMermaidError] = useState<string | null>(null);
  const reactId = useId();
  const diagramId = useMemo(
    () => `mmd-${reactId.replace(/[^a-zA-Z0-9_-]/g, "_")}`,
    [reactId],
  );

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || !ref.current) return;

    initMermaid();

    let cancelled = false;

    mermaid
      .render(diagramId, code)
      .then(({ svg, bindFunctions }) => {
        if (cancelled || !ref.current) return;
        ref.current.innerHTML = svg;
        bindFunctions?.(ref.current);

        const applyFitScale = () => {
          const svgNode = ref.current?.querySelector("svg");
          const container = viewportRef.current;
          if (!svgNode || !container) return;

          const svgWidth = svgNode.getBoundingClientRect().width;
          const svgHeight = svgNode.getBoundingClientRect().height;
          const containerWidth = container.clientWidth;
          const containerHeight = container.clientHeight;

          if (svgWidth > 0 && svgHeight > 0 && containerWidth > 0 && containerHeight > 0) {
            const scaleX = containerWidth / svgWidth;
            const scaleY = containerHeight / svgHeight;
            const fit = Math.min(Math.min(scaleX, scaleY) * 0.9, 1);
            fitScaleRef.current = fit;

            const applyCenterWhenReady = (attempt = 0) => {
              const ctrl = transformControlsRef.current;
              if (ctrl?.instance?.isInitialized) {
                ctrl.centerView(fit, 0, "linear");
                return;
              }
              if (attempt < 40) {
                requestAnimationFrame(() => applyCenterWhenReady(attempt + 1));
              }
            };
            requestAnimationFrame(() => applyCenterWhenReady());
          }
        };

        requestAnimationFrame(() => requestAnimationFrame(applyFitScale));

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
  }, [mounted, diagramId, code]);

  if (!mounted) {
    return (
      <div
        className="flex h-[400px] flex-col overflow-hidden rounded-2xl border codetheme md:h-[600px]"
        role="status"
        aria-label="Cargando diagrama"
      >
        <div className="h-[49px] shrink-0 border-b codetheme" />
        <div className="min-h-0 flex-1 animate-pulse bg-neutral-800/15" />
      </div>
    );
  }

  return (
    <div className="flex h-[400px] flex-col overflow-hidden rounded-2xl border codetheme md:h-[600px]">
      <TransformWrapper
        initialScale={1}
        minScale={0.15}
        maxScale={9}
        centerOnInit
        centerZoomedOut
      >
        {(controls) => {
          transformControlsRef.current = controls;
          const { zoomIn, zoomOut } = controls;
          return (
          <>
            <div className="flex shrink-0 gap-2 border-b px-4 py-3 codetheme">
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
                onClick={() =>
                  transformControlsRef.current?.centerView(fitScaleRef.current, 200, "easeOut")
                }
                className="btnzoom transition-colors"
              >
                Resetear
              </button>
            </div>

            <div ref={viewportRef} className="min-h-0 flex-1">
              <TransformComponent
                wrapperClass="!h-full !w-full !max-w-none"
                wrapperStyle={{ width: "100%", height: "100%", maxWidth: "100%" }}
                contentStyle={{
                  width: "100%",
                  maxWidth: "100%",
                  minHeight: "min-content",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
              <div className="relative flex min-h-[200px] w-full flex-col items-center justify-center">
                <div
                  ref={ref}
                  className="mermaid-svg-host"
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
            </div>
          </>
          );
        }}
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
        <div className="overflow-hidden rounded-2xl border codetheme min-h-[300px] w-full">
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
