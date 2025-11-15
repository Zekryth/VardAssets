import { useState } from 'react';
import { FileText, Trash2, Upload, Download } from 'lucide-react';
import api from '../../services/api';

export default function DocumentUpload({ pointId, documents = [], onDocumentsChange }) {
  const [uploading, setUploading] = useState(false);

  const handleFileSelect = async (e) => {
    const files = Array.from(e.target.files);
    
    if (files.length === 0) return;

    setUploading(true);

    try {
      const uploadedDocs = [];

      for (const file of files) {
        console.log('📤 Subiendo documento:', file.name);

        const formData = new FormData();
        formData.append('file', file);
        formData.append('type', 'documentos');
        formData.append('pointId', pointId || 'temp');

        const response = await api.post('/upload', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });

        uploadedDocs.push({
          url: response.data.url,
          downloadUrl: response.data.downloadUrl,
          filename: response.data.filename,
          size: response.data.size,
          contentType: response.data.contentType
        });

        console.log('✅ Documento subido:', response.data.filename);
      }

      onDocumentsChange([...documents, ...uploadedDocs]);

      console.log(`🎉 ${uploadedDocs.length} documentos subidos`);
      
    } catch (error) {
      console.error('❌ Error subiendo documentos:', error);
      alert('Error al subir documentos: ' + (error.response?.data?.error || error.message));
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (docUrl) => {
    if (!confirm('¿Eliminar este documento?')) return;

    try {
      await api.delete('/upload', { data: { url: docUrl } });
      onDocumentsChange(documents.filter(doc => doc.url !== docUrl));
      console.log('✅ Documento eliminado');
    } catch (error) {
      console.error('❌ Error eliminando documento:', error);
      alert('Error al eliminar documento');
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / 1024 / 1024).toFixed(1) + ' MB';
  };

  const getFileIcon = (contentType) => {
    if (contentType?.includes('pdf')) return '📄';
    if (contentType?.includes('word')) return '📝';
    if (contentType?.includes('excel') || contentType?.includes('sheet')) return '📊';
    return '📎';
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Documentos ({documents.length})
        </h3>
        
        <label className="cursor-pointer">
          <input
            type="file"
            multiple
            accept=".pdf,.doc,.docx,.xls,.xlsx,.txt"
            onChange={handleFileSelect}
            disabled={uploading}
            className="hidden"
          />
          <div className={`flex items-center gap-2 px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}>
            <Upload size={16} />
            <span className="text-sm font-medium">
              {uploading ? 'Subiendo...' : 'Subir Documentos'}
            </span>
          </div>
        </label>
      </div>

      {/* Lista de documentos */}
      <div className="space-y-2">
        {documents.map((doc, index) => (
          <div 
            key={index}
            className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <span className="text-2xl">{getFileIcon(doc.contentType)}</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                  {doc.filename}
                </p>
                <p className="text-xs text-gray-500">
                  {formatFileSize(doc.size)}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <a
                href={doc.downloadUrl || doc.url}
                download
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900 rounded-lg transition-colors"
                title="Descargar"
              >
                <Download size={18} />
              </a>
              <button
                onClick={() => handleDelete(doc.url)}
                className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900 rounded-lg transition-colors"
                title="Eliminar"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {documents.length === 0 && !uploading && (
        <div className="text-center py-8 text-gray-400">
          <FileText className="w-12 h-12 mx-auto mb-2 opacity-50" />
          <p className="text-sm">No hay documentos. Click en "Subir Documentos" para agregar.</p>
        </div>
      )}
    </div>
  );
}
