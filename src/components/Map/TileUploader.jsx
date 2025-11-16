import React, { useState } from 'react'
import { Upload, Image as ImageIcon, CheckCircle, AlertCircle, X } from 'lucide-react'
import { coordinatesToTile, formatTileName } from '../../utils/mapTileCalculator'

/**
 * TileUploader Component
 * 
 * Permite a los admins subir imágenes de fondo para tiles específicos del mapa
 */
export default function TileUploader({ onClose, onTileUploaded }) {
  const [tileX, setTileX] = useState('')
  const [tileY, setTileY] = useState('')
  const [zoomLevel, setZoomLevel] = useState(1)
  const [selectedFile, setSelectedFile] = useState(null)
  const [previewUrl, setPreviewUrl] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)

  // Manejar selección de archivo
  const handleFileSelect = (e) => {
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

    setSelectedFile(file)
    setError(null)

    // Generar preview
    const reader = new FileReader()
    reader.onload = (e) => {
      setPreviewUrl(e.target.result)
    }
    reader.readAsDataURL(file)
  }

  // Subir tile
  const handleUpload = async () => {
    // Validaciones
    if (!tileX || !tileY) {
      setError('Debes especificar las coordenadas del tile (X, Y)')
      return
    }

    if (!selectedFile) {
      setError('Debes seleccionar una imagen')
      return
    }

    const x = parseInt(tileX)
    const y = parseInt(tileY)

    if (isNaN(x) || isNaN(y) || x < 0 || y < 0) {
      setError('Las coordenadas deben ser números positivos')
      return
    }

    setUploading(true)
    setError(null)

    try {
      const formData = new FormData()
      formData.append('image', selectedFile)
      formData.append('width', '512')
      formData.append('height', '512')

      const token = localStorage.getItem('token')
      const response = await fetch(
        `${import.meta.env.VITE_API_URL || '/api'}/tiles/${x}/${y}/${zoomLevel}`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          },
          body: formData
        }
      )

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Error al subir tile')
      }

      const data = await response.json()
      
      setSuccess(true)
      setTimeout(() => {
        onTileUploaded?.(data.tile)
        onClose?.()
      }, 1500)

    } catch (err) {
      console.error('Error uploading tile:', err)
      setError(err.message || 'Error al subir la imagen del tile')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <ImageIcon className="w-5 h-5" />
            Subir Imagen de Tile
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          {/* Coordenadas del Tile */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Coordenadas del Tile
            </label>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">
                  Tile X
                </label>
                <input
                  type="number"
                  min="0"
                  value={tileX}
                  onChange={(e) => setTileX(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                           bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="0"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">
                  Tile Y
                </label>
                <input
                  type="number"
                  min="0"
                  value={tileY}
                  onChange={(e) => setTileY(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                           bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="0"
                />
              </div>
            </div>
            {tileX && tileY && (
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {formatTileName(parseInt(tileX), parseInt(tileY))}
              </p>
            )}
          </div>

          {/* Zoom Level */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Nivel de Zoom
            </label>
            <select
              value={zoomLevel}
              onChange={(e) => setZoomLevel(parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                       bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value={1}>1x (512px)</option>
              <option value={2}>2x (1024px)</option>
              <option value={4}>4x (2048px)</option>
            </select>
          </div>

          {/* File Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Imagen de Fondo
            </label>
            <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center">
              {!previewUrl ? (
                <div>
                  <Upload className="w-12 h-12 mx-auto text-gray-400 mb-2" />
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    Click para seleccionar imagen
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-500">
                    PNG, JPG hasta 10MB
                  </p>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                </div>
              ) : (
                <div className="relative">
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="max-h-48 mx-auto rounded"
                  />
                  <button
                    onClick={() => {
                      setPreviewUrl(null)
                      setSelectedFile(null)
                    }}
                    className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full 
                             hover:bg-red-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                  {selectedFile && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                      {selectedFile.name} ({(selectedFile.size / 1024).toFixed(1)} KB)
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 
                          dark:border-red-800 rounded-lg text-red-700 dark:text-red-400">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <p className="text-sm">{error}</p>
            </div>
          )}

          {/* Success */}
          {success && (
            <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 
                          dark:border-green-800 rounded-lg text-green-700 dark:text-green-400">
              <CheckCircle className="w-5 h-5 flex-shrink-0" />
              <p className="text-sm">¡Tile subido exitosamente!</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex gap-3 p-4 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                     text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
            disabled={uploading}
          >
            Cancelar
          </button>
          <button
            onClick={handleUpload}
            disabled={uploading || !selectedFile || !tileX || !tileY}
            className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 
                     disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {uploading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Subiendo...
              </>
            ) : (
              <>
                <Upload className="w-4 h-4" />
                Subir Tile
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
