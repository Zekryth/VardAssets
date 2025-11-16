/**
 * PointPanelContent.jsx
 *
 * Contenido reutilizable para paneles de punto (flotante o lateral).
 * Muestra tabs con información, inventario, fotos y documentos POR PISO.
 */
import { useState, useEffect } from 'react';
import { Pencil, Trash2, ChevronUp, ChevronDown } from 'lucide-react';

export default function PointPanelContent({ point, onEdit, onDelete }) {
  const [activeTab, setActiveTab] = useState('info');
  const [pisoActual, setPisoActual] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    console.log('🔍 [PointPanelContent] === PUNTO RECIBIDO ===');
    console.log('   ID:', point?.id || point?._id);
    console.log('   Nombre:', point?.nombre);
    console.log('   Categoría (global):', point?.categoria);
    console.log('   Compañía (global):', point?.compañia_nombre || point?.compañia?.nombre);
    console.log('   Pisos raw:', point?.pisos);
    console.log('   Pisos tipo:', typeof point?.pisos);
    console.log('   Pisos isArray:', Array.isArray(point?.pisos));
    // Resetear piso actual cuando cambia el punto
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
  console.log('📊 [PointPanelContent] === PARSEO DE PISOS ===');
  console.log('   pisos inicial:', pisos);
  console.log('   typeof:', typeof pisos);
  
  if (typeof pisos === 'string') {
    try {
      pisos = JSON.parse(pisos);
      console.log('✅ [PointPanelContent] Pisos parseados desde string:', pisos);
    } catch (e) {
      console.error('❌ [PointPanelContent] Error parseando pisos:', e);
      pisos = [];
    }
  }
  
  if (!Array.isArray(pisos) || pisos.length === 0) {
    console.log('🔄 [PointPanelContent] No hay pisos válidos, migrando formato antiguo');
    
    // Fallback: si no hay pisos, crear uno con datos antiguos si existen
    const inventarioAntiguo = point.inventario || [];
    const fotosAntiguas = point.fotos || [];
    const documentosAntiguos = point.documentos || [];
    
    pisos = [{
      numero: 1,
      nombre: point.nombre || 'Planta Baja',
      categoria: point.categoria || '',
      compañia: point.compañia || point.company_id || null,
      inventario: Array.isArray(inventarioAntiguo) ? inventarioAntiguo : 
                  (typeof inventarioAntiguo === 'string' ? JSON.parse(inventarioAntiguo) : []),
      fotos: Array.isArray(fotosAntiguas) ? fotosAntiguas :
             (typeof fotosAntiguas === 'string' ? JSON.parse(fotosAntiguas) : []),
      documentos: Array.isArray(documentosAntiguos) ? documentosAntiguos :
                  (typeof documentosAntiguos === 'string' ? JSON.parse(documentosAntiguos) : [])
    }];
    console.log('✅ [PointPanelContent] Piso migrado:', pisos[0]);
  } else {
    // Asegurar que todos los pisos tengan categoria y compañia
    pisos = pisos.map((piso, index) => {
      const pisoCompleto = {
        numero: piso.numero || index + 1,
        nombre: piso.nombre || `Piso ${index + 1}`,
        categoria: piso.categoria || point.categoria || '',
        compañia: piso.compañia || point.compañia || point.company_id || null,
        inventario: Array.isArray(piso.inventario) ? piso.inventario : [],
        fotos: Array.isArray(piso.fotos) ? piso.fotos : [],
        documentos: Array.isArray(piso.documentos) ? piso.documentos : []
      };
      console.log(`📋 [PointPanelContent] Piso ${index + 1} procesado:`, pisoCompleto);
      return pisoCompleto;
    });
  }
  
  console.log(`🏢 [PointPanelContent] Total pisos procesados: ${pisos.length}`);
  console.log(`🏢 [PointPanelContent] ¿Mostrar navegación? ${pisos.length > 1}`);

  // Asegurar que pisoActual está en rango
  const currentFloor = pisos[Math.min(pisoActual, pisos.length - 1)] || pisos[0];
  const inventario = currentFloor.inventario || [];
  const fotos = currentFloor.fotos || [];
  const documentos = currentFloor.documentos || [];

  const tabs = [
    { id: 'info', name: 'Información', icon: '📋' },
    { id: 'inventory', name: 'Inventario', icon: '📦', badge: inventario.length },
    { id: 'photos', name: 'Fotos', icon: '📷', badge: fotos.length },
    { id: 'documents', name: 'Documentos', icon: '📄', badge: documentos.length }
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

  return (
    <div className="flex flex-col h-full">
      {/* Navegación de Pisos */}
      {pisos.length > 1 && (
        <div className="bg-blue-50 dark:bg-blue-900/20 border-b border-gray-200 dark:border-gray-700 px-4 py-3">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setPisoActual(Math.max(0, pisoActual - 1))}
              disabled={pisoActual === 0}
              className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded text-sm font-medium"
            >
              <ChevronUp className="w-4 h-4" />
              Anterior
            </button>

            <div className="text-center">
              <p className="text-sm font-bold text-blue-600 dark:text-blue-400">
                {currentFloor.nombre}
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Piso {pisoActual + 1} de {pisos.length}
              </p>
            </div>

            <button
              onClick={() => setPisoActual(Math.min(pisos.length - 1, pisoActual + 1))}
              disabled={pisoActual === pisos.length - 1}
              className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded text-sm font-medium"
            >
              Siguiente
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
        <nav className="flex -mb-px overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                relative px-4 py-2.5 text-sm font-medium transition-all flex items-center gap-2 whitespace-nowrap
                ${activeTab === tab.id
                  ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400 bg-white dark:bg-gray-800'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800'
                }
              `}
            >
              <span>{tab.icon}</span>
              <span>{tab.name}</span>
              {tab.badge !== undefined && tab.badge > 0 && (
                <span className="ml-1 px-2 py-0.5 text-xs font-semibold rounded-full bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
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
          <div className="p-4 space-y-4">
            {/* Información Básica */}
            <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 space-y-3">
              <h3 className="text-xs font-semibold text-gray-900 dark:text-white uppercase tracking-wide">
                📋 Información del Piso
              </h3>
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                    Nombre del Piso
                  </label>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">
                    {currentFloor.nombre}
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                    Categoría
                  </label>
                  <p className="text-sm text-gray-900 dark:text-white">
                    {currentFloor.categoria || (
                      <span className="text-gray-400 dark:text-gray-500 italic">Sin categoría</span>
                    )}
                  </p>
                </div>

                <div className="col-span-2">
                  <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                    Compañía
                  </label>
                  <p className="text-sm text-gray-900 dark:text-white">
                    {currentFloor.compañia || (
                      <span className="text-gray-400 dark:text-gray-500 italic">Sin compañía</span>
                    )}
                  </p>
                </div>
              </div>
            </div>

            {/* Coordenadas */}
            <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 space-y-2">
              <h3 className="text-xs font-semibold text-gray-900 dark:text-white uppercase tracking-wide">
                📍 Ubicación
              </h3>
              
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white dark:bg-gray-800 rounded-lg p-2.5 border border-gray-200 dark:border-gray-700">
                  <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-0.5">
                    X
                  </label>
                  <p className="text-base font-mono font-bold text-blue-600 dark:text-blue-400">
                    {coords?.x || 0} <span className="text-xs text-gray-400">px</span>
                  </p>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-lg p-2.5 border border-gray-200 dark:border-gray-700">
                  <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-0.5">
                    Y
                  </label>
                  <p className="text-base font-mono font-bold text-blue-600 dark:text-blue-400">
                    {coords?.y || 0} <span className="text-xs text-gray-400">px</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Fechas */}
            <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 space-y-2">
              <h3 className="text-xs font-semibold text-gray-900 dark:text-white uppercase tracking-wide">
                🕐 Fechas
              </h3>
              
              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500 dark:text-gray-400">Creado:</span>
                  <span className="text-xs font-medium text-gray-900 dark:text-white">
                    {point.created_at ? new Date(point.created_at).toLocaleString('es-ES') : 'N/A'}
                  </span>
                </div>
                
                {point.updated_at && point.updated_at !== point.created_at && (
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-500 dark:text-gray-400">Actualizado:</span>
                    <span className="text-xs font-medium text-gray-900 dark:text-white">
                      {new Date(point.updated_at).toLocaleString('es-ES')}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            {(onEdit || onDelete) && (
              <div className="flex gap-2 pt-2">
                {onEdit && (
                  <button
                    onClick={() => onEdit(point)}
                    disabled={loading}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg text-sm font-medium transition-colors"
                  >
                    <Pencil className="w-4 h-4" />
                    Editar
                  </button>
                )}
                
                {onDelete && (
                  <button
                    onClick={handleDelete}
                    disabled={loading}
                    className="flex items-center justify-center gap-2 px-3 py-2 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white rounded-lg text-sm font-medium transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                    {loading ? 'Eliminando...' : 'Eliminar'}
                  </button>
                )}
              </div>
            )}
          </div>
        )}

        {/* TAB: Inventario */}
        {activeTab === 'inventory' && (
          <div className="p-4">
            <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs font-semibold text-gray-900 dark:text-white uppercase tracking-wide">
                  📦 Inventario - {currentFloor.nombre} ({inventario.length})
                </h3>
                {onEdit && (
                  <button
                    onClick={() => onEdit(point)}
                    className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    Editar
                  </button>
                )}
              </div>

              {inventario.length === 0 ? (
                <div className="text-center py-10">
                  <div className="text-5xl mb-3">📦</div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    No hay objetos
                  </p>
                  {onEdit && (
                    <button
                      onClick={() => onEdit(point)}
                      className="mt-3 text-xs text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      Agregar objetos
                    </button>
                  )}
                </div>
              ) : (
                <div className="space-y-2">
                  {inventario.map((item, index) => (
                    <div
                      key={index}
                      className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {item.objeto_nombre || item.objeto?.nombre || item.nombre || 'Sin nombre'}
                          </p>
                          {(item.descripcion || item.objeto?.descripcion) && (
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                              {item.descripcion || item.objeto?.descripcion}
                            </p>
                          )}
                        </div>
                        <div className="text-right ml-3">
                          <p className="text-lg font-bold text-blue-600 dark:text-blue-400">
                            {item.cantidad || 0}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {item.unidad || item.objeto?.unidad || 'uds'}
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
          <div className="p-4">
            <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs font-semibold text-gray-900 dark:text-white uppercase tracking-wide">
                  📷 Fotos - {currentFloor.nombre} ({fotos.length})
                </h3>
                {onEdit && (
                  <button
                    onClick={() => onEdit(point)}
                    className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    Gestionar
                  </button>
                )}
              </div>

              {fotos.length === 0 ? (
                <div className="text-center py-10">
                  <div className="text-5xl mb-3">📷</div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    No hay fotos
                  </p>
                  {onEdit && (
                    <button
                      onClick={() => onEdit(point)}
                      className="mt-3 text-xs text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      Subir fotos
                    </button>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  {fotos.map((foto, index) => (
                    <div
                      key={index}
                      className="relative aspect-square bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden group cursor-pointer hover:ring-2 hover:ring-blue-500 transition-all"
                      onClick={() => window.open(foto, '_blank')}
                    >
                      <img
                        src={foto}
                        alt={`Foto ${index + 1}`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          console.error('Error cargando foto:', foto);
                          e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100"%3E%3Crect fill="%23ddd" width="100" height="100"/%3E%3Ctext fill="%23999" x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle"%3E❌%3C/text%3E%3C/svg%3E';
                        }}
                      />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <span className="text-white text-xs font-medium">Ver imagen</span>
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
          <div className="p-4">
            <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs font-semibold text-gray-900 dark:text-white uppercase tracking-wide">
                  📄 Documentos - {currentFloor.nombre} ({documentos.length})
                </h3>
                {onEdit && (
                  <button
                    onClick={() => onEdit(point)}
                    className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    Gestionar
                  </button>
                )}
              </div>

              {documentos.length === 0 ? (
                <div className="text-center py-10">
                  <div className="text-5xl mb-3">📄</div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    No hay documentos
                  </p>
                  {onEdit && (
                    <button
                      onClick={() => onEdit(point)}
                      className="mt-3 text-xs text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      Subir documentos
                    </button>
                  )}
                </div>
              ) : (
                <div className="space-y-2">
                  {documentos.map((doc, index) => (
                    <div
                      key={index}
                      className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <div className="text-2xl">
                          {getFileIcon(doc.contentType)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                            {doc.filename || `Documento ${index + 1}`}
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
                          className="px-2.5 py-1.5 text-xs font-medium text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded transition-colors"
                        >
                          Descargar
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
    </div>
  );
}
