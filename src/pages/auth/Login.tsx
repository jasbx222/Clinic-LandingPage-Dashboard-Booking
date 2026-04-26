import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import { motion } from 'framer-motion';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Stethoscope } from 'lucide-react';
import api from '../../lib/axios';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const setAuth = useAuthStore(state => state.setAuth);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await api.post('/login', { email, password });
      const user = response.data.user;
      const token = response.data.access_token;
      setAuth(token, user);

      if (user.role === 'admin') navigate('/admin/dashboard');
      else if (user.role === 'doctor') navigate('/doctor/dashboard');
      else if (user.role === 'receptionist') navigate('/reception/dashboard');
      else if (user.role === 'patient') navigate('/patient-portal');
      else navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.message || 'بيانات الدخول غير صحيحة');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 rounded-full blur-3xl -z-10 translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-lavender/50 rounded-full blur-3xl -z-10 -translate-x-1/2 translate-y-1/2" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="bg-white/80 backdrop-blur-xl p-8 rounded-[2rem] shadow-soft border border-white">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-lavender rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Stethoscope className="text-primary w-8 h-8" />
            </div>
            <h1 className="text-3xl font-extrabold text-text mb-2">تسجيل الدخول</h1>
            <p className="text-muted font-medium">أهلاً بك مجدداً في نظام ديفاميد</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-2xl text-sm font-bold border border-red-100 text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <Input
              type="email"
              placeholder="البريد الإلكتروني"
              label="البريد الإلكتروني"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              dir="ltr"
            />

            <Input
              type="password"
              placeholder="كلمة المرور"
              label="كلمة المرور"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              dir="ltr"
            />

            <Button
              type="submit"
              className="w-full rounded-2xl mt-4"
              size="lg"
              isLoading={loading}
            >
              دخول
            </Button>
          </form>

          <div className="mt-8 text-center text-sm font-medium text-muted">
            نظام الإدارة الشامل لعيادات ديفاميد
          </div>
        </div>
      </motion.div>
    </div>
  );
}
