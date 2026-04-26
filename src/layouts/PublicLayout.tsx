import React from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../components/ui/Button';

export default function PublicLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="flex flex-col min-h-screen bg-bg relative">
      <header className="fixed top-0 left-0 right-0 z-50 glass-panel border-b-0 h-[90px]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
          <div className="flex items-center justify-between h-full">
            <motion.div
              initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}
              className="flex items-center cursor-pointer"
              onClick={() => navigate('/')}
            >
              <Heart className="text-primary w-8 h-8 mr-3 ml-3" fill="currentColor" />
              <h1 className="text-3xl font-extrabold text-text tracking-tight">
                ديفاميد<span className="text-primary">.</span>
              </h1>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}
              className="flex items-center gap-8"
            >
              <nav className="hidden md:flex gap-6">
                <button onClick={() => navigate('/doctors')} className="text-text hover:text-primary font-semibold transition-colors">الأطباء</button>
                <button onClick={() => navigate('/services')} className="text-text hover:text-primary font-semibold transition-colors">الخدمات</button>
              </nav>

              <div className="flex items-center gap-4">
                {/* <button 
                  onClick={() => navigate('/login')} 
                  className="hidden sm:inline-flex text-text hover:text-primary font-bold transition-colors"
                >
                  دخول
                </button> */}
                <Button
                  onClick={() => navigate('/book-appointment')}
                  className="px-6 rounded-full"
                >
                  احجزي موعدك
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </header>

      <main className="flex-grow pt-[90px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="h-full"
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
