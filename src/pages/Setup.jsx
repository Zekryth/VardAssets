import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Setup() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const setupAdmin = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await axios.get('/api/setup-admin?secret=vard-setup-2024');
      setResult(response.data);
      console.log('✅ Setup exitoso:', response.data);
    } catch (err) {
      console.error('❌ Error en setup:', err);
      setError(err.response?.data || { error: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="bg-gray-800 p-8 rounded-lg shadow-2xl w-full max-w-2xl">
        <h1 className="text-3xl font-bold text-white mb-6 text-center">
          🔧 Setup Inicial
        </h1>

        <div className="mb-6 text-gray-300">
          <p className="mb-4">Este endpoint creará el usuario administrador:</p>
          <div className="bg-gray-700 p-4 rounded-lg space-y-2">
            <div className="flex items-center">
              <span className="text-gray-400 w-24">Username:</span>
              <code className="bg-gray-900 px-3 py-1 rounded text-green-400">admin</code>
            </div>
            <div className="flex items-center">
              <span className="text-gray-400 w-24">Password:</span>
              <code className="bg-gray-900 px-3 py-1 rounded text-green-400">123456</code>
            </div>
            <div className="flex items-center">
              <span className="text-gray-400 w-24">Email:</span>
              <code className="bg-gray-900 px-3 py-1 rounded text-green-400">admin@vardassets.com</code>
            </div>
            <div className="flex items-center">
              <span className="text-gray-400 w-24">Role:</span>
              <code className="bg-gray-900 px-3 py-1 rounded text-blue-400">admin</code>
            </div>
          </div>
        </div>

        <button
          onClick={setupAdmin}
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed mb-4"
        >
          {loading ? '⏳ Creando usuario...' : '🚀 Crear Usuario Admin'}
        </button>

        {result && (
          <div className="bg-green-900/50 border border-green-500 rounded-lg p-4 mb-4">
            <h3 className="text-green-400 font-semibold mb-2">
              ✅ {result.message}
            </h3>
            {result.credentials && (
              <div className="mt-4 bg-green-800/50 p-3 rounded">
                <p className="text-green-200 font-semibold mb-2">Credenciales creadas:</p>
                <div className="space-y-1">
                  <p className="text-green-100 text-sm">
                    Username: <code className="bg-green-900 px-2 py-1 rounded">{result.credentials.username}</code>
                  </p>
                  <p className="text-green-100 text-sm">
                    Password: <code className="bg-green-900 px-2 py-1 rounded">{result.credentials.password}</code>
                  </p>
                  <p className="text-green-100 text-sm">
                    Email: <code className="bg-green-900 px-2 py-1 rounded">{result.credentials.email}</code>
                  </p>
                </div>
              </div>
            )}
            {result.note && (
              <div className="mt-3 text-green-200 text-sm">
                💡 {result.note}
              </div>
            )}
            <button
              onClick={() => navigate('/login')}
              className="mt-4 w-full bg-green-700 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded transition"
            >
              Ir al Login →
            </button>
          </div>
        )}

        {error && (
          <div className="bg-red-900/50 border border-red-500 rounded-lg p-4 mb-4">
            <h3 className="text-red-400 font-semibold mb-2">❌ Error</h3>
            <p className="text-red-300 text-sm mb-2">{error.error || 'Error desconocido'}</p>
            {error.message && (
              <p className="text-red-200 text-sm">{error.message}</p>
            )}
            {error.details && (
              <pre className="text-xs text-red-300 mt-2 overflow-auto bg-red-950 p-2 rounded">
                {error.details}
              </pre>
            )}
          </div>
        )}

        <div className="mt-6 pt-6 border-t border-gray-700">
          <a 
            href="/login"
            className="block text-center text-blue-400 hover:text-blue-300 transition"
          >
            ← Volver al Login
          </a>
        </div>
      </div>
    </div>
  );
}
