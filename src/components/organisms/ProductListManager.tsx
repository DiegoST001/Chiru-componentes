import React, { useState, useEffect, useCallback } from "react";
import { SimpleSearch } from "@/components/molecules/SimpleSearch";
import { ProductListItem } from "@/components/molecules/ProductListItem";
import { Button } from "@/components/atoms/Button";
import { Text } from "@/components/atoms/Text";
import { PaginationItem } from "@/components/atoms/PaginationItem";
import { Spinner } from "@/components/atoms/Spinner";
import { CartProduct } from "@/components/molecules/CartProduct";
import type { ProductCard } from "@/components/molecules/CartProduct";
import { List, SquaresFour, Funnel, Plus, X } from "phosphor-react";
import { SupplierService } from "@/features/user/supplier/service/supplier.service";
import {
  ProductCreateModal,
  type ProductFormData,
} from "@/components/molecules/ProductCreateModal";

export type ProductListManagerProps = {
  supplierId: string;
  className?: string;
};

const mapProductToCard = (product: any): ProductCard => {
  // Extraer precio de diferentes posibles ubicaciones
  let precio = 0;
  if (product.price) {
    if (typeof product.price === "number") {
      precio = product.price;
    } else if (product.price.ranges && product.price.ranges[0]) {
      precio =
        product.price.ranges[0].amountMin ||
        product.price.ranges[0].amountMax ||
        0;
    }
  }

  // Extraer imagen de diferentes posibles ubicaciones
  let imageUrl = `https://placehold.co/100x100?text=${(product.name || "P").charAt(0)}`;
  if (product.images && product.images.length > 0) {
    imageUrl = product.images[0].urlImage || product.images[0].url || imageUrl;
  } else if (product.image) {
    imageUrl = product.image;
  } else if (product.imageUrl) {
    imageUrl = product.imageUrl;
  }

  return {
    id: String(product.id),
    name: product.name || "Sin nombre",
    description: product.description || "Sin descripción",
    price: precio,
    imageUrl: imageUrl,
    brand: product.category?.name || product.brand || "Marca",
  };
};

