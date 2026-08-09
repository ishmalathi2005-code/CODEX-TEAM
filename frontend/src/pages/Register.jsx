import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Input from '../components/Input';
import Button from '../components/Button';
import ErrorMessage from '../components/ErrorMessage';
import { User, Mail, Lock, GraduationCap, Code2, Briefcase, UserPlus, Terminal } from 'lucide-react';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    education: '',
    skills: '',
    experience: '',
  });

  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Full name is required.';
    if (!formData.email) {
      newErrors.email = 'Email address is required.';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Invalid email address format.';
    }
    if (!formData.password) {
      newErrors.password = 'Password is required.';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters.';
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match.';
    }
    if (!formData.education.trim()) newErrors.education = 'Education background is required.';
    if (!formData.skills.trim()) newErrors.skills = 'Primary skills are required.';
    if (!formData.experience.trim()) newErrors.experience = 'Experience level is required.';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError('');
    if (!validate()) return;

    setLoading(true);
    try {
      const skillsArray = formData.skills.split(',').map((s) => s.trim()).filter(Boolean);
      await register({
        ...formData,
        skills: skillsArray,
      });
      navigate('/dashboard');
    } catch (err) {
      setApiError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-61px)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-[#0B0F19]">
      <div className="w-full max-w-xl space-y-6 glass-panel p-8 rounded-3xl border border-gray-800 shadow-2xl">
        <div className="text-center">
          <div className="mx-auto w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/25 mb-4">
            <Terminal className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Create Candidate Account</h2>
          <p className="mt-1 text-xs text-gray-400">
            Setup your candidate profile for customized AI interview evaluations.
          </p>
        </div>

        <ErrorMessage message={apiError} onClose={() => setApiError('')} />

        <form className="mt-6 space-y-4" onSubmit={handleSubmit} noValidate>
          <div className="grid sm:grid-cols-2 gap-4">
            <Input
              label="Full Name"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. Alex Rivera"
              icon={User}
              error={errors.name}
              required
            />

            <Input
              label="Email Address"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="alex@example.com"
              icon={Mail}
              error={errors.email}
              required
            />
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
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

            <Input
              label="Confirm Password"
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="••••••••"
              icon={Lock}
              error={errors.confirmPassword}
              required
            />
          </div>

          <Input
            label="Education"
            type="text"
            name="education"
            value={formData.education}
            onChange={handleChange}
            placeholder="e.g. B.Tech Computer Science, Stanford University"
            icon={GraduationCap}
            error={errors.education}
            required
          />

          <Input
            label="Key Skills (comma separated)"
            type="text"
            name="skills"
            value={formData.skills}
            onChange={handleChange}
            placeholder="e.g. React.js, Node.js, Python, System Design"
            icon={Code2}
            error={errors.skills}
            helperText="Separate skills with commas"
            required
          />

          <Input
            label="Experience Level"
            type="text"
            name="experience"
            value={formData.experience}
            onChange={handleChange}
            placeholder="e.g. 2 Years / Fresh Graduate / Senior Engineer"
            icon={Briefcase}
            error={errors.experience}
            required
          />

          <Button
            type="submit"
            variant="primary"
            size="lg"
            isLoading={loading}
            icon={UserPlus}
            className="w-full mt-4"
          >
            Register Candidate Account
          </Button>
        </form>

        <div className="text-center pt-4 border-t border-gray-800/80">
          <p className="text-xs text-gray-400">
            Already registered?{' '}
            <Link to="/login" className="font-semibold text-blue-400 hover:text-blue-300 transition-colors">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
