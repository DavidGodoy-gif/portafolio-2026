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
const MERMAID_INITIAL_SCALE_BOOST = 0.9;
const MERMAID_INITIAL_SCALE_MAX = 2.25;

function initMermaid() {
  if (mermaidInitialized) return;
  mermaid.initialize({
    startOnLoad: false,
    theme: "base",
    // This CSS is included in Mermaid's temporary SVG while labels are measured,
    // and in the final SVG. Article typography must not change their geometry.
    themeCSS: `
      text, tspan, .label, .nodeLabel, .edgeLabel,
      foreignObject div, foreignObject span, foreignObject p {
        font-family: var(--font-inter), sans-serif;
        font-size: 16px;
        line-height: 1.5;
      }
      foreignObject p {
        margin: 0; padding: 0;
        white-space: normal; overflow-wrap: normal; word-break: normal;
      }
    `,
    themeVariables: {
      background: "#18181b",
      primaryColor: "#18181b",
      primaryTextColor: "#00aeef",
      primaryBorderColor: "#d00084",
      lineColor: "#6b5bd2",
      secondaryColor: "#302856",
      tertiaryColor: "#321339",
      fontSize: "16px",
      fontFamily: "var(--font-inter), sans-serif",
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
    let resizeObserver: ResizeObserver | undefined;

    const renderDiagram = async () => {
      const font = getComputedStyle(document.body).getPropertyValue('--font-inter').trim();
      if (font) await document.fonts.load(`16px ${font}`);
      await document.fonts.ready;
      if (cancelled) return;
      return mermaid.render(diagramId, code);
    };
    renderDiagram()
      .then((result) => {
        if (cancelled || !ref.current || !result) return;
        const {svg, bindFunctions} = result;
        ref.current.innerHTML = svg;
        bindFunctions?.(ref.current);

        const applyFitScale = () => {
          const svgNode = ref.current?.querySelector("svg");
          const container = viewportRef.current;
          if (!svgNode || !container) return;

          // Use untransformed dimensions so zoom/resize never changes the fit baseline.
          const {width: svgWidth, height: svgHeight} = svgNode.viewBox.baseVal;
          svgNode.style.maxWidth = 'none';
          svgNode.style.width = `${svgWidth}px`;
          svgNode.style.height = `${svgHeight}px`;
          const containerWidth = container.clientWidth;
          const containerHeight = container.clientHeight;

          if (svgWidth > 0 && svgHeight > 0 && containerWidth > 0 && containerHeight > 0) {
            const scaleX = containerWidth / svgWidth;
            const scaleY = containerHeight / svgHeight;
            const fit = Math.min(
              Math.min(scaleX, scaleY) * MERMAID_INITIAL_SCALE_BOOST,
              MERMAID_INITIAL_SCALE_MAX,
            );
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
        resizeObserver = new ResizeObserver(applyFitScale);
        if (viewportRef.current) resizeObserver.observe(viewportRef.current);

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
      resizeObserver?.disconnect();
    };
  }, [mounted, diagramId, code]);

  if (!mounted) {
    return (
      <div
        className="flex min-h-[300px] flex-1 flex-col overflow-hidden"
        role="status"
        aria-label="Cargando diagrama"
      >
        <div className="h-[42px] shrink-0 codetheme" />
        <div className="min-h-0 flex-1 animate-pulse bg-neutral-800/15" />
      </div>
    );
  }

  return (
    <div className="flex min-h-[300px] flex-1 flex-col overflow-hidden codetheme">
      <TransformWrapper
        initialScale={1}
        minScale={0.01}
        maxScale={9}
        centerOnInit
        centerZoomedOut
      >
        {(controls) => {
          transformControlsRef.current = controls;
          const { zoomIn, zoomOut } = controls;
          return (
          <>
            <div className="flex shrink-0 gap-2 px-2 py-2 codetheme">
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

            <div ref={viewportRef} className="relative min-h-0 flex-1 overflow-hidden">
              <TransformComponent
                wrapperClass="!h-full !w-full !max-w-none"
                wrapperStyle={{ position: "absolute", inset: 0, width: "100%", height: "100%", maxWidth: "100%" }}
                contentStyle={{
                  width: "max-content",
                  maxWidth: "none",
                  minHeight: "min-content",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
              <div className="relative flex flex-col items-center justify-center">
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
    <section className="my-0 flex min-h-[390px] max-h-[500px] w-full flex-col overflow-hidden rounded-[14px] bg-zinc-900 p-5">
      {value.title && (
        <h3 className="m-0 mb-3 text-center text-base font-semibold text-[#d00084]">{value.title}</h3>
      )}

      {isMermaid ? (
        <MermaidDiagram key={value.code} code={value.code} />
      ) : (
        <div className="flex min-h-0 w-full flex-1 flex-col overflow-hidden codetheme">
          <div className="flex items-center justify-between border-b border-neutral-800 px-4 py-2 text-xs uppercase tracking-wide text-neutral-500">
            <span>{value.language || "code"}</span>
          </div>
          <pre className="portable-code-scroll min-h-0 flex-1 overflow-auto p-4 text-sm text-neutral-200">
            <code>{value.code}</code>
          </pre>
        </div>
      )}
    </section>
  );
}
