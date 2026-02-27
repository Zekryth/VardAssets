/**
 * PointPanelContent.jsx
 *
 * Contenido reutilizable para paneles de punto (flotante o lateral).
 * Dashboard profesional con grid layout, segmented control y iconos Lucide.
 */
import { useState, useEffect } from 'react';
import { 
  Pencil, 
  Trash2, 
  ChevronUp, 
  ChevronDown,
  Building2,
  MapPin,
  Calendar,
  Package,
  Image as ImageIcon,
  FileText,
  FileSpreadsheet,
  File,
  Expand,
  Info,
  Clock,
  Tag,
  Users,
  Download,
  Barcode
} from 'lucide-react';
import SegmentedControl from './SegmentedControl';

const cx = (...classes) => classes.filter(Boolean).join(' ');

export default function PointPanelContent({ point, onEdit, onDelete }) {
  const [activeTab, setActiveTab] = useState('info');
  const [pisoActual, setPisoActual] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    console.log('🔍 [PointPanelContent] === PUNTO RECIBIDO ===');
    console.log('   ID:', point?.id || point?._id);
    console.log('   Nombre:', point?.nombre);
    console.log('   Categoría (global):', point?.categoria);
    console.log('   Nr. Inv. SAP:', point?.nr_inventario_sap);
    console.log('   Compañía propietaria nombre:', point?.compania_propietaria_nombre);
    console.log('   Compañía alojada nombre:', point?.compania_alojada_nombre);
    console.log('   Pisos (raw):', point?.pisos);
    console.log('   Pisos length:', Array.isArray(point?.pisos) ? point.pisos.length : 'NOT ARRAY');
    setPisoActual(0);
  }, [point]);

  if (!point) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-500 dark:text-gray-400">No hay punto seleccionado</p>
      </div>
    );
  }

  // Parsear coordenadas si vienen como string
  let coords = point.coordenadas;
  if (typeof coords === 'string') {
    try {
      coords = JSON.parse(coords);
    } catch (e) {
      console.error('Error parseando coordenadas:', e);
      coords = { x: 0, y: 0 };
    }
  }

  // Parsear pisos si vienen como string
  let pisos = point.pisos || [];
  if (typeof pisos === 'string') {
    try {
      pisos = JSON.parse(pisos);
    } catch (e) {
      pisos = [];
    }
  }
  
  if (!Array.isArray(pisos) || pisos.length === 0) {
    // Fallback: crear piso con datos antiguos
    const inventarioAntiguo = point.inventario || [];
    const fotosAntiguas = point.fotos || [];
    const documentosAntiguos = point.documentos || [];
    
    pisos = [{
      numero: 0,
      nombre: point.nombre || 'Planta Baja',
      categoria: point.categoria || '',
      compania_propietaria: point.compania_propietaria || point.compañia || point.company_id || null,
      compania_alojada: point.compania_alojada || null,
      compania_alojada_fecha: point.compania_alojada_fecha || null,
      compania_propietaria_nombre: point.compania_propietaria_nombre || point.company_name || null,
      compania_alojada_nombre: point.compania_alojada_nombre || null,
      mijloc_fix: point.mijloc_fix || false,
      inventario: Array.isArray(inventarioAntiguo) ? inventarioAntiguo : 
                  (typeof inventarioAntiguo === 'string' ? JSON.parse(inventarioAntiguo) : []),
      fotos: Array.isArray(fotosAntiguas) ? fotosAntiguas :
             (typeof fotosAntiguas === 'string' ? JSON.parse(fotosAntiguas) : []),
      documentos: Array.isArray(documentosAntiguos) ? documentosAntiguos :
                  (typeof documentosAntiguos === 'string' ? JSON.parse(documentosAntiguos) : [])
    }];
  } else {
    pisos = pisos.map((piso, index) => ({
      numero: piso.numero || index + 1,
      nombre: piso.nombre || piso.nombre_piso || `Piso ${index + 1}`,
      categoria: piso.categoria || point.categoria || '',
      compania_propietaria: piso.compania_propietaria || piso.compañia || point.compania_propietaria || null,
      compania_alojada: piso.compania_alojada || point.compania_alojada || null,
      compania_alojada_fecha: piso.compania_alojada_fecha || point.compania_alojada_fecha || null,
      compania_propietaria_nombre: piso.compania_propietaria_nombre || point.compania_propietaria_nombre || point.company_name || null,
      compania_alojada_nombre: piso.compania_alojada_nombre || point.compania_alojada_nombre || null,
      mijloc_fix: piso.mijloc_fix || false,
      inventario: Array.isArray(piso.inventario) ? piso.inventario : [],
      fotos: Array.isArray(piso.fotos) ? piso.fotos : [],
      documentos: Array.isArray(piso.documentos) ? piso.documentos : []
    }));
  }

  const currentFloor = pisos[Math.min(pisoActual, pisos.length - 1)] || pisos[0];
  const inventario = currentFloor.inventario || [];
  const fotos = currentFloor.fotos || [];
  const documentos = currentFloor.documentos || [];

  const tabs = [
    { id: 'info', name: 'Info', icon: Info },
    { id: 'inventory', name: 'Inventario', icon: Package, badge: inventario.length },
    { id: 'photos', name: 'Fotos', icon: ImageIcon, badge: fotos.length },
    { id: 'documents', name: 'Docs', icon: FileText, badge: documentos.length }
  ];

  const handleDelete = async () => {
    if (confirm(`¿Estás seguro de eliminar el punto "${point.nombre}"?`)) {
      setLoading(true);
      try {
        await onDelete(point.id || point._id);
      } catch (error) {
        console.error('Error eliminando punto:', error);
        alert('Error al eliminar el punto');
      } finally {
        setLoading(false);
      }
    }
  };

  const getFileIcon = (contentType) => {
    if (!contentType) return File;
    if (contentType.includes('pdf')) return FileText;
    if (contentType.includes('word') || contentType.includes('document')) return FileText;
    if (contentType.includes('excel') || contentType.includes('spreadsheet')) return FileSpreadsheet;
    if (contentType.includes('image')) return ImageIcon;
    return File;
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return 'N/A';
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const formatHostedDate = (value) => {
    if (!value) return null;
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return null;
    return date.toLocaleDateString('es-ES');
  };

  const formatDateTime = (value) => {
    if (!value) return 'N/A';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return 'N/A';
    return date.toLocaleString('es-ES', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Floor navigation handlers
  const handlePrevFloor = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const newPiso = Math.max(0, pisoActual - 1);
    console.log('⬆️ [FloorNav] Anterior clicked - de', pisoActual, 'a', newPiso);
    setPisoActual(newPiso);
  };

  const handleNextFloor = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const newPiso = Math.min(pisos.length - 1, pisoActual + 1);
    console.log('⬇️ [FloorNav] Siguiente clicked - de', pisoActual, 'a', newPiso);
    setPisoActual(newPiso);
  };

  const handleDotClick = (e, idx) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('🔘 [FloorNav] Dot clicked - a piso', idx);
    setPisoActual(idx);
  };

  // Empty state component
  const EmptyState = ({ icon: Icon, title, subtitle, onAction, actionLabel }) => (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="w-16 h-16 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4">
        <Icon size={32} className="text-gray-400" />
      </div>
      <h4 className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">{title}</h4>
      {subtitle && <p className="text-xs text-gray-400 mb-4">{subtitle}</p>}
      {onAction && actionLabel && (
        <button
          onClick={onAction}
          className="text-sm text-blue-600 dark:text-blue-400 hover:underline font-medium"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );

  return (
    <div className="flex flex-col h-full">
      {/* Floor Navigation - inline para evitar problemas de re-render */}
      {pisos.length > 1 && (
        <div className="flex items-center justify-between px-4 py-2 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-b border-gray-200 dark:border-gray-700">
          <button
            type="button"
            onClick={handlePrevFloor}
            disabled={pisoActual === 0}
            className={cx(
              'flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-sm font-medium transition-all',
              pisoActual === 0
                ? 'bg-gray-100 dark:bg-gray-700 text-gray-400 cursor-not-allowed'
                : 'bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 shadow-sm hover:shadow border border-gray-200 dark:border-gray-600'
            )}
          >
            <ChevronUp size={16} />
            <span className="hidden sm:inline">Anterior</span>
          </button>

          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-gray-900 dark:text-white">
              {currentFloor.nombre}
            </span>
            <div className="flex items-center gap-1">
              {pisos.map((piso, idx) => (
                <button
                  type="button"
                  key={idx}
                  onClick={(e) => handleDotClick(e, idx)}
                  className={cx(
                    'w-2 h-2 rounded-full transition-all',
                    idx === pisoActual 
                      ? 'bg-blue-600 dark:bg-blue-400 scale-125' 
                      : 'bg-gray-300 dark:bg-gray-600 hover:bg-gray-400'
                  )}
                  title={piso.nombre}
                />
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={handleNextFloor}
            disabled={pisoActual === pisos.length - 1}
            className={cx(
              'flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-sm font-medium transition-all',
              pisoActual === pisos.length - 1
                ? 'bg-gray-100 dark:bg-gray-700 text-gray-400 cursor-not-allowed'
                : 'bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 shadow-sm hover:shadow border border-gray-200 dark:border-gray-600'
            )}
          >
            <span className="hidden sm:inline">Siguiente</span>
            <ChevronDown size={16} />
          </button>
        </div>
      )}

      {/* Segmented Control Tabs */}
      <div className="px-3 py-2 bg-gray-50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-700">
        <SegmentedControl
          tabs={tabs}
          activeTab={activeTab}
          onChange={setActiveTab}
          size="small"
        />
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {/* TAB: Información */}
        {activeTab === 'info' && (
          <div className="p-4">
            {/* Grid Layout - 2 columns */}
            <div className="grid grid-cols-5 gap-4">
              {/* Columna Izquierda - Info Principal (3 cols) */}
              <div className="col-span-5 lg:col-span-3 space-y-4">
                {/* Header Card */}
                <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                        {currentFloor.nombre}
                      </h3>
                      {currentFloor.categoria && (
                        <span className="inline-flex items-center gap-1 mt-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300">
                          <Tag size={12} />
                          {currentFloor.categoria}
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-gray-400 dark:text-gray-500">
                      Piso {pisoActual + 1}/{pisos.length}
                    </div>
                  </div>
                </div>

                {/* Compañía Propietaria */}
                <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                      <Building2 size={18} className="text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <span className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                      Propietario
                    </span>
                  </div>
                  <p className={cx(
                    'text-base font-semibold',
                    currentFloor.compania_propietaria_nombre || currentFloor.compania_propietaria
                      ? 'text-gray-900 dark:text-white'
                      : 'text-gray-400 dark:text-gray-500 italic'
                  )}>
                    {currentFloor.compania_propietaria_nombre || currentFloor.compania_propietaria || 'Sin compañía propietaria'}
                  </p>
                </div>

                {/* Compañía Alojada */}
                <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 rounded-lg bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center">
                      <Users size={18} className="text-violet-600 dark:text-violet-400" />
                    </div>
                    <span className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                      Alojado
                    </span>
                  </div>
                  <p className={cx(
                    'text-base font-semibold',
                    currentFloor.compania_alojada_nombre || currentFloor.compania_alojada
                      ? 'text-gray-900 dark:text-white'
                      : 'text-gray-400 dark:text-gray-500 italic'
                  )}>
                    {currentFloor.compania_alojada_nombre || currentFloor.compania_alojada || 'Sin compañía alojada'}
                  </p>
                  {currentFloor.compania_alojada_fecha && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 flex items-center gap-1">
                      <Clock size={12} />
                      Desde {formatHostedDate(currentFloor.compania_alojada_fecha)}
                    </p>
                  )}
                </div>
              </div>

              {/* Columna Derecha - Meta & Actions (2 cols) */}
              <div className="col-span-5 lg:col-span-2 space-y-4">
                {/* Ubicación */}
                <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 rounded-lg bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
                      <MapPin size={18} className="text-orange-600 dark:text-orange-400" />
                    </div>
                    <span className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                      Ubicación
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-2 text-center">
                      <span className="text-xs text-gray-500">X</span>
                      <p className="text-lg font-mono font-bold text-gray-900 dark:text-white">
                        {Math.round(coords?.x || 0)}
                      </p>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-2 text-center">
                      <span className="text-xs text-gray-500">Y</span>
                      <p className="text-lg font-mono font-bold text-gray-900 dark:text-white">
                        {Math.round(coords?.y || 0)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Nr. Inventario SAP */}
                {point.nr_inventario_sap && (
                  <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-8 h-8 rounded-lg bg-rose-100 dark:bg-rose-900/30 flex items-center justify-center">
                        <Barcode size={18} className="text-rose-600 dark:text-rose-400" />
                      </div>
                      <span className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                        Nr. Inv. SAP
                      </span>
                    </div>
                    <p className="text-base font-mono font-semibold text-gray-900 dark:text-white">
                      {point.nr_inventario_sap}
                    </p>
                  </div>
                )}

                {/* Fecha de Alojamiento */}
                <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 rounded-lg bg-sky-100 dark:bg-sky-900/30 flex items-center justify-center">
                      <Calendar size={18} className="text-sky-600 dark:text-sky-400" />
                    </div>
                    <span className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                      Alojamiento
                    </span>
                  </div>
                  <div className="space-y-2">
                    {currentFloor.compania_alojada_fecha ? (
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-500 dark:text-gray-400">Desde</span>
                        <span className="font-medium text-gray-900 dark:text-white">
                          {formatHostedDate(currentFloor.compania_alojada_fecha)}
                        </span>
                      </div>
                    ) : (
                      <p className="text-sm text-gray-400 dark:text-gray-500 italic">
                        Sin fecha registrada
                      </p>
                    )}
                  </div>
                </div>

                {/* Mijloc Fix indicator */}
                {currentFloor.mijloc_fix && (
                  <div className="bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-200 dark:border-amber-700 shadow-sm p-4">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">⭐</span>
                      <span className="text-sm font-semibold text-amber-700 dark:text-amber-300">
                        Mijloc Fix
                      </span>
                    </div>
                  </div>
                )}

                {/* Actions */}
                {(onEdit || onDelete) && (
                  <div className="flex gap-2">
                    {onEdit && (
                      <button
                        onClick={() => onEdit(point)}
                        disabled={loading}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-xl text-sm font-medium transition-all shadow-sm hover:shadow"
                      >
                        <Pencil size={16} />
                        Editar
                      </button>
                    )}
                    {onDelete && (
                      <button
                        onClick={handleDelete}
                        disabled={loading}
                        className="flex items-center justify-center gap-2 px-4 py-2.5 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400 rounded-xl text-sm font-medium transition-all border border-red-200 dark:border-red-800"
                      >
                        <Trash2 size={16} />
                        {loading ? '...' : 'Eliminar'}
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB: Inventario */}
        {activeTab === 'inventory' && (
          <div className="p-4">
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
              <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-gray-700">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                    <Package size={18} className="text-amber-600 dark:text-amber-400" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900 dark:text-white">Inventario</h4>
                    <p className="text-xs text-gray-500">{currentFloor.nombre} - {inventario.length} items</p>
                  </div>
                </div>
                {onEdit && inventario.length > 0 && (
                  <button
                    onClick={() => onEdit(point)}
                    className="text-xs text-blue-600 dark:text-blue-400 hover:underline font-medium"
                  >
                    Editar
                  </button>
                )}
              </div>

              <div className="p-4">
                {inventario.length === 0 ? (
                  <EmptyState
                    icon={Package}
                    title="Sin inventario"
                    subtitle="No hay objetos registrados en este piso"
                    onAction={onEdit ? () => onEdit(point) : null}
                    actionLabel="Agregar objetos"
                  />
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {inventario.map((item, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                      >
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                            {item.objeto_nombre || item.objeto?.nombre || item.nombre || 'Sin nombre'}
                          </p>
                          {(item.descripcion || item.objeto?.descripcion) && (
                            <p className="text-xs text-gray-500 truncate mt-0.5">
                              {item.descripcion || item.objeto?.descripcion}
                            </p>
                          )}
                        </div>
                        <div className="ml-3 text-right flex-shrink-0">
                          <span className="text-xl font-bold text-blue-600 dark:text-blue-400">
                            {item.cantidad || 0}
                          </span>
                          <p className="text-xs text-gray-400">
                            {item.unidad || item.objeto?.unidad || 'uds'}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB: Fotos */}
        {activeTab === 'photos' && (
          <div className="p-4">
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
              <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-gray-700">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-pink-100 dark:bg-pink-900/30 flex items-center justify-center">
                    <ImageIcon size={18} className="text-pink-600 dark:text-pink-400" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900 dark:text-white">Fotos</h4>
                    <p className="text-xs text-gray-500">{currentFloor.nombre} - {fotos.length} fotos</p>
                  </div>
                </div>
                {onEdit && fotos.length > 0 && (
                  <button
                    onClick={() => onEdit(point)}
                    className="text-xs text-blue-600 dark:text-blue-400 hover:underline font-medium"
                  >
                    Gestionar
                  </button>
                )}
              </div>

              <div className="p-4">
                {fotos.length === 0 ? (
                  <EmptyState
                    icon={ImageIcon}
                    title="Sin fotos"
                    subtitle="No hay imágenes en este piso"
                    onAction={onEdit ? () => onEdit(point) : null}
                    actionLabel="Subir fotos"
                  />
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {fotos.map((foto, index) => (
                      <div
                        key={index}
                        className="relative group aspect-square bg-gray-100 dark:bg-gray-900 rounded-xl overflow-hidden cursor-pointer"
                        onClick={() => window.open(foto, '_blank')}
                      >
                        <img
                          src={foto}
                          alt={`Foto ${index + 1}`}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100"%3E%3Crect fill="%23e5e7eb" width="100" height="100"/%3E%3Ctext fill="%239ca3af" x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-size="24"%3E?%3C/text%3E%3C/svg%3E';
                          }}
                        />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <Expand size={24} className="text-white" />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB: Documentos */}
        {activeTab === 'documents' && (
          <div className="p-4">
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
              <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-gray-700">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-cyan-100 dark:bg-cyan-900/30 flex items-center justify-center">
                    <FileText size={18} className="text-cyan-600 dark:text-cyan-400" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900 dark:text-white">Documentos</h4>
                    <p className="text-xs text-gray-500">{currentFloor.nombre} - {documentos.length} archivos</p>
                  </div>
                </div>
                {onEdit && documentos.length > 0 && (
                  <button
                    onClick={() => onEdit(point)}
                    className="text-xs text-blue-600 dark:text-blue-400 hover:underline font-medium"
                  >
                    Gestionar
                  </button>
                )}
              </div>

              <div className="p-4">
                {documentos.length === 0 ? (
                  <EmptyState
                    icon={FileText}
                    title="Sin documentos"
                    subtitle="No hay archivos en este piso"
                    onAction={onEdit ? () => onEdit(point) : null}
                    actionLabel="Subir documentos"
                  />
                ) : (
                  <div className="space-y-2">
                    {documentos.map((doc, index) => {
                      const FileIcon = getFileIcon(doc.contentType);
                      return (
                        <div
                          key={index}
                          className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-900 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                        >
                          <div className="w-10 h-10 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 flex items-center justify-center flex-shrink-0">
                            <FileIcon size={20} className="text-gray-500" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                              {doc.filename || `Documento ${index + 1}`}
                            </p>
                            <p className="text-xs text-gray-500">
                              {formatFileSize(doc.size)}
                            </p>
                          </div>
                          <a
                            href={doc.url || doc.downloadUrl}
                            download
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-medium transition-colors"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <Download size={14} />
                            <span className="hidden sm:inline">Descargar</span>
                          </a>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
