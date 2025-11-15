import { useState } from 'react';
import { Upload, Trash2, Image as ImageIcon } from 'lucide-react';
import api from '../../services/api';

export default function PhotoUpload({ pointId, photos = [], onPhotosChange }) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleFileSelect = async (e) => {
    const files = Array.from(e.target.files);
    
    if (files.length === 0) return;

    setUploading(true);
    setProgress(0);

    try {
      const uploadedUrls = [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        
        console.log('📤 Subiendo foto:', file.name);

        const formData = new FormData();
        formData.append('file', file);
        formData.append('type', 'fotos');
        formData.append('pointId', pointId || 'temp');

        const response = await api.post('/upload', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });

        uploadedUrls.push(response.data.url);
        setProgress(Math.round(((i + 1) / files.length) * 100));

        console.log('✅ Foto subida:', response.data.url);
      }

      // Actualizar lista de fotos
      onPhotosChange([...photos, ...uploadedUrls]);

      console.log(`🎉 ${uploadedUrls.length} fotos subidas exitosamente`);
      
    } catch (error) {
      console.error('❌ Error subiendo fotos:', error);
      alert('Error al subir fotos: ' + (error.response?.data?.error || error.message));
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  const handleDelete = async (photoUrl) => {
    if (!confirm('¿Eliminar esta foto?')) return;

    try {
      await api.delete('/upload', { data: { url: photoUrl } });
      onPhotosChange(photos.filter(url => url !== photoUrl));
      console.log('✅ Foto eliminada');
    } catch (error) {
      console.error('❌ Error eliminando foto:', error);
      alert('Error al eliminar foto');
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Fotos ({photos.length})
        </h3>
        
        <label className="cursor-pointer">
          <input
            type="file"
            multiple
            accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
            onChange={handleFileSelect}
            disabled={uploading}
            className="hidden"
          />
          <div className={`flex items-center gap-2 px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}>
            <Upload size={16} />
            <span className="text-sm font-medium">
              {uploading ? `Subiendo ${progress}%` : 'Subir Fotos'}
            </span>
          </div>
        </label>
      </div>

      {/* Progress bar */}
      {uploading && (
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div 
            className="bg-blue-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      {/* Grid de fotos */}
      <div className="grid grid-cols-3 gap-4">
        {photos.map((photoUrl, index) => (
          <div key={index} className="relative group aspect-square">
            <img
              src={photoUrl}
              alt={`Foto ${index + 1}`}
              className="w-full h-full object-cover rounded-lg"
              onError={(e) => {
                e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100"%3E%3Crect fill="%23ddd" width="100" height="100"/%3E%3Ctext fill="%23999" x="50%25" y="50%25" text-anchor="middle" dy=".3em"%3EError%3C/text%3E%3C/svg%3E';
              }}
            />
            <button
              onClick={() => handleDelete(photoUrl)}
              className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
              title="Eliminar foto"
            >
              <Trash2 size={14} />
            </button>
          </div>
        ))}
      </div>

      {photos.length === 0 && !uploading && (
        <div className="text-center py-8 text-gray-400">
          <ImageIcon className="w-12 h-12 mx-auto mb-2 opacity-50" />
          <p className="text-sm">No hay fotos. Click en "Subir Fotos" para agregar.</p>
        </div>
      )}
    </div>
  );
}