export function ProductListManager({
  supplierId,
  className = "",
}: ProductListManagerProps) {
  const [products, setProducts] = useState<ProductCard[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const [showFilters, setShowFilters] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  // Filtros
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [minPrice, setMinPrice] = useState<string>("");
  const [maxPrice, setMaxPrice] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");
  const [tempSearchQuery, setTempSearchQuery] = useState("");

  // Paginación
  const [pagination, setPagination] = useState({
    currentPage: 1,
    limit: 10,
    totalItems: 0,
  });

  // Cargar productos con filtros y paginación
  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await SupplierService.findProductsBySupplier(
        supplierId,
        pagination.currentPage,
        pagination.limit,
        minPrice ? parseFloat(minPrice) : undefined,
        maxPrice ? parseFloat(maxPrice) : undefined,
        selectedCategory || undefined,
        searchQuery || undefined,
      );

      console.log("Productos recibidos:", response.data);
      const mappedProducts = response.data.map(mapProductToCard);
      console.log("Productos mapeados:", mappedProducts);

      setProducts(mappedProducts);
      setPagination((prev) => ({ ...prev, totalItems: response.total }));
    } catch (err: any) {
      console.error("Error al cargar productos:", err);
      setError(err.message || "No se pudieron cargar los productos.");
    } finally {
      setLoading(false);
    }
  }, [
    supplierId,
    pagination.currentPage,
    pagination.limit,
    minPrice,
    maxPrice,
    selectedCategory,
    searchQuery,
  ]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setTempSearchQuery(query);
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
  };

  const handlePageChange = (newPage: number) => {
    const totalPages = Math.ceil(pagination.totalItems / pagination.limit);
    if (newPage > 0 && newPage <= totalPages) {
      setPagination((prev) => ({ ...prev, currentPage: newPage }));
    }
  };

  const handleLimitChange = (newLimit: number) => {
    setPagination((prev) => ({ ...prev, limit: newLimit, currentPage: 1 }));
  };

  const handleApplyFilters = () => {
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
    setShowFilters(false);
    fetchProducts();
  };

  const handleClearFilters = () => {
    setSelectedCategory("");
    setMinPrice("");
    setMaxPrice("");
    setSearchQuery("");
    setTempSearchQuery("");
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
  };

  const handleMenuToggle = (productId: string) => {
    setOpenMenuId(openMenuId === productId ? null : productId);
  };

  const handleProductAction = async (productId: string, action: string) => {
    if (action === "edit") {
      console.log("Editar producto:", productId);
      alert("Funcionalidad de edición en desarrollo");
    } else if (action === "delete") {
      if (
        window.confirm("¿Estás seguro de que deseas eliminar este producto?")
      ) {
        try {
          console.log("Eliminar producto:", productId);
          alert(
            "Funcionalidad de eliminación en desarrollo. Agrega ProductService.delete() a tu código.",
          );
        } catch (err: any) {
          alert("Error al eliminar el producto: " + err.message);
        }
      }
    }
    setOpenMenuId(null);
  };

  const handleCreateProduct = async (data: ProductFormData) => {
    try {
      console.log("Crear producto con datos:", data);
      alert(
        "Producto creado exitosamente (simulado). Implementa ProductService.create() en tu código.",
      );
      fetchProducts();
    } catch (err: any) {
      console.error("Error al crear producto:", err);
      alert("Error al crear el producto: " + err.message);
      throw err;
    }
  };

  const totalPages = Math.ceil(pagination.totalItems / pagination.limit);
  const hasActiveFilters =
    selectedCategory || minPrice || maxPrice || searchQuery;

  return (
    <div className={`p-4 sm:p-6 ${className}`}>
      {/* Barra superior */}
      <div className="flex flex-col gap-4 mb-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="w-full sm:flex-1 sm:max-w-md">
            <SimpleSearch
              placeholder="Buscar producto..."
              value={tempSearchQuery}
              onChange={(value) => setTempSearchQuery(value)}
              onSearch={handleSearch}
              fullWidth
            />
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <Button
              variant={viewMode === "list" ? "primary" : "outline"}
              size="small"
              onClick={() => setViewMode("list")}
              className={`p-2 ${
                viewMode === "list"
                  ? "bg-red-600 hover:bg-red-700 text-white border border-red-600"
                  : ""
              }`}
            >
              <List />
            </Button>
            <Button
              variant={viewMode === "grid" ? "primary" : "outline"}
              size="small"
              onClick={() => setViewMode("grid")}
              className={`p-2 ${
                viewMode === "grid"
                  ? "bg-red-600 hover:bg-red-700 text-white border border-red-600"
                  : ""
              }`}
            >
              <SquaresFour />
            </Button>
            <Button
              variant={showFilters ? "primary" : "outline"}
              size="small"
              onClick={() => setShowFilters(!showFilters)}
              className={`p-2 ${
                showFilters
                  ? "bg-red-600 hover:bg-red-700 text-white border border-red-600"
                  : ""
              }`}
            >
              <Funnel />
            </Button>
            <Button
              variant="primary"
              size="small"
              onClick={() => setShowCreateModal(true)}
              icon={<Plus />}
              text="Nuevo Producto"
              className="bg-red-600 hover:bg-red-700 text-white ml-2"
            />
          </div>
        </div>

        {/* Panel de filtros */}
        {showFilters && (
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <Text weight="bold">Filtros</Text>
              <Button
                variant="ghost"
                size="small"
                onClick={() => setShowFilters(false)}
                className="p-1"
              >
                <X />
              </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Categoría
                </label>
                <input
                  type="text"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  placeholder="Nombre de categoría"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md 
                     focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Precio mínimo (S/)
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  placeholder="0.00"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md 
                     focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Precio máximo (S/)
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  placeholder="9999.00"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md 
                     focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
                />
              </div>
            </div>

            <div className="flex items-center gap-2 mt-4">
              <Button
                variant="primary"
                size="small"
                text="Aplicar Filtros"
                className="bg-red-600 hover:bg-red-700 text-white"
                onClick={handleApplyFilters}
              />
              <Button
                variant="outline"
                size="small"
                text="Limpiar"
                className="border-red-600 text-red-600 hover:bg-red-50"
                onClick={handleClearFilters}
              />
            </div>
          </div>
        )}

        {/* Indicador de filtros activos */}
        {hasActiveFilters && !showFilters && (
          <div className="flex items-center gap-2 flex-wrap">
            <Text size="sm" color="muted">
              Filtros activos:
            </Text>
            {searchQuery && (
              <span className="px-2 py-1 bg-blue-100 text-red-700 text-xs rounded-full">
                Búsqueda: {searchQuery}
              </span>
            )}
            {selectedCategory && (
              <span className="px-2 py-1 bg-blue-100 text-red-700 text-xs rounded-full">
                Categoría: {selectedCategory}
              </span>
            )}
            {minPrice && (
              <span className="px-2 py-1 bg-blue-100 text-red-700 text-xs rounded-full">
                Min: S/ {minPrice}
              </span>
            )}
            {maxPrice && (
              <span className="px-2 py-1 bg-blue-100 text-red-700 text-xs rounded-full">
                Max: S/ {maxPrice}
              </span>
            )}
            <Button
              variant="ghost"
              size="small"
              text="Limpiar"
              onClick={handleClearFilters}
              className="text-xs"
            />
          </div>
        )}
      </div>

      {/* Contenido principal */}
      <div className="min-h-[400px]">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-full text-center py-8">
            <Spinner size="lg" />
            <Text color="muted" className="mt-4">
              Cargando productos...
            </Text>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center h-full text-center py-8">
            <Text color="danger">{error}</Text>
          </div>
        ) : products.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center py-8">
            <Text>No se encontraron productos.</Text>
            <Button
              variant="primary"
              size="medium"
              text="Agregar Primer Producto"
              onClick={() => setShowCreateModal(true)}
              className="mt-4"
            />
          </div>
        ) : viewMode === "list" ? (
          <div className="space-y-3">
            {products.map((product) => (
              <ProductListItem
                key={product.id}
                product={product}
                isMenuOpen={openMenuId === product.id}
                onMenuToggle={() => handleMenuToggle(product.id)}
                onAction={handleProductAction}
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {products.map((product) => (
              <CartProduct key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>

      {/* Paginación */}
      {!loading && products.length > 0 && (
        <div className="flex flex-col-reverse sm:flex-row items-center justify-between mt-6 pt-4 border-t border-gray-200 gap-4">
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-600">Filas por página:</label>
            <select
              value={pagination.limit}
              onChange={(e) => handleLimitChange(Number(e.target.value))}
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
              onClick={() => handlePageChange(pagination.currentPage - 1)}
            >
              {"<"}
            </PaginationItem>

            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter((page) => {
                return (
                  page === 1 ||
                  page === totalPages ||
                  (page >= pagination.currentPage - 1 &&
                    page <= pagination.currentPage + 1)
                );
              })
              .map((page, idx, arr) => (
                <React.Fragment key={page}>
                  {idx > 0 && arr[idx - 1] !== page - 1 && (
                    <span className="px-2 text-gray-500">…</span>
                  )}
                  <PaginationItem
                    active={page === pagination.currentPage}
                    onClick={() => handlePageChange(page)}
                  >
                    {page}
                  </PaginationItem>
                </React.Fragment>
              ))}

            <PaginationItem
              disabled={pagination.currentPage === totalPages}
              onClick={() => handlePageChange(pagination.currentPage + 1)}
            >
              {">"}
            </PaginationItem>
          </div>
        </div>
      )}
      {/* Modal de creación */}
      <ProductCreateModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={handleCreateProduct}
        supplierId={supplierId}
      />
    </div>
  );
}
