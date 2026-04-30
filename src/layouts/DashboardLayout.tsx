import React from 'react';
import { Outlet, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import {
  LayoutDashboard, Users, Calendar, FileText, LogOut, Menu, Pill,
  ShieldCheck, Stethoscope, Kanban, Settings, Bell, Search, ChevronRight, Monitor
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function DashboardLayout() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = React.useState(false);

  if (!user) return <Navigate to="/login" replace />;

  const adminLinks = [
    { text: 'الرئيسية', icon: <LayoutDashboard size={22} />, path: '/admin/dashboard' },
    { text: 'المواعيد (الحجز)', icon: <Calendar size={22} />, path: '/admin/appointments' },
  
    { text: 'طابور الانتظار', icon: <Monitor size={22} />, path: '/admin/queue' },
    { text: 'المرضى (الملفات)', icon: <Users size={22} />, path: '/admin/patients' },
    { text: 'الكشوفات الطبية', icon: <Stethoscope size={22} />, path: '/admin/visits' },
    { text: 'الفواتير والمدفوعات', icon: <FileText size={22} />, path: '/admin/invoices' },
    { text: 'إدارة الموظفين', icon: <ShieldCheck size={22} />, path: '/admin/staff' },
  ];

  const doctorLinks = [
    { text: 'الرئيسية', icon: <LayoutDashboard size={22} />, path: '/doctor/dashboard' },
    { text: 'المواعيد', icon: <Calendar size={22} />, path: '/doctor/appointments' },
    
    { text: 'طابور الانتظار', icon: <Monitor size={22} />, path: '/doctor/queue' },
    { text: 'الكشوفات الطبية', icon: <Stethoscope size={22} />, path: '/doctor/consultations' },
    { text: 'الوصفات الطبية', icon: <Pill size={22} />, path: '/doctor/prescriptions' },
  ];

  const receptionLinks = [
    { text: 'الرئيسية', icon: <LayoutDashboard size={22} />, path: '/reception/dashboard' },
    { text: 'المواعيد (الحجز)', icon: <Calendar size={22} />, path: '/reception/appointments' },
   
    { text: 'المرضى (الملفات)', icon: <Users size={22} />, path: '/reception/patients' },
    { text: 'الفواتير والمدفوعات', icon: <FileText size={22} />, path: '/reception/invoices' },
  ];

  let links = adminLinks;
  if (user.role === 'doctor') links = doctorLinks;
  else if (user.role === 'receptionist') links = receptionLinks;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const SidebarContent = () => (
    <div className="h-full flex flex-col w-72 bg-white border-l border-border shadow-soft shrink-0 relative z-20">
      <div className="p-8 flex items-center gap-3 mb-4">
        <div className="w-12 h-12 rounded-2xl gradient-pink-blue flex items-center justify-center text-white shadow-soft">
          <Stethoscope size={28} />
        </div>
        <div>
          <h1 className="text-2xl font-black text-text-primary tracking-tighter">ديفاميد<span className="text-primary">.</span></h1>
          <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest -mt-1">Medical SaaS</p>
        </div>
      </div>

      <div className="flex-grow overflow-y-auto px-4 space-y-1.5 custom-scrollbar">
        <div className="mb-6 px-4 py-5 bg-bg-soft rounded-[2rem] border border-primary/5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-primary shadow-soft font-bold text-xl">
            {user.name?.[0]}
          </div>
          <div className="overflow-hidden">
            <p className="text-sm font-black text-text-primary truncate">{user.name}</p>
            <p className="text-[10px] font-extrabold text-primary-dark uppercase tracking-wider">{user.role}</p>
          </div>
        </div>

        <p className="px-4 text-[11px] font-black text-text-muted uppercase tracking-[0.2em] mb-4">القائمة الرئيسية</p>

        {links.map((link) => {
          const active = location.pathname.startsWith(link.path);
          return (
            <button
              key={link.path}
              onClick={() => { navigate(link.path); setMobileOpen(false); }}
              className={`w-full flex items-center justify-between px-4 py-3.5 rounded-2xl transition-all duration-300 font-bold group ${active
                  ? 'bg-primary text-white shadow-soft scale-[1.02]'
                  : 'text-text-secondary hover:bg-bg-soft hover:text-primary'
                }`}
            >
              <div className="flex items-center gap-4">
                <span className={`${active ? 'text-white' : 'text-text-muted group-hover:text-primary'} transition-colors`}>
                  {link.icon}
                </span>
                <span className="text-sm">{link.text}</span>
              </div>
              {active && <ChevronRight size={16} className="opacity-70" />}
            </button>
          );
        })}
      </div>

      <div className="p-6 border-t border-border mt-auto">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-4 px-4 py-4 rounded-2xl text-red-500 font-black text-sm hover:bg-red-50 transition-all group"
        >
          <LogOut size={22} className="group-hover:translate-x-1 transition-transform" /> تسجيل الخروج
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-bg-main overflow-hidden font-sans">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <SidebarContent />
      </div>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-30 lg:hidden backdrop-blur-sm"
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed inset-y-0 right-0 z-40 lg:hidden"
            >
              <SidebarContent />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <div className="flex-1 flex flex-col h-full overflow-hidden relative">
        {/* Top Header */}
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-border flex items-center justify-between px-6 lg:px-10 shrink-0 z-20">
          <div className="flex lg:hidden items-center gap-3">
            <div className="w-10 h-10 rounded-xl gradient-pink-blue flex items-center justify-center text-white">
              <Stethoscope size={22} />
            </div>
            <h2 className="text-xl font-black text-text-primary tracking-tighter">ديفاميد<span className="text-primary">.</span></h2>
          </div>

          <div className="hidden lg:flex items-center bg-bg-soft rounded-2xl px-4 py-2.5 w-96 border border-border group focus-within:border-primary/50 transition-all">
            <Search size={18} className="text-text-muted group-focus-within:text-primary transition-colors" />
            <input
              type="text"
              placeholder="ابحث عن مريضة، موعد، أو فاتورة..."
              className="bg-transparent border-none focus:ring-0 text-sm font-bold w-full px-3 text-text-primary placeholder:text-text-muted"
            />
          </div>

          <div className="flex items-center gap-3 sm:gap-6">
            <button className="relative w-12 h-12 rounded-2xl bg-bg-soft flex items-center justify-center text-text-secondary hover:text-primary transition-all border border-transparent hover:border-primary/20 group">
              <Bell size={22} />
              <span className="absolute top-3 right-3 w-2.5 h-2.5 bg-primary border-2 border-white rounded-full"></span>
            </button>

            <button className="w-12 h-12 rounded-2xl bg-bg-soft flex items-center justify-center text-text-secondary hover:text-primary lg:hidden" onClick={() => setMobileOpen(true)}>
              <Menu size={24} />
            </button>

            <div className="hidden sm:flex items-center gap-4 pl-4 border-r border-border">
              <div className="text-left">
                <p className="text-[11px] font-black text-text-muted uppercase tracking-wider mb-0.5">مرحباً بك</p>
                <p className="text-sm font-black text-text-primary">{user.name?.split(' ')[0]}</p>
              </div>
              <div className="w-12 h-12 rounded-2xl gradient-pink-blue shadow-soft p-[2px]">
                <div className="w-full h-full rounded-[14px] bg-white flex items-center justify-center font-black text-primary">
                  {user.name?.[0]}
                </div>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-bg-main p-6 sm:p-10 lg:p-12 scroll-smooth">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Outlet />
          </motion.div>
        </main>
      </div>
    </div>
  );
}
