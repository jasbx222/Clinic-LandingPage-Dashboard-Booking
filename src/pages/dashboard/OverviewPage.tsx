import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Users, Calendar, DollarSign, Activity, ArrowRight, TrendingUp } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import { useQuery } from '@tanstack/react-query';
import { dashboardService, appointmentService } from '../../services/apiServices';
import { LoadingSkeleton } from '../../components/ui/LoadingSkeleton';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const stagger = {
  visible: { transition: { staggerChildren: 0.1 } }
};

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

export default function OverviewPage() {
  const { user } = useAuthStore();
  const navigate = useNavigate();

  const { data: statsData, isLoading: isLoadingStats } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: () => dashboardService.getStats(),
  });

  const { data: recentAppointments, isLoading: isLoadingRecent } = useQuery({
    queryKey: ['recent-appointments'],
    queryFn: () => appointmentService.getAll({ limit: 5 }),
  });

  const stats = [
    { title: 'إجمالي المرضى', value: statsData?.total_patients || '0', icon: <Users size={24}/>, trend: statsData?.patients_growth || '+12%', color: 'from-primary/20 to-primary/5', iconColor: 'text-primary' },
    { title: 'مواعيد اليوم', value: statsData?.today_appointments || '0', icon: <Calendar size={24}/>, trend: statsData?.appointments_trend || '+5', color: 'from-accent/20 to-accent/5', iconColor: 'text-accent' },
    { title: 'الإيرادات اليومية', value: statsData?.daily_revenue || '0', icon: <DollarSign size={24}/>, trend: statsData?.revenue_growth || '+8%', color: 'from-secondary/20 to-secondary/5', iconColor: 'text-secondary' },
    { title: 'معدل الحضور', value: statsData?.attendance_rate || '0%', icon: <Activity size={24}/>, trend: '+2%', color: 'from-blue-400/20 to-blue-400/5', iconColor: 'text-blue-500' },
  ];

  if (isLoadingStats || isLoadingRecent) return <LoadingSkeleton />;

  return (
    <div className="space-y-10">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div>
          <h1 className="text-4xl font-black text-text-primary tracking-tighter">مرحباً {user?.name?.split(' ')[0]} 👋</h1>
          <p className="text-text-secondary mt-2 font-medium">إليكِ نظرة شاملة على أداء عيادتكِ اليوم.</p>
        </div>
        <div className="flex gap-3">
           <Button variant="outline" className="rounded-2xl" onClick={() => navigate('/admin/appointment-board')}>لوحة الحجوزات</Button>
           <Button variant="gradient" className="rounded-2xl shadow-soft" onClick={() => navigate('/admin/appointments')}>إدارة المواعيد</Button>
        </div>
      </div>

      <motion.div 
        initial="hidden" 
        animate="visible" 
        variants={stagger}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {stats.map((stat, i) => (
          <motion.div key={i} variants={fadeInUp}>
            <Card className="premium-card p-0 overflow-hidden group">
              <div className={`h-2 bg-gradient-to-r ${stat.color.replace('/20', '').replace('/5', '')}`} />
              <CardContent className="p-8">
                <div className="flex justify-between items-start mb-6">
                  <div className={`p-4 bg-gradient-to-br ${stat.color} rounded-2xl ${stat.iconColor} group-hover:scale-110 transition-transform duration-500`}>
                    {stat.icon}
                  </div>
                  <Badge className="bg-bg-soft text-text-primary border-none font-bold text-[10px] px-3 py-1 flex items-center gap-1">
                    <TrendingUp size={12} className="text-accent" /> {stat.trend}
                  </Badge>
                </div>
                <div>
                  <p className="text-text-muted text-[11px] font-black mb-1 uppercase tracking-widest">{stat.title}</p>
                  <h3 className="text-4xl font-black text-text-primary tracking-tighter">{stat.value}</h3>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <motion.div variants={fadeInUp} initial="hidden" animate="visible" className="col-span-1 lg:col-span-2">
          <Card className="premium-card p-0 overflow-hidden h-full">
            <CardHeader className="p-8 border-b border-border flex flex-row items-center justify-between bg-bg-soft/30">
              <div>
                <CardTitle className="text-2xl font-black text-text-primary tracking-tight">أحدث المواعيد</CardTitle>
                <p className="text-xs text-text-muted font-bold mt-1">آخر 5 مواعيد مسجلة في النظام</p>
              </div>
              <Button variant="ghost" size="sm" className="font-black text-xs" onClick={() => navigate('/admin/appointments')}>
                عرض الكل <ArrowRight size={16} className="mr-2" />
              </Button>
            </CardHeader>
            <CardContent className="p-8">
              <div className="space-y-4">
                {recentAppointments?.data?.length > 0 ? (
                  recentAppointments.data.slice(0, 5).map((app: any) => (
                    <div key={app.id} className="flex items-center justify-between p-5 bg-white rounded-[2rem] border border-border hover:border-primary/30 hover:shadow-soft transition-all group">
                      <div className="flex items-center gap-5">
                        <div className="w-14 h-14 gradient-soft rounded-2xl flex items-center justify-center text-primary font-black text-xl shadow-sm group-hover:gradient-pink-blue group-hover:text-white transition-all">
                          {app.patient?.user?.name?.charAt(0) || 'P'}
                        </div>
                        <div>
                          <h4 className="font-black text-text-primary text-base mb-0.5">{app.patient?.user?.name || app.patient_name}</h4>
                          <div className="flex items-center gap-2">
                             <Badge variant="secondary" className="bg-bg-soft text-[10px] font-bold py-0">{app.service?.name || 'كشف طبي'}</Badge>
                             <span className="text-[10px] text-text-muted font-bold">{app.appointment_time}</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-left flex flex-col items-end gap-2">
                        <Badge 
                          className={`rounded-full px-4 py-1 text-[10px] font-black border-none ${
                            app.status === 'completed' ? 'bg-accent-light text-accent' : 
                            app.status === 'cancelled' ? 'bg-red-50 text-red-500' : 
                            app.status === 'confirmed' ? 'bg-blue-50 text-blue-500' : 
                            'bg-amber-50 text-amber-600'
                          }`}
                        >
                          {app.status === 'confirmed' ? 'مقبول' : app.status === 'completed' ? 'مكتمل' : app.status === 'cancelled' ? 'ملغي' : 'قيد الانتظار'}
                        </Badge>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-20 bg-bg-soft rounded-3xl border-2 border-dashed border-border text-text-muted font-bold">
                    لا توجد مواعيد مؤخرًا
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
        
        <motion.div variants={fadeInUp} initial="hidden" animate="visible" className="col-span-1">
          <Card className="premium-card p-0 overflow-hidden h-full">
            <CardHeader className="p-8 border-b border-border bg-bg-soft/30">
              <CardTitle className="text-2xl font-black text-text-primary tracking-tight">أداء الأقسام</CardTitle>
              <p className="text-xs text-text-muted font-bold mt-1">معدل تحقيق المستهدفات الشهرية</p>
            </CardHeader>
            <CardContent className="p-8">
               <div className="space-y-8">
                  {[
                    { label: 'تحقيق المستهدف', val: 85, color: 'bg-primary' },
                    { label: 'رضا المريضات', val: 92, color: 'bg-accent' },
                    { label: 'ساعات العمل', val: 78, color: 'bg-secondary' },
                    { label: 'المواعيد المؤكدة', val: 64, color: 'bg-blue-400' },
                  ].map((item, i) => (
                    <div key={i} className="space-y-3">
                      <div className="flex justify-between items-end">
                        <span className="text-sm font-black text-text-primary">{item.label}</span>
                        <span className={`text-lg font-black ${item.color.replace('bg-', 'text-')}`}>{item.val}%</span>
                      </div>
                      <div className="w-full bg-bg-soft rounded-full h-3 p-[2px] border border-border">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${item.val}%` }}
                          transition={{ duration: 1, delay: 0.5 + i*0.1 }}
                          className={`${item.color} h-full rounded-full shadow-sm`}
                        />
                      </div>
                    </div>
                  ))}
               </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}