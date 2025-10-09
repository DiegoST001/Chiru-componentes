import React, { useEffect, useMemo, useState } from "react";
import { ServiceService } from "@/features/service/services/service.service";
import { Image } from "@/components/atoms/Image";
import { Text } from "@/components/atoms/Text";
import { Button } from "@/components/atoms/Button";

/* Helpers de precio (los mismos que usas en inventario) */
function currencySymbol(code?: string) {
  if (!code) return "S/.";
  const c = String(code).toUpperCase();
  if (["PEN", "S/.", "S/"].includes(c)) return "S/.";
  if (["USD", "$"].includes(c)) return "$";
  if (["EUR", "€"].includes(c)) return "€";
  return c;
}
function toNumber(maybe: any): number | null {
  if (typeof maybe === "number" && !Number.isNaN(maybe)) return maybe;
  if (typeof maybe === "string" && maybe.trim() && !Number.isNaN(Number(maybe))) return Number(maybe);
  if (maybe && typeof maybe === "object") {
    if (typeof maybe.amount === "number") return maybe.amount;
    if (Array.isArray(maybe.ranges) && maybe.ranges[0]) {
      const r = maybe.ranges[0];
      if (typeof r.amountMin === "number") return r.amountMin;
      if (typeof r.amountMax === "number") return r.amountMax;
      if (typeof r.amount === "number") return r.amount;
    }
  }
  return null;
}
function getPriceAndCurrency(svc: any): { price: number | null; currency?: string } {
  const p1 = toNumber(svc?.price);
  if (p1 !== null) return { price: p1, currency: svc?.currency || svc?.price?.currency };
  const p2 = toNumber(svc?.budget);
  if (p2 !== null) return { price: p2, currency: svc?.currency || svc?.budget?.currency };
  const p3 = toNumber(svc?.price?.amount ?? svc?.price?.ranges);
  if (p3 !== null) return { price: p3, currency: svc?.price?.currency || svc?.currency };
  return { price: null, currency: svc?.currency };
}
function formatPrice(n: number | null, curr?: string) {
  if (n === null) return "—";
  return `${currencySymbol(curr)} ${n.toFixed(2)}`;
}

type Mode = "page" | "inline";

type Props = {
  locale: string;
  initialQuery?: string;        // page
  controlledQuery?: string;     // inline
  initialPage?: number;
  initialLimit?: number;
  mode?: Mode;
  manageUrl?: boolean;          // sync URL (page)
  showRefineInput?: boolean;    // input (page)
  className?: string;
};

function updateUrl(locale: string, q: string, page: number, limit: number) {
  if (typeof window === "undefined") return;
  const params = new URLSearchParams({ q, page: String(page), limit: String(limit) });
  const next = `/${locale}/buscar/servicios?${params.toString()}`;
  window.history.replaceState({}, "", next);
}

