import React, { Component } from 'react';

/**
 * HOC that adds loading state management to a component
 * Provides isLoading prop and setLoading method
 *
 * Usage: export default withLoading(MyComponent)
 */
function withLoading(WrappedComponent) {

  class LoadingComponent extends Component {
    constructor(props) {
      super(props)
      this.state = {
        isLoading: false,
        loadingMessage: 'Loading...',
        error: null,
      }
      // track if component is mounted to prevent setState on unmounted component
      // TODO: this pattern is an antipattern, should use AbortController
      this._isMounted = false;
    }

    componentDidMount() {
      this._isMounted = true;
    }

    componentWillUnmount() {
      this._isMounted = false;
    }

    setLoading = (loading, message) => {
      if (this._isMounted) {
        this.setState({
          isLoading: loading,
          loadingMessage: message || 'Loading...',
        });
      }
    }

    setError = (error) => {
      if (this._isMounted) {
        this.setState({
          error: error,
          isLoading: false,
        })
      }
    }

    clearError = () => {
      this.setState({ error: null })
    }

    render() {
      var { isLoading, loadingMessage, error } = this.state

      return (
        <div style={{ position: 'relative' }}>
          {isLoading && (
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(255,255,255,0.8)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 100,
              flexDirection: 'column',
            }}>
              <div style={{
                width: 40,
                height: 40,
                border: '4px solid #f3f3f3',
                borderTop: '4px solid #4a90d9',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite',
              }}></div>
              <p style={{ marginTop: 12, color: '#666', fontSize: 14 }}>{loadingMessage}</p>
            </div>
          )}

          {error && (
            <div style={{
              background: '#fde8e8',
              color: '#c0392b',
              padding: '10px 16px',
              borderRadius: 4,
              marginBottom: 16,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
              <span>{error}</span>
              <button
                onClick={this.clearError}
                style={{ background: 'none', border: 'none', color: '#c0392b', cursor: 'pointer', fontSize: 18 }}
              >
                &times;
              </button>
            </div>
          )}

          <WrappedComponent
            {...this.props}
            isLoading={isLoading}
            setLoading={this.setLoading}
            setError={this.setError}
            clearError={this.clearError}
          />
        </div>
      )
    }
  }

  LoadingComponent.displayName = 'withLoading(' + (WrappedComponent.displayName || WrappedComponent.name || 'Component') + ')';

  return LoadingComponent;
}

export default withLoading;
