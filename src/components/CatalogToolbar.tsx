import type { CatalogFilters, CategoryFilter, SortKey } from "../lib/catalog";

interface Props {
  filters: CatalogFilters;
  onChange: (filters: CatalogFilters) => void;
}

export function CatalogToolbar({ filters, onChange }: Props) {
  return (
    <div className="toolbar">
      <label className="toolbar-field">
        <span>Buscar productos</span>
        <input
          type="search"
          value={filters.query}
          onChange={(e) => onChange({ ...filters, query: e.target.value })}
        />
      </label>
      <label className="toolbar-field">
        <span>Categoría</span>
        <select
          value={filters.category}
          onChange={(e) => onChange({ ...filters, category: e.target.value as CategoryFilter })}
        >
          <option value="Todas">Todas</option>
          <option value="Textiles">Textiles</option>
          <option value="Alimentos">Alimentos</option>
        </select>
      </label>
      <label className="toolbar-field">
        <span>Ordenar por</span>
        <select
          value={filters.sort}
          onChange={(e) => onChange({ ...filters, sort: e.target.value as SortKey })}
        >
          <option value="featured">Destacados</option>
          <option value="price-asc">Precio: menor a mayor</option>
          <option value="price-desc">Precio: mayor a menor</option>
          <option value="name">Nombre: A a Z</option>
        </select>
      </label>
    </div>
  );
}
