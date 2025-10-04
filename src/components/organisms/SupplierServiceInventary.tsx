import React, { useEffect, useRef, useState, useCallback } from "react";
import { Button } from "@/components/atoms/Button";
import { Text } from "@/components/atoms/Text";
import { PaginationItem } from "@/components/atoms/PaginationItem";
import { Spinner } from "@/components/atoms/Spinner";
import {
  List,
  SquaresFour,
  Funnel,
  Plus,
  DotsThreeVertical,
  Check,
  X as XIcon,
  PencilSimple,
  Trash,
  X,
  MagnifyingGlass,
} from "phosphor-react";
import { cntl } from "@/utils/cntl";
import { ServiceService } from "@/features/service/services/service.service";

/* ---------------- utils ---------------- */
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
  if (typeof maybe === "string" && maybe.trim() && !Number.isNaN(Number(maybe)))
    return Number(maybe);
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
function isActive(svc: any): boolean {
  if (typeof svc?.isAvailable === "boolean") return svc.isAvailable;
  if (typeof svc?.available === "boolean") return svc.available;
  if (typeof svc?.active === "boolean") return svc.active;
  if (typeof svc?.status === "string") return svc.status.toLowerCase() === "active";
  return true;
}

/* ---------------- Buscador visual estilo “cuadrito” ---------------- */
type SearchBoxProps = {
  value: string;
  onChange: (v: string) => void;
  onSearch: (v: string) => void;
  placeholder?: string;
  className?: string;
};
function SearchBox({ value, onChange, onSearch, placeholder, className = "" }: SearchBoxProps) {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") onSearch(value);
  };
  return (
    <div
      className={`flex items-center rounded-xl border border-gray-300 bg-white overflow-hidden ${className}`}
    >
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className="flex-1 px-4 py-2 outline-none bg-transparent text-gray-700 placeholder:text-gray-400"
      />
      <button
        type="button"
        onClick={() => onSearch(value)}
        className="h-9 w-10 border-l border-gray-200 rounded-r-xl inline-flex items-center justify-center hover:bg-gray-50"
        aria-label="Buscar"
        title="Buscar"
      >
        <MagnifyingGlass size={18} className="text-gray-500" />
      </button>
    </div>
  );
}

/* ---------------- TileCard (grid mejorado) ---------------- */
type TileCardProps = { service: any };
function TileCard({ service }: TileCardProps) {
  const img =
    service?.images?.[0]?.urlImage ||
    service?.images?.[0]?.url ||
    service?.imageUrl ||
    service?.image ||
    "https://placehold.co/600x400/E5E7EB/9CA3AF?text=img";

  const title = service?.name ?? service?.title ?? "—";
  const desc = service?.description ?? service?.objective ?? "—";
  const categoryName =
    service?.serviceCategory?.name ??
    service?.category?.name ??
    "Sin categoría";

  const { price, currency } = getPriceAndCurrency(service);

  return (
    <article className="rounded-xl border border-gray-200 bg-white overflow-hidden">
      <div className="relative">
        <img src={img} alt={title} className="w-full h-40 object-cover" />
        <div className="absolute bottom-2 left-2 right-2">
          {/* chip de categoría multilínea */}
          <div
            className="inline-block max-w-full bg-blue-50 text-blue-700 border border-blue-100 rounded-md px-2 py-1 text-xs leading-snug break-words whitespace-normal shadow-sm"
            title={categoryName}
          >
            {categoryName}
          </div>
        </div>
      </div>
      <div className="p-3">
        <Text weight="bold" className="text-sm line-clamp-2">{title}</Text>
        <Text color="muted" className="text-sm mt-1 line-clamp-2">{desc}</Text>
        <div className="mt-2 border-t border-gray-200" />
        <Text weight="bold" className="mt-2">{formatPrice(price, currency)}</Text>
      </div>
    </article>
  );
}

