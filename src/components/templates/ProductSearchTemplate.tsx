import React, { useEffect, useMemo, useState } from "react";
import { ProductService } from "@/features/product/services/product.service";
import { Image } from "@/components/atoms/Image";
import { Text } from "@/components/atoms/Text";
import { Button } from "@/components/atoms/Button";

/* ---------- helpers de moneda / número ---------- */
function currencySymbol(code?: string) {
  if (!code) return "S/.";
  const c = String(code).toUpperCase();
  if (["PEN", "S/.", "S/"].includes(c)) return "S/.";
  if (["USD", "$"].includes(c)) return "$";
  if (["EUR", "€"].includes(c)) return "€";
  return c;
}
function isFiniteNumber(v: any): v is number {
  return typeof v === "number" && Number.isFinite(v);
}
function toNumber(maybe: any): number | null {
  if (isFiniteNumber(maybe)) return maybe;
  if (typeof maybe === "string" && maybe.trim() && !Number.isNaN(Number(maybe))) {
    return Number(maybe);
  }
  return null;
}

/** Busca la PRIMERA hoja numérica razonable dentro de un objeto anidado. */
function deepFindFirstNumber(obj: any): number | null {
  try {
    if (obj == null) return null;
    if (isFiniteNumber(obj)) return obj;
    if (typeof obj === "string") {
      const n = toNumber(obj);
      if (n !== null) return n;
    }
    if (Array.isArray(obj)) {
      for (const item of obj) {
        const n = deepFindFirstNumber(item);
        if (n !== null) return n;
      }
      return null;
    }
    if (typeof obj === "object") {
      // Intentos comunes primero
      for (const key of ["amount", "value", "price", "amountMin", "amountMax", "min", "max"]) {
        if (key in obj) {
          const n = deepFindFirstNumber((obj as any)[key]);
          if (n !== null) return n;
        }
      }
      // Si trae ranges
      if ("ranges" in obj && Array.isArray(obj.ranges)) {
        for (const r of obj.ranges) {
          const n = deepFindFirstNumber(r);
          if (n !== null) return n;
        }
      }
      // Si trae moneda como clave (PEN/USD/EUR)
      for (const k of Object.keys(obj)) {
        if (/^(pen|usd|eur)$/i.test(k) && isFiniteNumber((obj as any)[k])) {
          return (obj as any)[k];
        }
      }
      // Último recurso: recorre todas las props
      for (const k of Object.keys(obj)) {
        const n = deepFindFirstNumber((obj as any)[k]);
        if (n !== null) return n;
      }
    }
    return null;
  } catch {
    return null;
  }
}

function getCurrency(product: any): string | undefined {
  // prueba campos típicos
  const cands = [
    product?.price?.currency,
    product?.basicInfo?.currency,
    product?.details?.currency,
  ].filter(Boolean);
  if (cands.length) return String(cands[0]);

  // si la moneda viene como clave del objeto price: { PEN: 120 }
  const price = product?.price;
  if (price && typeof price === "object" && !Array.isArray(price)) {
    for (const k of Object.keys(price)) {
      if (/^(pen|usd|eur)$/i.test(k)) return k.toUpperCase();
    }
  }
  return "PEN";
}

/** Devuelve un precio robusto (o null) + moneda inferida */
function getProductPrice(product: any): { price: number | null; currency?: string } {
  // 1) casos planos
  const p1 = toNumber(product?.price);
  if (p1 !== null) return { price: p1, currency: getCurrency(product) };

  // 2) objetos típicos
  const p2 =
    toNumber(product?.price?.amount) ??
    toNumber(product?.basicInfo?.price) ??
    toNumber(product?.details?.price);
  if (p2 !== null) return { price: p2, currency: getCurrency(product) };

  // 3) ranges / min-max
  const p3 =
    toNumber(product?.price?.amountMin) ??
    toNumber(product?.price?.amountMax) ??
    toNumber(product?.details?.minPrice) ??
    toNumber(product?.details?.maxPrice);
  if (p3 !== null) return { price: p3, currency: getCurrency(product) };

  // 4) mapa por moneda { PEN: 120 }
  if (product?.price && typeof product.price === "object" && !Array.isArray(product.price)) {
    for (const k of ["PEN", "pen", "USD", "usd", "EUR", "eur"]) {
      const v = toNumber(product.price[k]);
      if (v !== null) return { price: v, currency: k.toUpperCase() };
    }
  }

  // 5) arrays {currency, amount}
  if (Array.isArray(product?.price)) {
    for (const it of product.price) {
      const n = toNumber(it?.amount ?? it?.price ?? it?.value);
      if (n !== null) return { price: n, currency: it?.currency ?? getCurrency(product) };
    }
  }

  // 6) búsqueda recursiva (último recurso)
  const deep = deepFindFirstNumber(product?.price ?? product?.basicInfo ?? product?.details);
  if (deep !== null) return { price: deep, currency: getCurrency(product) };

  return { price: null, currency: getCurrency(product) };
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
  showRefineInput?: boolean;    // refinador (page)
  className?: string;
};

