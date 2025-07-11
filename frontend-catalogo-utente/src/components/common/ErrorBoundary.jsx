import React, { Component } from 'react';
import './ErrorBoundary.css';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error) {
    // Aggiorna lo stato così il prossimo render mostrerà l'UI di fallback
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Puoi anche loggare l'errore in un servizio di reporting
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.setState({ errorInfo });
  }

  render() {
    if (this.state.hasError) {
      const { fallback } = this.props;
      
      // Mostra il fallback personalizzato se fornito
      if (fallback) {
        return fallback(this.state.error, this.state.errorInfo);
      }
      
      // Fallback predefinito
      return (
        <div className="error-boundary">
          <h2>Qualcosa è andato storto.</h2>
          <p>Si è verificato un errore durante il rendering di questo componente.</p>
          <details>
            <summary>Dettagli dell'errore</summary>
            <p>{this.state.error && this.state.error.toString()}</p>
            <div className="error-stack">
              {this.state.errorInfo && this.state.errorInfo.componentStack}
            </div>
          </details>
          <button 
            onClick={() => this.setState({ hasError: false, error: null, errorInfo: null })}
            className="retry-button"
          >
            Riprova
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
