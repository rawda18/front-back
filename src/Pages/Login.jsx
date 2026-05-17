import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // ✅ أضيفي axios
import ThemeToggle from '../components/ThemeToggle';
import { Mail, Lock, ArrowLeft } from 'lucide-react';
import logo from '../assets/img.png';
import '../hook/Login.css';

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await axios.post('http://localhost:8000/login/', {
        email: email,
        password: password,
      });

      console.log('Login response:', response.data);

      // تخزين الـ tokens
      localStorage.setItem('access_token', response.data.tokens?.access);
      localStorage.setItem('refresh_token', response.data.tokens?.refresh);

      // ✅ تحديد الـ role من is_superuser و is_staff
      const user = response.data.user;
      let role = 'student';

      if (user.is_superuser === true) {
        role = 'super_admin';
      } else if (user.is_staff === true) {
        role = 'admin';
      } else {
        role = 'student';
      }

      localStorage.setItem('role', role);
      localStorage.setItem('user', JSON.stringify(user));

      // التوجيه حسب الـ role
      if (role === 'super_admin') {
        navigate('/dashboard/superadmin');
      } else if (role === 'admin') {
        navigate('/dashboard/admin');
      } else if (role === 'storekeeper') {
        navigate('/dashboard/storekeeper');
      } else {
        navigate('/dashboard/student');
      }
    } catch (err) {
      console.error('Login error:', err.response?.data);
      setError(err.response?.data?.detail || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="login-page-v3">
      <div className="login-topbar">
        <ThemeToggle />
      </div>

      <div className="login-content">
        <div className="login-brand text-center">
          <img src={logo} alt="ESI-GM" className="mx-auto mb-4 h-[80px] w-[80px]" />
          <h2 className="login-brand-name">ESI-GM</h2>
          <p className="login-brand-school">École Supérieure d'Informatique Sidi Bel Abbès</p>
          <p className="login-brand-date">8 Mai 1945</p>

          <h1 className="login-title">Welcome Back</h1>
          <p className="login-subtitle">Sign in to your ESI-GM account</p>
        </div>

        <div className="login-card-v3">
          <div className="login-demo">
            <h3>Demo Accounts:</h3>
            <ul>
              <li>• Admin: a.admin@esi-sba.dz</li>
              <li>• Storekeeper: s.keeper@esi-sba.dz</li>
              <li>• Student: m.student@esi-sba.dz</li>
            </ul>
          </div>

          <form className="login-form-v3" onSubmit={handleSubmit}>
            <div className="login-field-v3">
              <label>Email Address / Username</label>
              <div className="login-input-v3">
                <Mail size={16} />
                <input
                  type="text"
                  placeholder="Enter your email or username"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <small>Use your ESI email: x.xxxx@esi-sba.dz</small>
            </div>

            <div className="login-field-v3">
              <label>Password</label>
              <div className="login-input-v3">
                <Lock size={16} />
                <input
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            {error && <div className="text-red-500 text-sm text-center">{error}</div>}

            <button type="submit" className="login-submit-v3" disabled={loading}>
              {loading ? 'Loading...' : 'Sign In'}
            </button>
          </form>

          <div className="login-footer-v3">
            <div>
              <p onClick={() => navigate('/register')}>
                Don&apos;t have an account?{' '}
                <span style={{ cursor: 'pointer', color: '#3b82f6' }}>Register here</span>
              </p>
            </div>

            <div className="login-divider-v3" />

            <button type="button" className="login-back-v3" onClick={() => navigate('/')}>
              <ArrowLeft size={14} />
              <span>Back to Home</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
