/**
 * ErrorBoundary.jsx
 *
 * Componente de React para capturar y mostrar errores de renderizado en la UI.
 * Proporciona una interfaz amigable cuando ocurre un error inesperado en la aplicación.
 */
import React from 'react'

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }
  componentDidCatch(error, info) {
    console.error('UI ErrorBoundary:', error, info)
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen grid place-items-center bg-gray-50 p-6">
          <div className="max-w-lg w-full bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Ha ocurrido un error en la interfaz</h2>
            <p className="text-sm text-gray-600 mb-4">Intenta recargar la página. Si el problema persiste, comparte el mensaje de abajo.</p>
            <pre className="text-xs bg-gray-50 border border-gray-200 rounded p-3 overflow-auto">{String(this.state.error)}</pre>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}
