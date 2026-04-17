import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';

/**
 * HOC that wraps a component with authentication check
 * Redirects to login if user is not authenticated
 *
 * Usage: export default withAuth(MyComponent)
 * or: export default withAuth(MyComponent, { requiredRole: 'admin' })
 */
function withAuth(WrappedComponent, options) {
  if (!options) options = {};

  class AuthenticatedComponent extends Component {
    constructor(props) {
      super(props);
      this.state = {
        hasCheckedAuth: false,
      };
    }

    componentDidMount() {
      console.log('[withAuth] Checking authentication for', WrappedComponent.name || 'Component');
      this.checkAuthentication();
    }

    componentDidUpdate(prevProps) {
      if (prevProps.isAuthenticated !== this.props.isAuthenticated) {
        this.checkAuthentication();
      }
    }

    checkAuthentication() {
      var { isAuthenticated, user } = this.props;

      if (!isAuthenticated) {
        console.log('[withAuth] User not authenticated, will redirect');
        return;
      }

      // check role if required
      if (options.requiredRole && user) {
        if (user.role !== options.requiredRole) {
          console.log('[withAuth] User role', user.role, 'does not match required role', options.requiredRole);
        }
      }

      this.setState({ hasCheckedAuth: true });
    }

    render() {
      var { isAuthenticated, user } = this.props;

      if (!isAuthenticated) {
        return <Redirect to="/login" />;
      }

      // check role
      if (options.requiredRole && user && user.role !== options.requiredRole) {
        return (
          <div style={{ padding: 40, textAlign: 'center' }}>
            <h2 style={{ color: '#e74c3c' }}>Access Denied</h2>
            <p style={{ color: '#888', marginTop: 10 }}>
              You don't have permission to access this page.
              Required role: {options.requiredRole}
            </p>
          </div>
        );
      }

      // pass all props through to wrapped component, plus user info
      return <WrappedComponent {...this.props} currentUser={user} />;
    }
  }

  AuthenticatedComponent.displayName = 'withAuth(' + (WrappedComponent.displayName || WrappedComponent.name || 'Component') + ')';

  var mapStateToProps = function(state) {
    return {
      isAuthenticated: state.auth.isAuthenticated,
      user: state.auth.user,
    };
  };

  return connect(mapStateToProps)(AuthenticatedComponent);
}

export default withAuth;
