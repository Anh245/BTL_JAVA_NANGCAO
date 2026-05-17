import { useState } from 'react';
import { motion } from 'framer-motion';
import { authApi } from '@/api/apiClient';
import { Mail, Lock, LogIn } from 'lucide-react';

export default function LoginForm({ onSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const data = await authApi.login(email, password);
      if (onSuccess) onSuccess(data);
    } catch (err) {
      setError('Email hoặc mật khẩu không đúng');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-obsidian flex items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        {/* Brand */}
        <div className="text-center mb-12">
          <h1 className="font-playfair text-3xl text-bone tracking-wider mb-2">AURELIAN</h1>
          <div className="hairline-gold w-16 mx-auto mb-4" />
          <p className="font-inter text-xs tracking-[0.4em] uppercase text-gold">Admin Console</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="border border-gold/20 bg-[#0d0d0d] p-8 space-y-6">
          <div className="text-center mb-6">
            <h2 className="font-playfair text-2xl text-bone">Đăng Nhập</h2>
            <p className="font-playfair italic text-champagne/70 text-sm mt-2">
              Chỉ dành cho quản trị viên
            </p>
          </div>

          {error && (
            <div className="border border-red-900/50 bg-red-950/30 px-4 py-3 text-red-400 font-inter text-sm text-center">
              {error}
            </div>
          )}

          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-champagne/40" />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              className="w-full bg-transparent border-b border-gold/30 text-bone font-inter text-sm py-3 pl-10 outline-none focus:border-gold transition-colors placeholder-champagne/30"
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-champagne/40" />
            <input
              type="password"
              placeholder="Mật khẩu"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              className="w-full bg-transparent border-b border-gold/30 text-bone font-inter text-sm py-3 pl-10 outline-none focus:border-gold transition-colors placeholder-champagne/30"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="shimmer-btn w-full font-inter text-xs tracking-[0.25em] uppercase py-4 bg-gold text-obsidian font-semibold hover:bg-brass transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <LogIn className="w-4 h-4" />
            {loading ? 'Đang đăng nhập...' : 'Đăng Nhập'}
          </button>
        </form>

        <p className="text-center mt-6 font-inter text-[10px] tracking-[0.2em] uppercase text-champagne/30">
          Secured Access · Aurelian Fine Dining
        </p>
      </motion.div>
    </div>
  );
}
