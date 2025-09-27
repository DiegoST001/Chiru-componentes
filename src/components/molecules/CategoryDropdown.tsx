import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Icon } from "@/components/atoms/Icon";
import { List } from "phosphor-react";
import { cntl } from "@/utils/cntl";
import { CategoryService } from "@/features/category/services/category.service";
import type { Category } from "@/features/category/models/category.model";

type CategoryDropdownProps = {
  className?: string;
};

function getContainerStyles() {
  return cntl`
    flex items-center gap-2 px-4 py-2
    bg-gray-100 hover:bg-gray-200
    border border-gray-300 rounded-lg
    transition-all duration-200
    text-gray-700
    relative
    cursor-pointer
    shadow-sm
  `;
}

function getIconStyles() {
  return cntl`
    text-gray-600 pointer-events-none
  `;
}

function getTitleStyles() {
  return cntl`
    text-sm font-medium text-gray-700
  `;
}

function CategoryDropdown({ className }: CategoryDropdownProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false); // mobile drawer
  const [openMega, setOpenMega] = useState<boolean>(false); // desktop mega menu
  const [selectedRootId, setSelectedRootId] = useState<string | null>(null);

  const menuRef = useRef<HTMLDivElement>(null);

  const ensureLoaded = useCallback(async () => {
    if (loading || categories.length > 0) return;
    try {
      setLoading(true);
      let roots: Category[] = [];
      try {
        const tree = await CategoryService.getCategoryTree();
        if (Array.isArray(tree) && tree.length > 0) {
          roots = tree.filter((c) => !c.parent);
        }
      } catch (e) { /* Fallback */ }
      if (!roots || roots.length === 0) {
        try {
          const all = await CategoryService.findAll();
          roots = Array.isArray(all) ? all.filter((c) => !c.parent) : [];
          const enriched: Category[] = await Promise.all(
            roots.map(async (r) => {
              try {
                const full = await CategoryService.findOne(r.id);
                return { ...r, children: full.children || [] };
              } catch {
                return { ...r, children: r.children || [] };
              }
            })
          );
          roots = enriched;
        } catch (e) {
          console.error("Fallback fetch categories failed", e);
        }
      }
      setCategories(roots || []);
    } catch (err) {
      console.error("Error fetching categories", err);
    } finally {
      setLoading(false);
    }
  }, [loading, categories.length]);

  useEffect(() => {
    const handleOpenEvent = () => {
      setOpen(true);
      void ensureLoaded();
      setSelectedRootId(null);
    };
    if (typeof window !== "undefined") {
      window.addEventListener("open-categories", handleOpenEvent as EventListener);
    }
    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("open-categories", handleOpenEvent as EventListener);
      }
    };
  }, [ensureLoaded]);

  useEffect(() => {
    if (!open && !openMega) {
      setSelectedRootId(null);
    }
  }, [open, openMega]);

  const selectedRoot = useMemo(() => (selectedRootId ? categories.find(c => c.id === selectedRootId) || null : null), [categories, selectedRootId]);

  useEffect(() => {
    const enrichGrandChildren = async () => {
      if (!selectedRootId) return;
      const root = categories.find(c => c.id === selectedRootId);
      if (!root || !root.children || root.children.length === 0) return;
      const needEnrich = root.children.some((ch: any) => ch.children === undefined);
      if (!needEnrich) return;
      try {
        const enrichedChildren = await Promise.all(
          root.children.map(async (ch) => {
            try {
              const full = await CategoryService.findOne(ch.id);
              return { ...ch, children: (full as any).children || [] } as Category;
            } catch {
              return { ...ch } as Category;
            }
          })
        );
        const updated = categories.map(c => c.id === root.id ? { ...c, children: enrichedChildren } : c);
        setCategories(updated);
      } catch {}
    };
    void enrichGrandChildren();
  }, [selectedRootId, categories]);

  const handleMenuClose = () => {
    setOpenMega(false);
    setSelectedRootId(null);
  };
  
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const triggerButton = document.getElementById("category-trigger-btn");
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        !triggerButton?.contains(event.target as Node)
      ) {
        handleMenuClose();
      }
    }
    
    if (openMega) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [openMega]);

  const handleCategorySelect = (categoryId: string) => {
    setSelectedRootId(selectedRootId === categoryId ? null : categoryId);
  };

  return (
    <>
      <button
        id="category-trigger-btn"
        type="button"
        className={cntl`${getContainerStyles()} ${className || ""} max-md:hidden`}
        onClick={() => {
          const willOpen = !openMega;
          setOpenMega(willOpen);
          if (willOpen) {
            void ensureLoaded();
          } else {
            setSelectedRootId(null);
          }
        }}
      >
        <Icon variant="default" tamano="small" className={getIconStyles()}>
          <List />
        </Icon>
        <span className={getTitleStyles()}>Categorías</span>
      </button>

      {/* --- Desktop Sidebar Panel --- */}
      <div 
        ref={menuRef}
        className={cntl`
          hidden md:block fixed top-0 left-0 bottom-0 z-40
          transform transition-transform duration-300 ease-in-out
          ${openMega ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <div 
          className="bg-white shadow-2xl border-r border-gray-200 overflow-hidden h-full flex"
          style={{ 
            width: selectedRootId ? '700px' : '320px',
            transition: 'width 0.3s ease-in-out'
          }}
        >
          {/* Panel Izquierdo */}
          <div className="w-80 bg-white border-r border-gray-100 flex flex-col h-full">
            <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white flex-shrink-0">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-800">¡Hola!</h3>
                <button onClick={handleMenuClose} className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100">
                   <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>
            </div>
            
            <nav className="flex-1 overflow-y-auto">
              <ul className="py-2">
                {loading && <li className="px-6 py-3 text-gray-500 text-sm">Cargando...</li>}
                {!loading && categories.map((c) => (
                  <li key={c.id}>
                    <button
                      type="button"
                      className={`w-full text-left px-6 py-3 flex items-center justify-between transition-all duration-200 ${
                        selectedRootId === c.id 
                          ? "bg-red-50 text-red-700 border-r-4 border-red-500 font-medium" 
                          : "hover:bg-gray-50 text-gray-700 hover:text-gray-900"
                      }`}
                      onClick={() => handleCategorySelect(c.id)}
                    >
                      <span className="text-sm">{c.name}</span>
                      <svg className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${selectedRootId === c.id ? 'rotate-90' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                    </button>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
          {/* Panel Derecho */}
          {selectedRootId && selectedRoot && (
            <div className="flex-1 bg-white flex flex-col h-full">
              <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white flex-shrink-0">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-semibold text-gray-800 uppercase tracking-wide">{selectedRoot.name}</h4>
                  <a href={`#/categoria/${selectedRoot.id}`} className="text-blue-600 text-xs font-medium hover:underline">Ver todo</a>
                </div>
              </div>
              <div className="p-6 flex-1 overflow-y-auto">
                {selectedRoot.children && selectedRoot.children.length > 0 ? (
                  <div className="grid grid-cols-2 lg:grid-cols-3 gap-8">
                    {selectedRoot.children.map((child) => (
                      <div key={child.id} className="space-y-2">
                        <h5 className="font-semibold text-gray-900 text-sm border-b border-gray-100 pb-2">{child.name}</h5>
                        {Array.isArray((child as any).children) && (child as any).children.length > 0 ? (
                          <ul className="space-y-2">
                            {(child as any).children.map((grand: Category) => (
                              <li key={grand.id}><a href={`#/categoria/${grand.id}`} className="text-gray-600 hover:text-blue-600 text-xs block transition-colors">{grand.name}</a></li>
                            ))}
                          </ul>
                        ) : (
                          <a href={`#/categoria/${child.id}`} className="text-blue-600 text-xs font-medium hover:underline">Ver productos</a>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500 text-sm">Sin subcategorías</div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* --- Mobile Drawer --- */}
      <div className={cntl`
        md:hidden fixed inset-0 z-50
        transition-opacity duration-300
        ${open ? 'opacity-100' : 'opacity-0 pointer-events-none'}
      `}>
        <div 
          className="absolute inset-0 bg-transparent"
          onClick={() => setOpen(false)}
          aria-hidden="true"
        />

        <aside className={cntl`
          relative z-10 
          h-full w-full max-w-sm bg-white shadow-xl flex flex-col
          transform transition-transform duration-300 ease-in-out
          ${open ? 'translate-x-0' : '-translate-x-full'}
        `}>
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800">¡Hola!</h3>
            <button className="p-2" onClick={() => setOpen(false)} type="button">
              <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
          
          {!selectedRootId ? (
            <div className="flex-1 overflow-y-auto">
              <nav className="py-2">
                <ul>
                  {loading && <li className="px-6 py-3 text-gray-500">Cargando...</li>}
                  {!loading && categories.map((c) => (
                    <li key={c.id}>
                      <button type="button" className="w-full text-left px-6 py-4 flex items-center justify-between hover:bg-gray-50" onClick={() => setSelectedRootId(c.id)}>
                        <span className="text-gray-700 font-medium">{c.name}</span>
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                      </button>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto">
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50">
                <div className="flex items-center gap-4">
                  <button onClick={() => setSelectedRootId(null)} className="p-1 rounded-full hover:bg-gray-200">
                    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                  </button>
                  <h4 className="font-semibold text-gray-800">{selectedRoot?.name}</h4>
                </div>
                {selectedRoot && (
                  <a href={`#/categoria/${selectedRoot.id}`} className="text-blue-600 text-xs font-medium hover:text-blue-800 hover:underline">Ver todo</a>
                )}
              </div>
              <div className="p-6 space-y-6">
                {selectedRoot?.children?.map((child) => (
                  <div key={child.id} className="space-y-3">
                    <h5 className="font-semibold text-gray-900 border-b pb-2">{child.name}</h5>
                    {Array.isArray((child as any).children) && (child as any).children.length > 0 ? (
                      <ul className="space-y-2 pl-4">
                        {(child as any).children.map((grand: Category) => (
                          <li key={grand.id}><a href={`#/categoria/${grand.id}`} className="text-gray-600 hover:text-blue-600 text-sm block">{grand.name}</a></li>
                        ))}
                      </ul>
                    ) : (
                      <a href={`#/categoria/${child.id}`} className="text-blue-600 text-sm font-medium hover:underline">Ver todo</a>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </aside>
      </div>
    </>
  );
}

export { CategoryDropdown };