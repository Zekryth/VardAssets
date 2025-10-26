/**
 * Filters.jsx
 *
 * Componente de filtros avanzados para búsquedas y listados.
 * Permite filtrar por texto, categoría, compañía y rango de fechas.
 * Incluye UI para abrir/cerrar filtros y limpiar valores.
 */
import React, { useState } from 'react';
import { Search, X, SlidersHorizontal } from 'lucide-react';

const Filters = ({ onFilterChange, variant = 'default', value }) => {
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [filters, setFilters] = useState(
    value || { search: '', category: '', company: '', dateRange: '' }
  );

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const clearFilters = () => {
    const clearedFilters = {
      search: '',
      category: '',
      company: '',
      dateRange: ''
    };
    setFilters(clearedFilters);
    onFilterChange(clearedFilters);
  };

  const hasActiveFilters = Object.values(filters).some(value => value !== '');

  const compact = variant === 'compact'

  return (
    <div className={compact ? 'space-y-3' : 'space-y-4'}>
      {/* Barra de búsqueda principal */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={compact ? 18 : 20} />
        <input
          type="text"
          placeholder="Buscar puntos, objetos, compañías..."
          value={filters.search}
          onChange={(e) => handleFilterChange('search', e.target.value)}
          className={
            compact
              ? 'w-full pl-10 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
              : 'w-full pl-10 pr-4 py-3 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all'
          }
        />
      </div>

      {/* Botón de filtros avanzados */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setIsFiltersOpen(!isFiltersOpen)}
          className={compact
            ? 'flex items-center space-x-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg'
            : 'flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors'}
        >
          <SlidersHorizontal size={18} />
          <span>Filtros Avanzados</span>
          {hasActiveFilters && (
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
          )}
        </button>

        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className={compact ? 'flex items-center space-x-1 px-2.5 py-1.5 text-gray-600 hover:text-gray-800' : 'flex items-center space-x-1 px-3 py-2 text-gray-600 hover:text-gray-800 transition-colors'}
          >
            <X size={16} />
            <span className="text-sm">Limpiar</span>
          </button>
        )}
      </div>

      {/* Filtros avanzados */}
      {isFiltersOpen && (
        <div className={compact ? 'grid grid-cols-2 gap-3 p-3 bg-gray-50 rounded-xl border border-gray-200' : 'grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-xl border border-gray-200'}>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Categoría</label>
            <select
              value={filters.category}
              onChange={(e) => handleFilterChange('category', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Todas las categorías</option>
              <option value="oficina">Oficina</option>
              <option value="almacen">Almacén</option>
              <option value="reuniones">Sala de Reuniones</option>
              <option value="tecnologia">Tecnología</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Compañía</label>
            <select
              value={filters.company}
              onChange={(e) => handleFilterChange('company', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Todas las compañías</option>
              <option value="acme">ACME Corporation</option>
              <option value="globex">Globex Industries</option>
            </select>
          </div>
        </div>
      )}
    </div>
  );
};

export default Filters;