function updateUrl(locale: string, q: string, page: number, limit: number) {
  if (typeof window === "undefined") return;
  const params = new URLSearchParams({ q, page: String(page), limit: String(limit) });
  const next = `/${locale}/buscar/productos?${params.toString()}`;
  window.history.replaceState({}, "", next);
}

export default function ProductSearchTemplate({
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

  // reset page al cambiar query
  useEffect(() => setPage(1), [query]);

  // sync URL (page)
  useEffect(() => {
    if (mode === "page" && manageUrl) updateUrl(locale, query, page, limit);
  }, [mode, manageUrl, locale, query, page, limit]);

  // fetch
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
        const res = await ProductService.findByName(q, page, limit);
        if (cancel) return;
        const list = res?.products ?? [];
        const total = Number(res?.totalResults ?? list.length);
        const pages = Number(res?.totalPages ?? Math.max(1, Math.ceil(total / limit)));
        setItems(list);
        setTotalResults(total);
        setTotalPages(pages);
      } catch (e: any) {
        if (!cancel) {
          setItems([]); setTotalResults(0); setTotalPages(1);
          setError(e?.message || "Error al buscar productos");
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
    if (!query) return `Productos (${totalResults})`;
    return `Resultados para “${query}” (${totalResults})`;
  }, [query, totalResults]);

  if (!query?.trim() && isInline) return null;

  return (
    <div className={className ?? (isInline ? "w-full border-t bg-gray-50" : "")}>
      <div className={`${isInline ? "max-w-6xl mx-auto px-4 py-6" : ""}`}>
        {/* Encabezado + controles */}
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

        {/* Estados */}
        {loading && <div className="text-gray-500">Cargando…</div>}
        {error && <div className="text-red-600">{String(error)}</div>}

        {/* Resultados */}
        {!loading && items.length > 0 && (
          <section className={`${isInline ? "" : "mb-8"}`}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {items.map((p: any) => {
                const img =
                  p?.images?.[0]?.urlImage || p?.images?.[0]?.url || p?.imageUrl || p?.image || "/placeholder.png";
                const title = p?.name ?? "Producto";
                const brand = p?.supplier?.name ?? p?.brand ?? "";
                const { price, currency } = getProductPrice(p);

                return (
                  <article key={String(p.id ?? title)} className="w-full bg-white rounded-lg border border-gray-100 p-4 flex items-center gap-3">
                    <div className="flex-shrink-0">
                      <Image src={img} alt={title} fit="cover" className="w-20 h-20 rounded-lg overflow-hidden bg-gray-50" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <Text weight="bold" className="truncate">{title}</Text>
                      {brand && <Text size="sm" color="muted" className="truncate">{brand}</Text>}
                      <div className="mt-1 text-xs text-green-700 bg-green-50 inline-block px-2 py-0.5 rounded">En stock</div>
                    </div>
                    <div className="min-w-[150px] flex flex-col items-end gap-3">
                      <Text weight="bold">{formatPrice(price, currency)}</Text>
                      <Button
                        variant="primary"
                        size="small"
                        text="Ver detalle"
                          className="bg-red-600 hover:bg-red-700 text-white"

                        onClick={() => (window.location.href = `/${locale}/productos/${p.id}`)}
                      />
                    </div>
                  </article>
                );
              })}
            </div>
          </section>
        )}

        {!loading && items.length === 0 && !error && query.trim() && (
          <div className="text-gray-600">No se encontraron productos. Prueba con otros términos.</div>
        )}
      </div>
    </div>
  );
}
