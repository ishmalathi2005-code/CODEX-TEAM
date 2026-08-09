import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Input from '../components/Input';
import Button from '../components/Button';
import ErrorMessage from '../components/ErrorMessage';
import LoadingSpinner from '../components/LoadingSpinner';
import { User, Mail, GraduationCap, Code2, Briefcase, Save, CheckCircle, ShieldCheck } from 'lucide-react';

const Profile = () => {
  const { user, updateUser } = useAuth();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    education: '',
    skills: '',
    experience: '',
  });

  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        education: user.education || '',
        skills: Array.isArray(user.skills) ? user.skills.join(', ') : (user.skills || ''),
        experience: user.experience || '',
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setSuccessMsg('');
    setErrorMsg('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMsg('');
    setErrorMsg('');
    setLoading(true);

    try {
      const skillsArray = formData.skills.split(',').map((s) => s.trim()).filter(Boolean);
      await updateUser({
        name: formData.name,
        education: formData.education,
        skills: skillsArray,
        experience: formData.experience,
      });
      setSuccessMsg('Profile updated successfully!');
    } catch (err) {
      setErrorMsg('Failed to update candidate profile.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-white">Candidate Profile</h1>
        <p className="text-gray-400 text-sm mt-1">
          Keep your candidate profile updated so CODEX can generate relevant technical and HR questions.
        </p>
      </div>

      {successMsg && (
        <div className="flex items-center gap-3 p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400 text-sm">
          <CheckCircle className="w-5 h-5 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      <ErrorMessage message={errorMsg} onClose={() => setErrorMsg('')} />

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left Summary Card */}
        <div className="p-6 rounded-3xl bg-[#111827] border border-gray-800 flex flex-col items-center text-center space-y-4">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-3xl font-bold shadow-xl border-4 border-[#0B0F19]">
            {user?.name ? user.name.charAt(0).toUpperCase() : 'C'}
          </div>

          <div>
            <h3 className="text-lg font-bold text-white">{user?.name || 'Candidate Name'}</h3>
            <p className="text-xs text-gray-400">{user?.email || 'email@codex.ai'}</p>
          </div>

          <div className="w-full pt-4 border-t border-gray-800 space-y-3 text-left">
            <div className="flex items-center gap-2 text-xs text-gray-300">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Identity Verified</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-300">
              <GraduationCap className="w-4 h-4 text-blue-400 shrink-0" />
              <span className="truncate">{formData.education || 'Education not specified'}</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-300">
              <Briefcase className="w-4 h-4 text-indigo-400 shrink-0" />
              <span>{formData.experience || 'Experience level not set'}</span>
            </div>
          </div>
        </div>

        {/* Right Form */}
        <div className="lg:col-span-2 p-8 rounded-3xl bg-[#111827] border border-gray-800 shadow-xl">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Full Name"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              icon={User}
              required
            />

            <Input
              label="Email Address (Read-only)"
              type="email"
              name="email"
              value={formData.email}
              disabled
              icon={Mail}
              className="opacity-60 cursor-not-allowed"
            />

            <Input
              label="Education Background"
              type="text"
              name="education"
              value={formData.education}
              onChange={handleChange}
              icon={GraduationCap}
              placeholder="e.g. B.S. Computer Science"
              required
            />

            <Input
              label="Skills (Comma separated)"
              type="text"
              name="skills"
              value={formData.skills}
              onChange={handleChange}
              icon={Code2}
              placeholder="React, Node.js, Python, SQL"
              helperText="Add technologies you want to practice in technical interviews"
              required
            />

            <Input
              label="Experience Level"
              type="text"
              name="experience"
              value={formData.experience}
              onChange={handleChange}
              icon={Briefcase}
              placeholder="e.g. 2 Years Software Engineer"
              required
            />

            <div className="pt-4 flex justify-end">
              <Button
                type="submit"
                variant="primary"
                size="md"
                isLoading={loading}
                icon={Save}
              >
                Save Profile Changes
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