export default function ServiceSearchTemplate({
  locale,
  initialQuery = "",
  controlledQuery,
  initialPage = 1,
  initialLimit = 20,
  mode = "page",
  manageUrl = true,
  showRefineInput = true,
  className,
}: Props) {
  const [qState, setQState] = useState(initialQuery);
  const query = typeof controlledQuery === "string" ? controlledQuery : qState;

  const [page, setPage] = useState(initialPage);
  const [limit, setLimit] = useState(initialLimit);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [items, setItems] = useState<any[]>([]);
  const [totalResults, setTotalResults] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const isInline = mode === "inline";
  const showRefiner = !isInline && showRefineInput;

  useEffect(() => setPage(1), [query]);

  useEffect(() => {
    if (mode === "page" && manageUrl) updateUrl(locale, query, page, limit);
  }, [mode, manageUrl, locale, query, page, limit]);

  useEffect(() => {
    const q = (query || "").trim();
    if (!q) {
      setItems([]); setTotalResults(0); setTotalPages(1); setError(null);
      return;
    }
    let cancel = false;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await ServiceService.findByName(q, page, limit);
        if (cancel) return;
        const list = res?.services ?? [];
        const total = Number(res?.totalResults ?? list.length);
        const pages = Number(res?.totalPages ?? Math.max(1, Math.ceil(total / limit)));
        setItems(list);
        setTotalResults(total);
        setTotalPages(pages);
      } catch (e: any) {
        if (!cancel) {
          setItems([]); setTotalResults(0); setTotalPages(1);
          setError(e?.message || "Error al buscar servicios");
        }
      } finally {
        if (!cancel) setLoading(false);
      }
    })();
    return () => { cancel = true; };
  }, [query, page, limit]);

  const canPrev = page > 1;
  const canNext = page < totalPages;

  const headerText = useMemo(() => {
    if (!query) return `Servicios (${totalResults})`;
    return `Resultados para “${query}” (${totalResults})`;
  }, [query, totalResults]);

  if (!query?.trim() && isInline) return null;

  return (
    <div className={className ?? (isInline ? "w-full border-t bg-gray-50" : "")}>
      <div className={`${isInline ? "max-w-6xl mx-auto px-4 py-6" : ""}`}>
        <div className="mb-4">
          <h1 className="text-xl font-semibold">{headerText}</h1>

          {showRefiner && (
            <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-2">
              <input
                value={qState}
                onChange={(e) => { setQState(e.target.value); setPage(1); }}
                onKeyDown={(e) => e.key === "Enter" && setPage(1)}
                placeholder="Refinar búsqueda…"
                className="w-full h-11 rounded-xl border border-gray-200 bg-white px-4"
              />
              <div className="flex items-center gap-2">
                <label className="text-sm text-gray-500">Por página</label>
                <select
                  value={limit}
                  onChange={(e) => { setLimit(Number(e.target.value)); setPage(1); }}
                  className="h-11 rounded-xl border border-gray-200 bg-white px-3"
                >
                  {[12, 20, 30, 40].map((n) => <option key={n} value={n}>{n}</option>)}
                </select>
              </div>
              <div className="flex items-center justify-end gap-2">
                <button
                  type="button"
                  disabled={!canPrev}
                  onClick={() => canPrev && setPage((p) => p - 1)}
                  className={`px-3 py-2 rounded-lg border text-sm ${
                    canPrev ? "bg-white border-gray-200 hover:bg-gray-50" : "bg-gray-100 border-gray-100 text-gray-400 cursor-not-allowed"
                  }`}
                >
                  Anterior
                </button>
                <div className="text-sm text-gray-600">Página {page} de {totalPages}</div>
                <button
                  type="button"
                  disabled={!canNext}
                  onClick={() => canNext && setPage((p) => p + 1)}
                  className={`px-3 py-2 rounded-lg border text-sm ${
                    canNext ? "bg-white border-gray-200 hover:bg-gray-50" : "bg-gray-100 border-gray-100 text-gray-400 cursor-not-allowed"
                  }`}
                >
                  Siguiente
                </button>
              </div>
            </div>
          )}
        </div>

        {loading && <div className="text-gray-500">Cargando…</div>}
        {error && <div className="text-red-600">{String(error)}</div>}

        {!loading && items.length > 0 && (
          <section className={`${isInline ? "" : "mb-8"}`}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {items.map((s: any) => {
                const img =
                  s?.images?.[0]?.urlImage || s?.images?.[0]?.url || s?.imageUrl || s?.image || "/placeholder.png";
                const title = s?.name ?? s?.title ?? "Servicio";
                const desc = s?.description ?? s?.objective ?? "";
                const cat = s?.serviceCategory?.name ?? s?.category?.name ?? "Sin categoría";
                const { price, currency } = getPriceAndCurrency(s);

                return (
                  <article key={String(s.id ?? title)} className="w-full bg-white rounded-lg border border-gray-100 p-4 flex items-center gap-3">
                    <div className="flex-shrink-0">
                      <Image src={img} alt={title} fit="cover" className="w-20 h-20 rounded-lg overflow-hidden bg-gray-50" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <Text weight="bold" className="truncate">{title}</Text>
                      {desc && <Text size="sm" color="muted" className="truncate">{desc}</Text>}
                      <div className="mt-1 text-xs text-gray-500">{cat}</div>
                    </div>
                    <div className="min-w-[150px] flex flex-col items-end gap-3">
                      <Text weight="bold">{formatPrice(price, currency)}</Text>
                      <Button
                        variant="primary"
                        size="small"
                        text="Ver detalle"
                        className="bg-red-600 hover:bg-red-700 text-white"
                        onClick={() => (window.location.href = `/${locale}/servicios/${s.id}`)}
                      />
                    </div>
                  </article>
                );
              })}
            </div>
          </section>
        )}

        {!loading && items.length === 0 && !error && query.trim() && (
          <div className="text-gray-600">No se encontraron servicios. Prueba con otros términos.</div>
        )}
      </div>
    </div>
  );
}
