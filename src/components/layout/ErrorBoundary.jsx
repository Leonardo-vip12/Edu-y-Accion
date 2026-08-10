import { Component } from 'react'

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[400px] flex items-center justify-center bg-gray-50">
          <div className="text-center p-8 max-w-md">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 flex items-center justify-center">
              <span className="text-red-500 text-2xl font-bold">!</span>
            </div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">Algo salió mal</h2>
            <p className="text-gray-500 text-sm mb-4">
              Ocurrió un error inesperado en esta sección.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2 rounded-lg bg-green-600 text-white text-sm font-medium hover:bg-green-700 transition-colors"
            >
              Recargar página
            </button>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}
