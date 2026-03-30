import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  EyeIcon,
  EyeSlashIcon,
  UserIcon,
  EnvelopeIcon,
  LockClosedIcon,
  BriefcaseIcon
} from '@heroicons/react/24/outline';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { authService } from '../services/auth';
import toast from 'react-hot-toast';

const Auth = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        // Login
        await authService.login({
          email: formData.email,
          password: formData.password
        });
        
        toast.success('Login successful!');
        navigate('/dashboard');
      } else {
        // Register
        await authService.register({
          name: formData.name,
          email: formData.email,
          password: formData.password
        });
        
        toast.success('Registration successful! You can now login.');
        setIsLogin(true);
        setFormData({ name: '', email: '', password: '' });
      }
    } catch (error) {
      console.error('Auth error:', error);
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error || 
                          error.message || 
                          'Authentication failed';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setFormData({ name: '', email: '', password: '' });
  };

  return (
    <div className="min-h-screen bg-[#050505] text-zinc-300 font-sans selection:bg-zinc-800 selection:text-white flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-white opacity-[0.03] blur-[100px] rounded-full pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_40%,#000_70%,transparent_100%)] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white/[0.03] border border-white/[0.08] rounded-2xl mb-4 shadow-[0_0_40px_-10px_rgba(255,255,255,0.05)]">
            <BriefcaseIcon className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-2xl font-semibold text-white tracking-tight">
            HR Assistant
          </h1>
          <p className="text-zinc-500 font-light mt-2">
            {isLogin ? 'Welcome back' : 'Create your workspace'}
          </p>
        </div>

        <div className="bg-[#0a0a0a] border border-white/[0.08] rounded-2xl shadow-[0_0_60px_-15px_rgba(255,255,255,0.03)] overflow-hidden">
          <div className="p-8">
            <h2 className="text-xl font-medium text-white text-center mb-6">
              {isLogin ? 'Sign In' : 'Sign Up'}
            </h2>
          
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Name field (only for registration) */}
              {!isLogin && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <label className="block text-sm font-medium text-zinc-400 mb-1.5">
                    Full Name
                  </label>
                  <div className="relative">
                    <UserIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-zinc-500" />
                    <Input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Enter your full name"
                      className="pl-10 bg-[#050505] border-white/[0.08] text-white focus:border-white/[0.2] focus:ring-1 focus:ring-white/[0.05] transition-colors"
                      required={!isLogin}
                    />
                  </div>
                </motion.div>
              )}

              
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <EnvelopeIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-zinc-500" />
                  <Input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Enter your email"
                    className="pl-10 bg-[#050505] border-white/[0.08] text-white focus:border-white/[0.2] focus:ring-1 focus:ring-white/[0.05] transition-colors"
                    required
                  />
                </div>
              </div>

              {/* Password field */}
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <LockClosedIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-zinc-500" />
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder={isLogin ? 'Enter your password' : 'Create a strong password'}
                    className="pl-10 pr-10 bg-[#050505] border-white/[0.08] text-white focus:border-white/[0.2] focus:ring-1 focus:ring-white/[0.05] transition-colors"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-zinc-500 hover:text-white transition-colors"
                  >
                    {showPassword ? (
                      <EyeSlashIcon className="h-5 w-5" />
                    ) : (
                      <EyeIcon className="h-5 w-5" />
                    )}
                  </button>
                </div>
                {!isLogin && (
                  <p className="text-xs text-zinc-600 mt-1.5 font-light">
                    Minimum 8 characters with caps, numbers, & symbols.
                  </p>
                )}
              </div>

              {/* Submit button */}
              <Button
                type="submit"
                className="w-full bg-white text-black hover:bg-zinc-200 transition-colors py-2.5 rounded-lg text-sm font-medium mt-2"
                loading={loading}
                disabled={loading}
              >
                {loading ? (isLogin ? 'Authenticating...' : 'Provisioning...') : (isLogin ? 'Sign In' : 'Create Account')}
              </Button>
            </form>

            {/* Toggle between login/register */}
            <div className="text-center pt-6 mt-6 border-t border-white/[0.05]">
              <p className="text-sm text-zinc-500 font-light">
                {isLogin ? "Don't have an account?" : 'Already have an account?'}
                <button
                  type="button"
                  onClick={toggleMode}
                  className="ml-2 text-white hover:text-zinc-300 font-medium transition-colors"
                >
                  {isLogin ? 'Request Access' : 'Sign in'}
                </button>
              </p>
            </div>
          </div>
        </div>

        {/* Back to landing */}
        <div className="text-center mt-6">
          <button
            onClick={() => navigate('/')}
            className="text-sm text-zinc-500 font-light cursor-pointer hover:text-white transition-colors flex items-center justify-center mx-auto gap-2"
          >
            ← Back to Home
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default Auth;
