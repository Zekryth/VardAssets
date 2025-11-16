import React, { useState, useEffect } from 'react'
import { X, Upload, Trash2, Image as ImageIcon } from 'lucide-react'
import api from '../../services/api'

/**
 * TileImageManager Component
 * 
 * Modal para gestionar la imagen de fondo de un tile específico.
 * Permite ver, subir y eliminar la imagen del tile.
 */
export default function TileImageManager({ tileX, tileY, zoomLevel = 1, onClose, onUpdate }) {
  const [currentTile, setCurrentTile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    loadTileData()
  }, [tileX, tileY, zoomLevel])

  const loadTileData = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await api.get(`/tiles/${tileX}/${tileY}/${zoomLevel}`)
      setCurrentTile(response.data)
    } catch (err) {
      console.log('ℹ️ Tile no tiene imagen aún')
      setCurrentTile(null)
    } finally {
      setLoading(false)
    }
  }

  const handleFileSelect = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    // Validar tipo
    if (!file.type.startsWith('image/')) {
      setError('Por favor selecciona una imagen válida')
      return
    }

    // Validar tamaño (10MB)
    if (file.size > 10 * 1024 * 1024) {
      setError('La imagen no debe superar 10MB')
      return
    }

    setUploading(true)
    setError(null)

    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('type', 'map-tiles')
      formData.append('tileX', tileX.toString())
      formData.append('tileY', tileY.toString())
      formData.append('zoomLevel', zoomLevel.toString())

      const response = await api.post('/tiles', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        params: { tileX, tileY, zoom: zoomLevel }
      })

      console.log('✅ Tile actualizado:', response.data)
      
      await loadTileData()
      onUpdate?.()

    } catch (err) {
      console.error('❌ Error subiendo imagen:', err)
      setError(err.response?.data?.error || 'Error al subir imagen')
    } finally {
      setUploading(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm('¿Eliminar la imagen de este tile?')) return
    
    try {
      await api.delete(`/tiles/${tileX}/${tileY}/${zoomLevel}`)
      console.log('✅ Imagen eliminada')
      
      setCurrentTile(null)
      onUpdate?.()
      onClose()

    } catch (err) {
      console.error('❌ Error eliminando tile:', err)
      setError('Error al eliminar imagen')
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <ImageIcon className="w-5 h-5" />
            Gestionar Tile ({tileX}, {tileY})
          </h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded text-gray-600 dark:text-gray-400"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4">
          
          {loading && (
            <div className="flex items-center justify-center py-8 text-gray-500">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
          )}

          {!loading && (
            <>
              {/* Current Image */}
              {currentTile?.background_image_url ? (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Imagen actual:
                  </label>
                  <img
                    src={currentTile.background_image_url}
                    alt="Tile"
                    className="w-full h-48 object-cover rounded border border-gray-300 dark:border-gray-600"
                  />
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {currentTile.background_image_filename}
                  </div>
                  <button
                    onClick={handleDelete}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                    Eliminar Imagen
                  </button>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-gray-400">
                  <ImageIcon className="w-12 h-12 mb-2" />
                  <p className="text-sm">Este tile no tiene imagen de fondo</p>
                </div>
              )}

              {/* Uploader */}
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                  {currentTile?.background_image_url ? 'Cambiar imagen:' : 'Subir imagen:'}
                </label>
                
                <label className={`
                  flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer
                  transition-colors
                  ${uploading 
                    ? 'border-gray-300 bg-gray-50 dark:bg-gray-700 cursor-wait' 
                    : 'border-blue-300 hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900 dark:hover:bg-opacity-20'
                  }
                `}>
                  {uploading ? (
                    <>
                      <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-2"></div>
                      <span className="text-sm text-gray-600 dark:text-gray-400">Subiendo...</span>
                    </>
                  ) : (
                    <>
                      <Upload className="w-8 h-8 text-gray-400 mb-2" />
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        Click para seleccionar imagen
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                        PNG, JPG hasta 10MB
                      </span>
                    </>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    disabled={uploading}
                    className="hidden"
                  />
                </label>
              </div>

              {/* Error */}
              {error && (
                <div className="p-3 bg-red-50 dark:bg-red-900 dark:bg-opacity-20 border border-red-200 dark:border-red-800 rounded text-red-700 dark:text-red-400 text-sm">
                  {error}
                </div>
              )}
            </>
          )}

        </div>

      </div>
    </div>
  )
}
