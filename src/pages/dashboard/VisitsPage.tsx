import React, { useState } from 'react';
import { PageHeader } from '../../components/ui/PageHeader';
import { Table } from '../../components/ui/Table';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Eye, Search, Filter, ClipboardList, User, Calendar as CalendarIcon, ArrowUpRight, Stethoscope, Plus } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { visitService, appointmentService, patientService } from '../../services/apiServices';
import { LoadingSkeleton } from '../../components/ui/LoadingSkeleton';
import { ErrorState } from '../../components/ui/ErrorState';
import { Modal } from '../../components/ui/Modal';
import { Select } from '../../components/ui/Select';
import { Input } from '../../components/ui/Input';
import { useForm, useWatch } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';

export default function ConsultationsPage() {
  const queryClient = useQueryClient();
  const [selectedVisit, setSelectedVisit] = useState<any>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const { data: visitsResponse, isLoading, error, refetch } = useQuery({
    queryKey: ['visits'],
    queryFn: () => visitService.getAll(),
  });

  const { data: appointmentsResponse } = useQuery({
    queryKey: ['appointments-list'],
    queryFn: () => appointmentService.getAll(),
  });

  const { data: patientsResponse } = useQuery({
    queryKey: ['patients-list'],
    queryFn: () => patientService.getAll(),
  });

  const createVisitMutation = useMutation({
    mutationFn: (data: any) => visitService.startVisit({
      appointment_id: data.appointment_id ? Number(data.appointment_id) : undefined,
      patient_id: data.patient_id ? Number(data.patient_id) : undefined,
      chief_complaint: data.chief_complaint
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['visits'] });
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
      toast.success('تم إضافة وبدء الكشف بنجاح');
      setIsAddModalOpen(false);
      reset();
    },
    onError: () => toast.error('حدث خطأ أثناء إضافة الكشف')
  });

  const { register, handleSubmit, reset, control } = useForm();
  
  const selectedAppointmentId = useWatch({
    control,
    name: "appointment_id"
  });

  const visits = visitsResponse?.data || [];
  
  // Filter only appointments that can be converted to visits (pending, confirmed, arrived)
  const availableAppointments = appointmentsResponse?.data?.filter((a: any) => 
    !['completed', 'cancelled', 'in_consultation'].includes(a.status)
  ) || [];

  const openDetails = (visit: any) => {
    setSelectedVisit(visit);
    setIsDetailsOpen(true);
  };

  const columns = [
    { 
      header: 'المريضة', 
      accessor: (row: any) => (
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-accent-light/30 flex items-center justify-center text-accent font-black">
            {row.patient?.user?.name?.charAt(0) || 'P'}
          </div>
          <div className="flex flex-col">
            <span className="font-black text-text-primary text-sm">{row.patient?.user?.name || '---'}</span>
            <span className="text-[10px] text-text-muted font-bold tracking-wider">{row.patient?.file_number || 'No File'}</span>
          </div>
        </div>
      )
    },
    { 
      header: 'الطبيب المعالج', 
      accessor: (row: any) => (
        <div className="flex items-center gap-2">
           <div className="w-6 h-6 rounded-full bg-bg-soft flex items-center justify-center text-primary">
              <Stethoscope size={12} />
           </div>
           <span className="font-bold text-text-secondary text-xs">{row.doctor?.name || '---'}</span>
        </div>
      )
    },
    { 
      header: 'الشكوى الرئيسية', 
      accessor: (row: any) => (
        <span className="font-medium text-text-primary text-sm truncate max-w-[200px] inline-block">
          {row.chief_complaint || '---'}
        </span>
      )
    },
    { 
      header: 'تاريخ الزيارة', 
      accessor: (row: any) => (
        <div className="flex flex-col">
          <span className="font-bold text-text-primary text-sm">
            {new Date(row.created_at).toLocaleDateString('ar-SA')}
          </span>
          <span className="text-[10px] text-text-muted font-bold uppercase">{row.appointment?.appointment_time || '---'}</span>
        </div>
      )
    },
    { 
      header: 'الحالة', 
      accessor: (row: any) => (
        <Badge 
          className={`rounded-full px-4 py-1 text-[10px] font-black border-none ${
            row.status === 'completed' ? 'bg-accent-light text-accent' : 'bg-blue-50 text-blue-500'
          }`}
        >
          {row.status === 'completed' ? 'مكتملة' : 'قيد الإجراء'}
        </Badge>
      ) 
    },
    { 
      header: 'الإجراءات', 
      accessor: (row: any) => (
        <div className="flex justify-center gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="rounded-xl border-border/60 hover:border-primary/40 hover:bg-primary-light/10 group"
            onClick={() => openDetails(row)}
          >
            <Eye size={16} className="text-text-muted group-hover:text-primary transition-colors" />
          </Button>
        </div>
      ) 
    },
  ];

  if (isLoading) return <LoadingSkeleton />;
  if (error) return <ErrorState message="حدث خطأ أثناء تحميل سجلات الكشوفات" onRetry={refetch} />;

  return (
    <div className="space-y-8">
      <PageHeader title="كشوفات المرضى" description="السجل الطبي الكامل لجميع الزيارات والكشوفات السريرية.">
        <div className="flex gap-3">
          <div className="relative group">
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-primary transition-colors" size={18} />
            <input 
              type="text" 
              placeholder="بحث باسم المريضة أو رقم الملف..." 
              className="bg-white border border-border/60 rounded-[1.25rem] pr-12 pl-6 py-3 text-sm focus:ring-4 focus:ring-primary/10 outline-none w-80 shadow-soft font-bold transition-all"
            />
          </div>
          <Button variant="outline" className="rounded-[1.25rem] px-6 border-border/60 shadow-soft">
            <Filter size={18} className="ml-2" /> تصفية
          </Button>
          <Button variant="gradient" className="rounded-[1.25rem] px-8 shadow-soft" onClick={() => setIsAddModalOpen(true)}>
             <Plus className="ml-2 w-5 h-5" /> إضافة كشف طبي
          </Button>
        </div>
      </PageHeader>

      <div className="premium-card overflow-hidden">
        <Table data={visits} columns={columns} />
      </div>

      {/* Add Visit Modal */}
      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="إضافة كشف جديد" className="max-w-xl">
        <form onSubmit={handleSubmit((data) => createVisitMutation.mutate(data))} className="space-y-5 py-4">
          <Select 
            label="المريضة (مطلوب إذا لم يتم اختيار موعد)" 
            {...register('patient_id', { required: !selectedAppointmentId })}
            options={[{ value: '', label: 'اختر مريضة كشف مباشر' }, ...(patientsResponse?.data?.map((p: any) => ({ value: p.id.toString(), label: p.user?.name || p.name })) || [])]}
          />
          <Select 
            label="اختر الموعد المرتبط (اختياري)" 
            {...register('appointment_id')}
            options={[{ value: '', label: 'بدون موعد (كشف مباشر)' }, ...availableAppointments.map((a: any) => ({ 
              value: a.id.toString(), 
              label: `${a.patient?.user?.name || a.patient_name} - ${a.appointment_date} (${a.appointment_time})` 
            }))]}
          />
          <div className="space-y-2">
            <label className="text-xs font-black text-text-muted uppercase tracking-widest px-2">الشكوى الرئيسية</label>
            <textarea 
              className="w-full p-4 rounded-[1.25rem] bg-white border border-border/60 focus:ring-4 focus:ring-primary/10 outline-none transition-all font-medium text-text-primary shadow-soft hover:border-primary/40 min-h-[120px]"
              placeholder="اكتب الشكوى الرئيسية للمريض..."
              {...register('chief_complaint', { required: true })}
            />
          </div>
          
          <div className="flex gap-4 mt-8">
            <Button type="submit" className="flex-1 h-14 rounded-2xl shadow-soft" variant="gradient" isLoading={createVisitMutation.isPending}>
               بدء الكشف
            </Button>
            <Button type="button" variant="outline" className="h-14 rounded-2xl px-8" onClick={() => setIsAddModalOpen(false)}>إلغاء</Button>
          </div>
        </form>
      </Modal>

      <Modal 
        isOpen={isDetailsOpen} 
        onClose={() => setIsDetailsOpen(false)} 
        title="تفاصيل الكشف الطبي"
        className="max-w-4xl"
      >
        {selectedVisit && (
          <div className="space-y-10 py-6">
            <div className="flex justify-between items-start bg-bg-soft/50 p-8 rounded-[2.5rem] border border-border/40 relative overflow-hidden">
               <div className="absolute top-0 right-0 w-32 h-32 bg-primary-light/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
               <div className="flex gap-6 relative z-10">
                  <div className="w-16 h-16 gradient-soft rounded-2xl flex items-center justify-center text-primary text-2xl font-black shadow-sm">
                    {selectedVisit.patient?.user?.name?.charAt(0) || 'P'}
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-text-primary tracking-tighter mb-1">{selectedVisit.patient?.user?.name}</h3>
                    <div className="flex gap-3">
                       <span className="text-xs font-bold text-text-muted flex items-center gap-1"><User size={14} /> ملف رقم: {selectedVisit.patient?.file_number || '---'}</span>
                       <span className="text-xs font-bold text-text-muted flex items-center gap-1"><CalendarIcon size={14} /> {new Date(selectedVisit.created_at).toLocaleDateString('ar-SA')}</span>
                    </div>
                  </div>
               </div>
               <div className="text-left relative z-10">
                  <Badge variant="accent" className="rounded-full px-5 py-1.5 font-black text-[10px]">
                     {selectedVisit.status === 'completed' ? 'كشف مكتمل' : 'قيد الإجراء'}
                  </Badge>
                  <p className="text-[10px] font-black text-text-muted uppercase mt-3 tracking-widest">بواسطة: {selectedVisit.doctor?.name}</p>
               </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <div className="space-y-6">
                  <div className="bg-white p-6 rounded-3xl border border-border/60 shadow-sm group hover:border-primary/30 transition-all">
                    <h4 className="text-[10px] font-black text-text-muted uppercase tracking-widest mb-3 flex items-center gap-2">
                       <div className="w-2 h-2 rounded-full bg-primary" /> الشكوى الرئيسية
                    </h4>
                    <p className="text-sm font-bold text-text-primary leading-relaxed">{selectedVisit.chief_complaint || '---'}</p>
                  </div>

                  <div className="bg-white p-6 rounded-3xl border border-border/60 shadow-sm group hover:border-primary/30 transition-all">
                    <h4 className="text-[10px] font-black text-text-muted uppercase tracking-widest mb-3 flex items-center gap-2">
                       <div className="w-2 h-2 rounded-full bg-accent" /> الفحص السريري
                    </h4>
                    <p className="text-sm font-bold text-text-primary leading-relaxed">{selectedVisit.examination || 'لم يتم تسجيل ملاحظات فحص.'}</p>
                  </div>
               </div>

               <div className="space-y-6">
                  <div className="bg-white p-6 rounded-3xl border border-border/60 shadow-sm group hover:border-primary/30 transition-all">
                    <h4 className="text-[10px] font-black text-text-muted uppercase tracking-widest mb-3 flex items-center gap-2">
                       <div className="w-2 h-2 rounded-full bg-secondary" /> التشخيص الطبي
                    </h4>
                    <p className="text-sm font-black text-text-primary leading-relaxed">{selectedVisit.diagnosis || 'قيد المراجعة...'}</p>
                  </div>

                  <div className="bg-white p-6 rounded-[2rem] border border-primary/20 shadow-soft bg-primary/5">
                    <h4 className="text-[10px] font-black text-primary uppercase tracking-widest mb-3 flex items-center gap-2">
                       <ClipboardList size={14} /> خطة العلاج والتوصيات
                    </h4>
                    <p className="text-sm font-black text-primary-dark leading-relaxed">{selectedVisit.treatment_plan || 'لا توجد خطة مسجلة.'}</p>
                  </div>
               </div>
            </div>

            <div className="flex gap-4 pt-4">
               <Button className="flex-1 h-14 rounded-2xl shadow-soft" variant="gradient">
                  <ArrowUpRight size={20} className="ml-2" /> تصدير السجل الطبي
               </Button>
               <Button variant="outline" className="flex-1 h-14 rounded-2xl border-border/60" onClick={() => setIsDetailsOpen(false)}>
                  إغلاق النافذة
               </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
