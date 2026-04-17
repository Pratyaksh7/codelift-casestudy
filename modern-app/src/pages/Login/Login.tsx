import { useState, type ChangeEvent, type FormEvent } from 'react';
import { ApiError } from '../../api/client';
import { login as loginRequest, type LoginResponse } from '../../api/services/auth';
import './Login.css';

export type LoginProps = {
  onLoginSuccess?: () => void;
};

// Legacy authActions.login falls back to a mock session on network failure and
// persists { token, user } to localStorage. Preserved to match UX.
function mockLoginResponse(email: string): LoginResponse {
  return { token: 'mock-token', user: { email } };
}

function persistSession(response: LoginResponse): void {
  try {
    localStorage.setItem('authToken', response.token);
    localStorage.setItem('authUser', JSON.stringify(response.user));
  } catch {
    // localStorage may be unavailable (private mode) — ignore
  }
}

function Login({ onLoginSuccess }: LoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMsg('');

    if (!email || !password) {
      setErrorMsg('Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      const response = await loginRequest(email, password);
      persistSession(response);
      onLoginSuccess?.();
    } catch (err) {
      if (err instanceof ApiError) {
        setErrorMsg(err.message);
      } else {
        // Network / non-API failure — fall back to mock session like legacy authActions.login.
        persistSession(mockLoginResponse(email));
        onLoginSuccess?.();
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-card">
        <div className="login-card__header">
          <h1 className="login-card__title">EcomDash</h1>
          <p className="login-card__subtitle">Sign in to your account</p>
        </div>

        {errorMsg && <div className="login-error">{errorMsg}</div>}

        <form onSubmit={handleSubmit}>
          <div className="login-form__group">
            <label className="login-form__label" htmlFor="login-email">
              Email Address
            </label>
            <input
              id="login-email"
              type="email"
              name="email"
              className="login-form__input"
              placeholder="admin@example.com"
              value={email}
              onChange={handleEmailChange}
            />
          </div>
          <div className="login-form__group">
            <label className="login-form__label" htmlFor="login-password">
              Password
            </label>
            <input
              id="login-password"
              type="password"
              name="password"
              className="login-form__input"
              placeholder="Enter your password"
              value={password}
              onChange={handlePasswordChange}
            />
          </div>
          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p className="login-card__hint">Demo: use any email/password</p>
      </div>
    </div>
  );
}

export default Login;
