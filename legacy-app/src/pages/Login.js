import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { login } from '../redux/actions/authActions';
import './Login.css';

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      errorMsg: '',
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.isAuthenticated) {
      this.props.history.push('/dashboard');
    }
    if (nextProps.error) {
      this.setState({ errorMsg: nextProps.error });
    }
  }

  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  }

  handleSubmit = (e) => {
    e.preventDefault();
    console.log('login attempt:', this.state.email);

    const { email, password } = this.state;

    if (!email || !password) {
      this.setState({ errorMsg: 'Please fill in all fields' });
      return;
    }

    this.props.login(email, password);
  }

  render() {
    const { email, password, errorMsg } = this.state;
    const { loading } = this.props;

    return (
      <div className="login-wrapper">
        <div className="login-card">
          <div style={{textAlign: 'center', marginBottom: 32}}>
            <h1 style={{color: '#4a90d9', fontSize: 28, fontWeight: 700}}>EcomDash</h1>
            <p style={{color: '#888', marginTop: 4}}>Sign in to your account</p>
          </div>

          {errorMsg && (
            <div className="login-error">{errorMsg}</div>
          )}

          <form onSubmit={this.handleSubmit}>
            <div className="form-group">
              <label>Email Address</label>
              <input
                type="email"
                name="email"
                className="form-input"
                placeholder="admin@example.com"
                value={email}
                onChange={this.handleChange}
              />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                name="password"
                className="form-input"
                placeholder="Enter your password"
                value={password}
                onChange={this.handleChange}
              />
            </div>
            <button
              type="submit"
              className="login-btn"
              disabled={loading}
              style={{opacity: loading ? 0.7 : 1}}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <p style={{textAlign: 'center', marginTop: 24, fontSize: 13, color: '#aaa'}}>
            Demo: use any email/password
          </p>
        </div>
      </div>
    );
  }
}

Login.propTypes = {
  login: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool,
  error: PropTypes.string,
  loading: PropTypes.bool,
};

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
  error: state.auth.error,
  loading: state.auth.loading,
});

export default connect(mapStateToProps, { login })(Login);
