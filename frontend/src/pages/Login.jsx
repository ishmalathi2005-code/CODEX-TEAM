import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Input from '../components/Input';
import Button from '../components/Button';
import ErrorMessage from '../components/ErrorMessage';
import { Mail, Lock, Terminal, LogIn } from 'lucide-react';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/dashboard';

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.email) {
      newErrors.email = 'Email address is required.';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address.';
    }
    if (!formData.password) {
      newErrors.password = 'Password is required.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError('');
    if (!validate()) return;

    setLoading(true);
    try {
      await login(formData);
      navigate(from, { replace: true });
    } catch (err) {
      setApiError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-61px)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-[#0B0F19]">
      <div className="w-full max-w-md space-y-8 glass-panel p-8 rounded-3xl border border-gray-800 shadow-2xl">
        <div className="text-center">
          <div className="mx-auto w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/25 mb-4">
            <Terminal className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Welcome Back to CODEX</h2>
          <p className="mt-2 text-xs text-gray-400">
            Sign in to access your interview simulator dashboard and AI insights.
          </p>
        </div>

        <ErrorMessage message={apiError} onClose={() => setApiError('')} />

        <form className="mt-6 space-y-4" onSubmit={handleSubmit} noValidate>
          <Input
            label="Email Address"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="candidate@example.com"
            icon={Mail}
            error={errors.email}
            required
          />

          <Input
            label="Password"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="••••••••"
            icon={Lock}
            error={errors.password}
            required
          />

          <div className="flex items-center justify-between text-xs">
            <label className="flex items-center text-gray-400 cursor-pointer">
              <input type="checkbox" className="rounded bg-gray-800 border-gray-700 text-blue-500 focus:ring-blue-500 mr-2" />
              Remember session
            </label>
            <a href="#" onClick={(e) => { e.preventDefault(); alert('Demo password reset link sent to email.'); }} className="text-blue-400 hover:text-blue-300 transition-colors">
              Forgot password?
            </a>
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            isLoading={loading}
            icon={LogIn}
            className="w-full mt-4"
          >
            Sign In to Dashboard
          </Button>
        </form>

        <div className="text-center pt-4 border-t border-gray-800/80">
          <p className="text-xs text-gray-400">
            Don't have a CODEX account?{' '}
            <Link to="/register" className="font-semibold text-blue-400 hover:text-blue-300 transition-colors">
              Register now
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
