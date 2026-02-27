/**
 * PointPanelBody.jsx
 *
 * Panel lateral mejorado para mostrar y editar detalles de un punto.
 * Incluye tabs para Información, Inventario, Fotos y Documentos.
 */
import { useState, useEffect } from 'react';
import { X, Pencil, Trash2 } from 'lucide-react';

export default function PointPanelBody({ point, onClose, onEdit, onDelete }) {
  const [activeTab, setActiveTab] = useState('info');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    console.log('🔍 [POINT PANEL] Punto recibido:', point);
    console.log('📋 [POINT PANEL] Datos:', {
      id: point?.id || point?._id,
      nombre: point?.nombre,
      categoria: point?.categoria,
      compania_propietaria: point?.compania_propietaria_nombre || point?.company_name || point?.compania_propietaria || point?.compañia?.nombre,
      compania_alojada: point?.compania_alojada_nombre || point?.compania_alojada,
      coordenadas: point?.coordenadas,
      inventario: point?.inventario,
      fotos: point?.fotos,
      documentos: point?.documentos
    });
  }, [point]);

  if (!point) {
    return (
      <div className="fixed inset-y-0 right-0 w-96 bg-white dark:bg-gray-800 shadow-2xl z-50 flex items-center justify-center">
        <p className="text-gray-500 dark:text-gray-400">No point selected</p>
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

  // Parsear inventario si viene como string
  let inventario = point.inventario || [];
  if (typeof inventario === 'string') {
    try {
      inventario = JSON.parse(inventario);
    } catch (e) {
      console.error('Error parseando inventario:', e);
      inventario = [];
    }
  }

  // Parsear fotos si vienen como string
  let fotos = point.fotos || [];
  if (typeof fotos === 'string') {
    try {
      fotos = JSON.parse(fotos);
    } catch (e) {
      console.error('Error parseando fotos:', e);
      fotos = [];
    }
  }
  // Asegurar que fotos sea array
  if (!Array.isArray(fotos)) fotos = [];

  // Parsear documentos si vienen como string
  let documentos = point.documentos || [];
  if (typeof documentos === 'string') {
    try {
      documentos = JSON.parse(documentos);
    } catch (e) {
      console.error('Error parseando documentos:', e);
      documentos = [];
    }
  }
  // Asegurar que documentos sea array
  if (!Array.isArray(documentos)) documentos = [];

  const tabs = [
    { id: 'info', name: 'Information', icon: '📋' },
    { id: 'inventory', name: 'Inventory', icon: '📦', badge: inventario.length },
    { id: 'photos', name: 'Photos', icon: '📷', badge: fotos.length },
    { id: 'documents', name: 'Documents', icon: '📄', badge: documentos.length }
  ];

  const handleDelete = async () => {
    if (confirm(`Are you sure you want to delete the point "${point.nombre}"?`)) {
      setLoading(true);
      try {
        await onDelete(point.id || point._id);
        onClose();
      } catch (error) {
        console.error('Error deleting point:', error);
        alert('Error deleting point');
      } finally {
        setLoading(false);
      }
    }
  };

  const getFileIcon = (contentType) => {
    if (!contentType) return '📄';
    if (contentType.includes('pdf')) return '📕';
    if (contentType.includes('word') || contentType.includes('document')) return '📘';
    if (contentType.includes('excel') || contentType.includes('spreadsheet')) return '📗';
    if (contentType.includes('image')) return '🖼️';
    return '📄';
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return 'N/A';
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  };

  const formatHostedDate = (value) => {
    if (!value) return null;
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return null;
    return date.toLocaleDateString('es-ES');
  };

  return (
    <div className="fixed inset-y-0 right-0 w-[450px] bg-white dark:bg-gray-800 shadow-2xl z-50 flex flex-col animate-slide-in-right">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-700 dark:to-blue-800 px-6 py-5 flex items-center justify-between">
        <div className="flex-1 min-w-0">
          <h2 className="text-xl font-bold text-white truncate">
            {point.nombre}
          </h2>
          <p className="text-blue-100 text-sm mt-1">
            {point.categoria || 'No category'} • {(point.compania_propietaria_nombre || point.company_name || point.compania_propietaria || point.compañia?.nombre || 'No owner company')}
          </p>
        </div>
        <button
          onClick={onClose}
          className="ml-4 p-2 text-white hover:bg-white/20 rounded-lg transition-colors"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
        <nav className="flex -mb-px overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                relative px-6 py-3 text-sm font-medium transition-all flex items-center gap-2 whitespace-nowrap
                ${activeTab === tab.id
                  ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400 bg-white dark:bg-gray-800'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800'
                }
              `}
            >
              <span>{tab.icon}</span>
              <span>{tab.name}</span>
              {tab.badge !== undefined && tab.badge > 0 && (
                <span className="ml-2 px-2 py-0.5 text-xs font-semibold rounded-full bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
                  {tab.badge}
                </span>
              )}
            </button>
          ))}
        </nav>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {/* TAB: Información */}
        {activeTab === 'info' && (
          <div className="p-6 space-y-6">
            {/* Información Básica */}
            <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-5 space-y-4">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wide">
                📋 Información Básica
              </h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                    Nombre
                  </label>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">
                    {point.nombre}
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                    Category
                  </label>
                  <p className="text-sm text-gray-900 dark:text-white">
                    {point.categoria || (
                      <span className="text-gray-400 dark:text-gray-500 italic">No category</span>
                    )}
                  </p>
                </div>

                <div className="col-span-2">
                  <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                    Owner Company
                  </label>
                  <p className="text-sm text-gray-900 dark:text-white">
                    {point.compania_propietaria_nombre || point.company_name || point.compania_propietaria || point.compañia?.nombre || (
                      <span className="text-gray-400 dark:text-gray-500 italic">No owner company</span>
                    )}
                  </p>
                </div>

                <div className="col-span-2">
                  <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                    Hosted Company
                  </label>
                  <p className="text-sm text-gray-900 dark:text-white">
                    {point.compania_alojada_nombre || point.compania_alojada || (
                      <span className="text-gray-400 dark:text-gray-500 italic">No hosted company</span>
                    )}
                  </p>
                </div>

                <div className="col-span-2">
                  <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                    Hosting Date
                  </label>
                  <p className="text-sm text-gray-900 dark:text-white">
                    {formatHostedDate(point.compania_alojada_fecha) || (
                      <span className="text-gray-400 dark:text-gray-500 italic">No date recorded</span>
                    )}
                  </p>
                </div>
              </div>
            </div>

            {/* Coordenadas */}
            <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-5 space-y-3">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wide">
                📍 Location
              </h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-gray-200 dark:border-gray-700">
                  <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                    X Coordinate
                  </label>
                  <p className="text-lg font-mono font-bold text-blue-600 dark:text-blue-400">
                    {coords?.x || 0} <span className="text-xs text-gray-400">px</span>
                  </p>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-gray-200 dark:border-gray-700">
                  <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                    Y Coordinate
                  </label>
                  <p className="text-lg font-mono font-bold text-blue-600 dark:text-blue-400">
                    {coords?.y || 0} <span className="text-xs text-gray-400">px</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Fechas */}
            <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-5 space-y-3">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wide">
                🕐 Dates
              </h3>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500 dark:text-gray-400">Created:</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {point.created_at ? new Date(point.created_at).toLocaleString('en-US') : 'N/A'}
                  </span>
                </div>
                
                {point.updated_at && point.updated_at !== point.created_at && (
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-500 dark:text-gray-400">Updated:</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {new Date(point.updated_at).toLocaleString('en-US')}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB: Inventario */}
        {activeTab === 'inventory' && (
          <div className="p-6">
            <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wide">
                  📦 Inventory ({inventario.length})
                </h3>
                <button
                  onClick={() => onEdit(point)}
                  className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
                >
                  Edit
                </button>
              </div>

              {inventario.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">📦</div>
                  <p className="text-gray-500 dark:text-gray-400">
                    No inventory items
                  </p>
                  <button
                    onClick={() => onEdit(point)}
                    className="mt-4 text-sm text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    Add items
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {inventario.map((item, index) => (
                    <div
                      key={index}
                      className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <p className="font-medium text-gray-900 dark:text-white">
                            {item.objeto_nombre || item.objeto?.nombre || item.nombre || 'No name'}
                          </p>
                          {(item.descripcion || item.objeto?.descripcion) && (
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                              {item.descripcion || item.objeto?.descripcion}
                            </p>
                          )}
                        </div>
                        <div className="text-right ml-4">
                          <p className="text-xl font-bold text-blue-600 dark:text-blue-400">
                            {item.cantidad || 0}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {item.unidad || item.objeto?.unidad || 'units'}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB: Fotos */}
        {activeTab === 'photos' && (
          <div className="p-6">
            <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wide">
                  📷 Photos ({fotos.length})
                </h3>
                <button
                  onClick={() => onEdit(point)}
                  className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
                >
                  Manage photos
                </button>
              </div>

              {fotos.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">📷</div>
                  <p className="text-gray-500 dark:text-gray-400">
                    No photos
                  </p>
                  <button
                    onClick={() => onEdit(point)}
                    className="mt-4 text-sm text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    Upload photos
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  {fotos.map((foto, index) => (
                    <div
                      key={index}
                      className="relative aspect-square bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden group cursor-pointer hover:ring-2 hover:ring-blue-500 transition-all"
                      onClick={() => window.open(foto, '_blank')}
                    >
                      <img
                        src={foto}
                        alt={`Photo ${index + 1}`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          console.error('Error loading photo:', foto);
                          e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100"%3E%3Crect fill="%23ddd" width="100" height="100"/%3E%3Ctext fill="%23999" x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle"%3E❌%3C/text%3E%3C/svg%3E';
                        }}
                      />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <span className="text-white text-sm font-medium">View image</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB: Documentos */}
        {activeTab === 'documents' && (
          <div className="p-6">
            <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wide">
                  📄 Documents ({documentos.length})
                </h3>
                <button
                  onClick={() => onEdit(point)}
                  className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
                >
                  Manage documents
                </button>
              </div>

              {documentos.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">📄</div>
                  <p className="text-gray-500 dark:text-gray-400">
                    No documents
                  </p>
                  <button
                    onClick={() => onEdit(point)}
                    className="mt-4 text-sm text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    Upload documents
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {documentos.map((doc, index) => (
                    <div
                      key={index}
                      className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="text-3xl">
                          {getFileIcon(doc.contentType)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900 dark:text-white truncate">
                            {doc.filename || `Document ${index + 1}`}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {formatFileSize(doc.size)}
                          </p>
                        </div>
                        <a
                          href={doc.url || doc.downloadUrl}
                          download
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-2 text-sm font-medium text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                        >
                          Download
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Footer - Botones de acción */}
      <div className="border-t border-gray-200 dark:border-gray-700 p-6 bg-gray-50 dark:bg-gray-900">
        <div className="flex gap-3">
          <button
            onClick={() => onEdit(point)}
            disabled={loading}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg font-medium transition-colors"
          >
            <Pencil className="w-5 h-5" />
            Edit Point
          </button>
          
          <button
            onClick={handleDelete}
            disabled={loading}
            className="flex items-center justify-center gap-2 px-4 py-3 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white rounded-lg font-medium transition-colors"
          >
            <Trash2 className="w-5 h-5" />
            {loading ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  );
}
