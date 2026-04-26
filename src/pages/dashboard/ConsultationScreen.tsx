import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { appointmentService, visitService } from '../../services/apiServices';
import { LoadingSkeleton } from '../../components/ui/LoadingSkeleton';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Stethoscope, Pill, ClipboardList, Save, CheckCircle, Heart, AlertCircle, Clock, Calendar as CalendarIcon, User } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';

export default function ConsultationScreen() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [complaint, setComplaint] = useState('');
  const [history, setHistory] = useState('');
  const [examination, setExamination] = useState('');
  const [diagnosis, setDiagnosis] = useState('');
  const [treatmentPlan, setTreatmentPlan] = useState('');

  const { data: appointment, isLoading } = useQuery({
    queryKey: ['appointment', id],
    queryFn: () => appointmentService.getById(Number(id)),
    enabled: !!id,
  });

  const startVisitMutation = useMutation({
    mutationFn: () => visitService.startVisit({
      appointment_id: Number(id),
      chief_complaint: complaint,
    }),
    onSuccess: () => toast.success('تم بدء الجلسة بنجاح'),
  });

  const endVisitMutation = useMutation({
    mutationFn: (visitId: number) => visitService.endVisit(visitId),
    onSuccess: () => {
      toast.success('تم إنهاء الزيارة وحفظ السجل الطبي');
      navigate('/admin/appointments');
    }
  });

  if (isLoading) return <LoadingSkeleton />;
  if (!appointment) return <div className="p-20 text-center font-black text-text-muted">الموعد غير موجود أو تم حذفه</div>;

  return (
    <div className="max-w-6xl mx-auto space-y-10 pb-20">
      {/* Patient Profile Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row justify-between items-center bg-white p-8 rounded-[3rem] shadow-soft border border-border/40 relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary-light/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
        
        <div className="flex items-center gap-6 relative z-10">
          <div className="w-24 h-24 gradient-pink-blue rounded-[2rem] flex items-center justify-center text-white text-4xl font-black shadow-hover">
            {appointment.patient?.user?.name?.charAt(0) || 'P'}
          </div>
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-black text-text-primary tracking-tighter">{appointment.patient?.user?.name}</h1>
              <Badge variant="accent" className="rounded-full">حالة نشطة</Badge>
            </div>
            <div className="flex flex-wrap gap-3">
              <Badge variant="secondary" className="bg-bg-soft text-text-primary border-none flex items-center gap-2">
                <User size={12} className="text-primary" /> عمر: 28 سنة
              </Badge>
              <Badge variant="secondary" className="bg-bg-soft text-text-primary border-none flex items-center gap-2">
                <Heart size={12} className="text-red-400" /> فصيلة الدم: O+
              </Badge>
              <Badge variant="secondary" className="bg-bg-soft text-text-primary border-none flex items-center gap-2">
                <CalendarIcon size={12} className="text-accent" /> رقم الملف: {appointment.patient?.file_number || '---'}
              </Badge>
            </div>
          </div>
        </div>

        <div className="mt-6 md:mt-0 text-center md:text-left bg-bg-soft/50 p-6 rounded-[2rem] border border-border/40 relative z-10">
          <p className="text-text-muted text-[10px] font-black uppercase tracking-widest mb-1">موعد الكشف الحالي</p>
          <div className="flex items-center gap-3 text-primary font-black text-2xl tracking-tighter">
             <Clock size={24} /> {appointment.appointment_time}
          </div>
          <p className="text-text-secondary text-xs font-bold mt-1">{appointment.service?.name || 'كشف طبي نسائي'}</p>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main Records Section */}
        <div className="lg:col-span-8 space-y-8">
          <Card className="premium-card p-0 overflow-hidden">
            <CardHeader className="p-8 border-b border-border bg-bg-soft/30">
              <CardTitle className="flex items-center gap-3 text-2xl font-black tracking-tight">
                <div className="w-10 h-10 rounded-xl bg-primary-light/30 flex items-center justify-center text-primary shadow-sm">
                  <ClipboardList size={22} />
                </div>
                السجل السريري (Clinical Record)
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8 space-y-8">
              <div className="space-y-3">
                <label className="text-xs font-black text-text-muted uppercase tracking-widest px-2 flex items-center gap-2">
                   <AlertCircle size={14} className="text-primary" /> الشكوى الرئيسية (Chief Complaint)
                </label>
                <textarea 
                  className="w-full p-6 rounded-[2rem] bg-bg-soft border border-border/40 focus:ring-4 focus:ring-primary/5 focus:bg-white focus:border-primary/40 min-h-[120px] outline-none transition-all font-medium text-text-primary placeholder:text-text-muted/50"
                  placeholder="ما هي الأعراض التي تعاني منها المريضة حالياً؟"
                  value={complaint}
                  onChange={(e) => setComplaint(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 <div className="space-y-3">
                  <label className="text-xs font-black text-text-muted uppercase tracking-widest px-2">الفحص السريري (Examination)</label>
                  <textarea 
                    className="w-full p-6 rounded-[2rem] bg-bg-soft border border-border/40 focus:ring-4 focus:ring-primary/5 focus:bg-white focus:border-primary/40 min-h-[150px] outline-none transition-all font-medium text-text-primary"
                    placeholder="نتائج الفحص البدني..."
                    value={examination}
                    onChange={(e) => setExamination(e.target.value)}
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-xs font-black text-text-muted uppercase tracking-widest px-2">التشخيص الطبي (Diagnosis)</label>
                  <textarea 
                    className="w-full p-6 rounded-[2rem] bg-bg-soft border border-border/40 focus:ring-4 focus:ring-primary/5 focus:bg-white focus:border-primary/40 min-h-[150px] outline-none transition-all font-medium text-text-primary"
                    placeholder="التشخيص النهائي للحالة..."
                    value={diagnosis}
                    onChange={(e) => setDiagnosis(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-xs font-black text-text-muted uppercase tracking-widest px-2">خطة العلاج والتوصيات (Treatment Plan)</label>
                <textarea 
                  className="w-full p-6 rounded-[2rem] bg-bg-soft border border-border/40 focus:ring-4 focus:ring-primary/5 focus:bg-white focus:border-primary/40 min-h-[120px] outline-none transition-all font-medium text-text-primary"
                  placeholder="الأدوية المقترحة، التحاليل المطلوبة، أو موعد المراجعة القادم..."
                  value={treatmentPlan}
                  onChange={(e) => setTreatmentPlan(e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-4">
            <Button 
              className="flex-1 rounded-[2rem] h-16 text-lg font-black shadow-soft hover:shadow-hover transition-all" 
              variant="outline"
              onClick={() => startVisitMutation.mutate()}
              isLoading={startVisitMutation.isPending}
            >
              <Save className="ml-3" size={22} /> حفظ المسودة المؤقتة
            </Button>
            <Button 
              variant="gradient" 
              className="flex-1 rounded-[2rem] h-16 text-lg font-black shadow-soft hover:shadow-hover transition-all"
              onClick={() => endVisitMutation.mutate(0)}
              isLoading={endVisitMutation.isPending}
            >
              <CheckCircle className="ml-3" size={22} /> اعتماد وإنهاء الجلسة
            </Button>
          </div>
        </div>

        {/* Sidebar Info Section */}
        <div className="lg:col-span-4 space-y-8">
          <Card className="premium-card p-0 overflow-hidden">
            <CardHeader className="p-8 border-b border-border bg-bg-soft/30">
              <CardTitle className="flex items-center gap-3 text-xl font-black">
                <div className="w-10 h-10 rounded-xl bg-accent-light/30 flex items-center justify-center text-accent">
                  <Pill size={22} />
                </div>
                الوصفة الطبية
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <div className="text-center py-12 px-6 bg-bg-soft rounded-[2rem] border-2 border-dashed border-border/60">
                <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center text-text-muted mx-auto mb-4 shadow-sm">
                   <Pill size={28} />
                </div>
                <p className="text-text-muted font-bold text-sm mb-6">لم يتم إضافة أدوية في هذه الجلسة بعد</p>
                <Button variant="outline" className="rounded-xl font-black text-xs px-6">إضافة دواء جديد</Button>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-[2.5rem] bg-gradient-to-br from-red-500 to-red-600 text-white shadow-lg shadow-red-200 border-none relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full blur-2xl -translate-x-1/2 -translate-y-1/2 group-hover:scale-150 transition-transform duration-700"></div>
            <CardContent className="p-8 relative z-10">
              <div className="flex items-center gap-3 mb-4">
                <AlertCircle size={28} className="text-white fill-red-400" />
                <h3 className="font-black text-xl tracking-tight">تنبيهات الحساسية</h3>
              </div>
              <p className="text-white/90 text-sm font-bold leading-relaxed">
                المريضة تعاني من حساسية مفرطة تجاه <span className="underline decoration-2 underline-offset-4">عائلة البنسلين</span> وبعض المركبات الكيميائية المشابهة. يرجى توخي الحذر عند وصف المضادات الحيوية.
              </p>
            </CardContent>
          </Card>

          <Card className="premium-card p-8 bg-accent/5 border-accent/20">
            <h3 className="font-black text-lg text-accent-dark mb-4 flex items-center gap-2">
              <Stethoscope size={20} /> المراجعة السابقة
            </h3>
            <div className="space-y-4">
               <div className="p-4 bg-white rounded-2xl shadow-sm border border-accent/10">
                  <p className="text-[10px] font-black text-text-muted mb-1">15 أكتوبر 2025 - د. سارة أحمد</p>
                  <p className="text-xs font-bold text-text-primary">متابعة ما بعد العملية، الحالة مستقرة والتحسن ملحوظ.</p>
               </div>
               <Button variant="ghost" className="w-full text-accent font-black text-xs">عرض السجل الطبي الكامل</Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}