/* ---------------- Píldora de disponibilidad ---------------- */
function AvailabilityPill({ active }: { active: boolean }) {
  if (active) {
    return (
      <span className="inline-flex items-center gap-2 rounded-full px-3 py-1 bg-green-50">
        <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-green-600 text-white leading-none">
          <Check size={12} weight="bold" />
        </span>
        <span className="text-green-700 text-xs leading-none">Activo</span>
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-2 rounded-full px-3 py-1 bg-red-50">
      <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-red-600 text-white leading-none">
        <XIcon size={12} weight="bold" />
      </span>
      <span className="text-red-700 text-xs leading-none">Inactivo</span>
    </span>
  );
}

/* ---------------- Item lista con menú ---------------- */
type RowCardProps = {
  service: any;
  onEdit: (service: any) => void;
  onDelete: (service: any) => void;
  openMenuId: string | number | null;
  onToggleMenu: (id: string | number) => void;
};
function RowCard({ service, onEdit, onDelete, openMenuId, onToggleMenu }: RowCardProps) {
  const img =
    service?.images?.[0]?.urlImage ||
    service?.images?.[0]?.url ||
    service?.imageUrl ||
    service?.image ||
    null;

  const title = service?.name ?? service?.title ?? "—";
  const desc = service?.description ?? service?.objective ?? "";
  const metaLeft =
    `${service?.serviceCategory?.name ?? service?.category?.name ?? "Sin categoría"} · ` +
    `${service?.supplier?.name ?? service?.user?.userInformation?.contactName ?? service?.user?.email ?? "—"}`;

  const { price, currency } = getPriceAndCurrency(service);
  const priceText = formatPrice(price, currency);
  const active = isActive(service);

  const id = service?.id ?? service?.serviceId ?? title;
  const isOpen = openMenuId === id;

  return (
    <article className="rounded-xl border border-gray-200 bg-white">
      <div className="flex items-center gap-3 p-3">
        <div className="shrink-0">
          <img
            src={img || "https://placehold.co/100x100/E5E7EB/6B7280?text=IMG"}
            alt={title}
            className="w-[90px] h-[90px] object-cover rounded-md bg-gray-100"
          />
        </div>

        <div className="flex-1 min-w-0">
          <Text weight="bold" className="text-base truncate">{title}</Text>
          <Text color="muted" className="mt-1 line-clamp-2">{desc}</Text>
          <div className="mt-2"><AvailabilityPill active={active} /></div>
        </div>

        <div className="relative flex items-center gap-8 ml-auto">
          <div className="text-right">
            <Text size="sm" color="muted" className="leading-none">{metaLeft}</Text>
            <Text weight="bold" className="mt-2">{priceText}</Text>
          </div>

          <button
            type="button"
            onClick={() => onToggleMenu(id)}
            className="inline-flex items-center justify-center w-9 h-9 rounded-lg border border-gray-200 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300 transition"
            aria-label="Más acciones"
          >
            <DotsThreeVertical size={20} />
          </button>

          {isOpen && (
            <div className="absolute right-0 top-11 z-20 w-44 rounded-lg border border-gray-200 bg-white shadow-lg overflow-hidden">
              <button
                type="button"
                onClick={() => onEdit(service)}
                className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2"
              >
                <PencilSimple size={16} /> Editar
              </button>
              <button
                type="button"
                onClick={() => onDelete(service)}
                className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 text-red-600 flex items-center gap-2"
              >
                <Trash size={16} /> Eliminar
              </button>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}

/* ---------------- Modal Crear/Editar ---------------- */
type ServiceForm = {
  name: string;
  description: string;
  serviceCategory: string;
  objective?: string;
  price?: string;
  currency?: string;
  estimatedDuration?: string;
};
type ServiceFormModalProps = {
  isOpen: boolean;
  mode: "create" | "edit";
  initial?: Partial<ServiceForm>;
  onClose: () => void;
  onSubmit: (data: ServiceForm) => Promise<void>;
};
function ServiceFormModal({ isOpen, mode, initial, onClose, onSubmit }: ServiceFormModalProps) {
  const [form, setForm] = useState<ServiceForm>({
    name: initial?.name ?? "",
    description: initial?.description ?? "",
    serviceCategory: initial?.serviceCategory ?? "", 
    objective: initial?.objective ?? "",
    price: initial?.price ?? "",
    currency: initial?.currency ?? "PEN",
    estimatedDuration: initial?.estimatedDuration ?? "",
  });
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setForm({
        name: initial?.name ?? "",
        description: initial?.description ?? "",
        serviceCategory: initial?.serviceCategory ?? "",
        objective: initial?.objective ?? "",
        price: initial?.price ?? "",
        currency: initial?.currency ?? "PEN",
        estimatedDuration: initial?.estimatedDuration ?? "",
      });
      setErr(null);
    }
  }, [isOpen, initial]);

  if (!isOpen) return null;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setErr(null);
    try {
      await onSubmit(form);
      onClose();
    } catch (e: any) {
      setErr(e?.message || "Error al guardar");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      <div className="relative z-10 w-full max-w-lg bg-white rounded-xl shadow-xl p-5">
        <div className="flex items-center justify-between mb-3">
          <Text weight="bold" className="text-lg">{mode === "create" ? "Nuevo Servicio" : "Editar Servicio"}</Text>
          <button type="button" className="w-8 h-8 inline-flex items-center justify-center rounded-full hover:bg-gray-100" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {err && <div className="mb-3 rounded-md border border-red-200 bg-red-50 text-red-700 px-3 py-2 text-sm">{err}</div>}

        <form onSubmit={submit} className="space-y-3">
          <div>
            <label className="block text-sm font-medium mb-1">Nombre</label>
            <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-md outline-none focus:ring-2 focus:ring-red-500" placeholder="Nombre del servicio" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Descripción</label>
            <textarea required value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-md outline-none focus:ring-2 focus:ring-red-500" placeholder="Describe el servicio" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium mb-1">Categoría (nombre)</label>
              <input
                required
                value={form.serviceCategory}
                onChange={(e) => setForm({ ...form, serviceCategory: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md outline-none focus:ring-2 focus:ring-red-500"
                placeholder="Ej: Web Development"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Objetivo (opcional)</label>
              <input value={form.objective ?? ""} onChange={(e) => setForm({ ...form, objective: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-md outline-none focus:ring-2 focus:ring-red-500" placeholder="Objetivo" />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-sm font-medium mb-1">Precio</label>
              <input type="number" step="0.01" min="0" value={form.price ?? ""} onChange={(e) => setForm({ ...form, price: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-md outline-none focus:ring-2 focus:ring-red-500" placeholder="0.00" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Moneda</label>
              <input value={form.currency ?? ""} onChange={(e) => setForm({ ...form, currency: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-md outline-none focus:ring-2 focus:ring-red-500" placeholder="PEN / USD / EUR" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Duración estimada</label>
              <input value={form.estimatedDuration ?? ""} onChange={(e) => setForm({ ...form, estimatedDuration: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-md outline-none focus:ring-2 focus:ring-red-500" placeholder="p.ej. 2h" />
            </div>
          </div>
          <div className="flex items-center justify-end gap-2 pt-2">
            <Button variant="outline" size="small" text="Cancelar" onClick={onClose} />
            <Button variant="primary" size="small" text={busy ? "Guardando..." : mode === "create" ? "Crear" : "Guardar"} className="bg-red-600 hover:bg-red-700 text-white" disabled={busy} />
          </div>
        </form>
      </div>
    </div>
  );
}

/* ---------------- Props ---------------- */
type Props = { supplierId: string; className?: string };

/* ---------------- Componente principal ---------------- */
export default function SupplierServiceInventary({ supplierId, className = "" }: Props) {
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const [showFilters, setShowFilters] = useState(false);
  const [openMenuId, setOpenMenuId] = useState<string | number | null>(null);

  // filtros
  const [categoryName, setCategoryName] = useState<string>("");
  const [minPrice, setMinPrice] = useState<string>("");
  const [maxPrice, setMaxPrice] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");
  const [tempSearchQuery, setTempSearchQuery] = useState("");

  // paginación
  const [pagination, setPagination] = useState({ currentPage: 1, limit: 10, totalItems: 0 });

  // modal
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [editTarget, setEditTarget] = useState<any | null>(null);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const isUUID = (v: string) => /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(v);

  /* ------------ fetch (con categoría por NOMBRE en cliente) ------------ */
  const fetchServices = useCallback(
    async (over?: Partial<{ page: number; limit: number; name: string }>) => {
      setLoading(true);
      setError(null);
      try {
        const payload: any = {
          supplierId,
          page: over?.page ?? pagination.currentPage,
          limit: over?.limit ?? pagination.limit,
          priceMin: minPrice ? parseFloat(minPrice) : undefined,
          priceMax: maxPrice ? parseFloat(maxPrice) : undefined,
          name: over?.name ?? (searchQuery || undefined),
        };
        if (categoryName && isUUID(categoryName)) payload.category = categoryName;

        const resp = await ServiceService.filterServices(payload);
        let list = Array.isArray(resp?.data) ? resp.data : [];
        if (categoryName && !isUUID(categoryName)) {
          const q = categoryName.trim().toLowerCase();
          list = list.filter((s: any) => {
            const n = s?.serviceCategory?.name ?? s?.category?.name ?? "";
            return n.toLowerCase().includes(q);
          });
        }

        setServices(list);
        setPagination((prev) => ({
          ...prev,
          totalItems: resp?.total ?? list.length,
          currentPage: payload.page,
          limit: payload.limit,
        }));
      } catch (e: any) {
        console.error(e);
        setError(e?.message || "Error cargando servicios del proveedor.");
        setServices([]);
        setPagination((p) => ({ ...p, totalItems: 0 }));
      } finally {
        setLoading(false);
      }
    },
    [supplierId, pagination.currentPage, pagination.limit, minPrice, maxPrice, categoryName, searchQuery]
  );

  useEffect(() => { fetchServices(); }, [fetchServices]);

  // cerrar menú si haces click fuera
  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      const target = e.target as Node;
      if (containerRef.current && !containerRef.current.contains(target)) setOpenMenuId(null);
    };
    document.addEventListener("click", onDocClick);
    return () => document.removeEventListener("click", onDocClick);
  }, []);

  /* ---------- BUSCADOR: debounce al escribir ---------- */
  useEffect(() => {
    const t = setTimeout(() => {
      if (tempSearchQuery !== searchQuery) {
        setSearchQuery(tempSearchQuery);
        fetchServices({ page: 1, name: tempSearchQuery });
      }
    }, 300);
    return () => clearTimeout(t);
  }, [tempSearchQuery]); // eslint-disable-line

  const manualSearch = () => fetchServices({ page: 1, name: tempSearchQuery });

  // paginación y filtros
  const handleLimitChange = (newLimit: number) => fetchServices({ page: 1, limit: newLimit });
  const handleClearFilters = () => {
    setCategoryName(""); setMinPrice(""); setMaxPrice("");
    setSearchQuery(""); setTempSearchQuery("");
    fetchServices({ page: 1, name: "" });
  };

  const handleEdit = (svc: any) => { setModalMode("edit"); setEditTarget(svc); setModalOpen(true); };
  const handleDelete = async (svc: any) => {
    setOpenMenuId(null);
    if (!window.confirm(`¿Eliminar el servicio "${svc?.name ?? svc?.title ?? ""}"?`)) return;
    try { await ServiceService.remove(svc.id); fetchServices(); }
    catch (err: any) { alert(err?.message || "No se pudo eliminar el servicio."); }
  };
  const submitCreate = async (data: ServiceForm) => {
    await ServiceService.create({
      name: data.name,
      description: data.description,
      objective: data.objective || undefined,
      serviceCategory: data.serviceCategory, // ← NOMBRE
      price: data.price ? Number(data.price) : undefined,
      currency: data.currency || undefined,
      estimatedDuration: data.estimatedDuration || undefined,
      supplierId,
    });
    await fetchServices({ page: 1 });
  };
  const submitEdit = async (data: ServiceForm) => {
    if (!editTarget?.id) throw new Error("ID del servicio no encontrado");
    await ServiceService.update(editTarget.id, {
      name: data.name || undefined,
      description: data.description || undefined,
      objective: data.objective || undefined,
      serviceCategory: data.serviceCategory || undefined, 
      price: data.price ? Number(data.price) : undefined,
      currency: data.currency || undefined,
      estimatedDuration: data.estimatedDuration || undefined,
      supplierId,
    });
    await fetchServices();
  };

  const totalPages = Math.max(1, Math.ceil(pagination.totalItems / pagination.limit));
  const hasActiveFilters = categoryName || minPrice || maxPrice || searchQuery;

  return (
    <section className={cntl`p-4 sm:p-6 ${className}`}>
      {/* Toolbar */}
      <div className="flex flex-col gap-4 mb-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Buscador con icono integrado */}
          <div className="w-full sm:flex-1 sm:max-w-md">
            <SearchBox
              value={tempSearchQuery}
              onChange={setTempSearchQuery}
              onSearch={() => manualSearch()}
              placeholder="Buscar servicio..."
            />
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <Button
              variant={viewMode === "list" ? "primary" : "outline"}
              size="small"
              onClick={() => setViewMode("list")}
              className={`p-2 ${viewMode === "list" ? "bg-red-600 hover:bg-red-700 text-white border border-red-600" : ""}`}
              aria-label="Vista lista"
            >
              <List />
            </Button>
            <Button
              variant={viewMode === "grid" ? "primary" : "outline"}
              size="small"
              onClick={() => setViewMode("grid")}
              className={`p-2 ${viewMode === "grid" ? "bg-red-600 hover:bg-red-700 text-white border border-red-600" : ""}`}
              aria-label="Vista grid"
            >
              <SquaresFour />
            </Button>
            <Button
              variant={showFilters ? "primary" : "outline"}
              size="small"
              onClick={() => setShowFilters(!showFilters)}
              className={`p-2 ${showFilters ? "bg-red-600 hover:bg-red-700 text-white border border-red-600" : ""}`}
              aria-label="Filtros"
            >
              <Funnel />
            </Button>
            <Button
              variant="primary"
              size="small"
              onClick={() => { setModalMode("create"); setEditTarget(null); setModalOpen(true); }}
              icon={<Plus />}
              text="Nuevo Servicio"
              className="bg-red-600 hover:bg-red-700 text-white ml-2"
            />
          </div>
        </div>

        {/* Panel de filtros */}
        {showFilters && (
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <Text weight="bold">Filtros</Text>
              <Button variant="ghost" size="small" onClick={() => setShowFilters(false)} className="p-1">
                <X />
              </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Categoría (nombre)</label>
                <input
                  type="text"
                  value={categoryName}
                  onChange={(e) => setCategoryName(e.target.value)}
                  placeholder="Ej: Web Development"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Precio mínimo</label>
                <input
                  type="number" step="0.01" min="0"
                  value={minPrice} onChange={(e) => setMinPrice(e.target.value)}
                  placeholder="0.00"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Precio máximo</label>
                <input
                  type="number" step="0.01" min="0"
                  value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)}
                  placeholder="9999.00"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
                />
              </div>
            </div>

            <div className="flex items-center gap-2 mt-4">
              <Button variant="primary" size="small" text="Aplicar Filtros" className="bg-red-600 hover:bg-red-700 text-white" onClick={() => fetchServices({ page: 1 })} />
              <Button variant="outline" size="small" text="Limpiar" className="border-red-600 text-red-600 hover:bg-red-50" onClick={handleClearFilters} />
            </div>
          </div>
        )}

        {( (categoryName || minPrice || maxPrice || searchQuery) && !showFilters) && (
          <div className="flex items-center gap-2 flex-wrap">
            <Text size="sm" color="muted">Filtros activos:</Text>
            {searchQuery && <span className="px-2 py-1 bg-blue-100 text-red-700 text-xs rounded-full">Búsqueda: {searchQuery}</span>}
            {categoryName && <span className="px-2 py-1 bg-blue-100 text-red-700 text-xs rounded-full">Categoría: {categoryName}</span>}
            {minPrice && <span className="px-2 py-1 bg-blue-100 text-red-700 text-xs rounded-full">Min: {minPrice}</span>}
            {maxPrice && <span className="px-2 py-1 bg-blue-100 text-red-700 text-xs rounded-full">Max: {maxPrice}</span>}
            <Button variant="ghost" size="small" text="Limpiar" onClick={handleClearFilters} className="text-xs" />
          </div>
        )}
      </div>

      {/* Contenido principal */}
      <div className="min-h-[400px]" ref={containerRef}>
        {loading ? (
          <div className="flex flex-col items-center justify-center h-full text-center py-8">
            <Spinner size="lg" />
            <Text color="muted" className="mt-4">Cargando servicios...</Text>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center h-full text-center py-8">
            <Text color="danger">{error}</Text>
          </div>
        ) : services.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center py-8">
            <Text>No se encontraron servicios.</Text>
          </div>
        ) : viewMode === "list" ? (
          <div className="space-y-3">
            {services.map((svc) => (
              <RowCard
                key={String(svc.id ?? svc.title)}
                service={svc}
                onEdit={(s) => { setModalMode("edit"); setEditTarget(s); setModalOpen(true); }}
                onDelete={async (s) => {
                  setOpenMenuId(null);
                  if (!window.confirm(`¿Eliminar el servicio "${s?.name ?? s?.title ?? ""}"?`)) return;
                  try { await ServiceService.remove(s.id); fetchServices(); }
                  catch (err: any) { alert(err?.message || "No se pudo eliminar el servicio."); }
                }}
                openMenuId={openMenuId}
                onToggleMenu={setOpenMenuId}
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {services.map((svc) => (
              <TileCard key={String(svc.id ?? svc.title)} service={svc} />
            ))}
          </div>
        )}
      </div>

      {/* Paginación */}
      {!loading && services.length > 0 && (
        <div className="flex flex-col-reverse sm:flex-row items-center justify-between mt-6 pt-4 border-t border-gray-200 gap-4">
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-600">Filas por página:</label>
            <select
              value={pagination.limit}
              onChange={(e) => fetchServices({ page: 1, limit: Number(e.target.value) })}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm bg-white hover:border-gray-400 focus:outline-none focus:ring-1 focus:ring-red-500"
            >
              <option value={10}>10</option>
              <option value={15}>15</option>
              <option value={20}>20</option>
            </select>
          </div>

          <div className="flex items-center gap-1">
            <PaginationItem
              disabled={pagination.currentPage === 1}
              onClick={() => fetchServices({ page: pagination.currentPage - 1 })}
            >
              {"<"}
            </PaginationItem>

            {Array.from({ length: Math.max(1, Math.ceil(pagination.totalItems / pagination.limit)) }, (_, i) => i + 1)
              .filter((page) => {
                const current = pagination.currentPage;
                const last = Math.max(1, Math.ceil(pagination.totalItems / pagination.limit));
                return page === 1 || page === last || (page >= current - 1 && page <= current + 1);
              })
              .map((page, idx, arr) => (
                <React.Fragment key={page}>
                  {idx > 0 && arr[idx - 1] !== page - 1 && <span className="px-2 text-gray-500">…</span>}
                  <PaginationItem active={page === pagination.currentPage} onClick={() => fetchServices({ page })}>
                    {page}
                  </PaginationItem>
                </React.Fragment>
              ))}

            <PaginationItem
              disabled={pagination.currentPage === Math.max(1, Math.ceil(pagination.totalItems / pagination.limit))}
              onClick={() => fetchServices({ page: pagination.currentPage + 1 })}
            >
              {">"}
            </PaginationItem>
          </div>
        </div>
      )}

      {/* Modal Crear/Editar (categoría por NOMBRE) */}
      <ServiceFormModal
        isOpen={modalOpen}
        mode={modalMode}
        initial={
          modalMode === "edit" && editTarget
            ? {
                name: editTarget?.name ?? editTarget?.title,
                description: editTarget?.description ?? "",
                serviceCategory:  // ← nombre de la categoría
                  editTarget?.serviceCategory?.name ??
                  editTarget?.category?.name ??
                  "",
                objective: editTarget?.objective ?? "",
                price: (() => {
                  const { price } = getPriceAndCurrency(editTarget);
                  return price !== null ? String(price) : "";
                })(),
                currency: getPriceAndCurrency(editTarget).currency ?? "PEN",
                estimatedDuration: editTarget?.estimatedDuration ?? "",
              }
            : undefined
        }
        onClose={() => setModalOpen(false)}
        onSubmit={modalMode === "create" ? submitCreate : submitEdit}
      />
    </section>
  );
}
