import React from 'react';

type Props = {
  children: React.ReactNode;
};

type State = {
  hasError: boolean;
  error?: Error;
};

export class ErrorBoundary extends React.Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error) {
    // Mantém no console pra facilitar debug.
    console.error('Erro não tratado na UI:', error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: 24, fontFamily: 'ui-sans-serif, system-ui' }}>
          <div style={{ fontWeight: 900, fontSize: 18, marginBottom: 8 }}>
            O app quebrou (erro em runtime).
          </div>
          <div style={{ color: '#991b1b', fontWeight: 700, marginBottom: 12 }}>
            {this.state.error?.message || 'Erro desconhecido'}
          </div>
          <div style={{ color: '#6b7280', fontSize: 12, fontWeight: 700 }}>
            Abra o DevTools &gt; Console para ver o stacktrace.
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}


