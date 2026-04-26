import React, { useState } from 'react';
import { PageHeader } from '../../components/ui/PageHeader';
import { Table } from '../../components/ui/Table';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Plus, Check, X, CheckCircle, Clock, Eye, Search, Filter, Calendar as CalendarIcon, User, MapPin } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { appointmentService } from '../../services/apiServices';
import { LoadingSkeleton } from '../../components/ui/LoadingSkeleton';
import { ErrorState } from '../../components/ui/ErrorState';
import { toast } from 'react-hot-toast';
import { Modal } from '../../components/ui/Modal';
import { motion } from 'framer-motion';

export default function AppointmentsPage() {
  const queryClient = useQueryClient();
  const [selectedAppointment, setSelectedAppointment] = useState<any>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const { data: appointmentsResponse, isLoading, error, refetch } = useQuery({
    queryKey: ['appointments'],
    queryFn: () => appointmentService.getAll(),
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: number; status: string }) => 
      appointmentService.updateStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
      toast.success('تم تحديث حالة الموعد بنجاح');
      if (selectedAppointment) {
         setSelectedAppointment((prev: any) => ({ ...prev, status: prev.status })); // Update local state for modal
         refetch();
      }
    },
    onError: () => toast.error('حدث خطأ أثناء تحديث الحالة')
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending': return <Badge variant="warning" className="rounded-full px-4">قيد الانتظار</Badge>;
      case 'confirmed': return <Badge variant="secondary" className="bg-blue-50 text-blue-500 rounded-full px-4">مقبول</Badge>;
      case 'completed': return <Badge variant="success" className="rounded-full px-4">مكتمل</Badge>;
      case 'cancelled': return <Badge variant="danger" className="rounded-full px-4">ملغي</Badge>;
      case 'arrived': return <Badge variant="accent" className="rounded-full px-4">وصل للمركز</Badge>;
      default: return <Badge className="rounded-full px-4">{status}</Badge>;
    }
  };

  const appointments = appointmentsResponse?.data || [];

  const openDetails = (app: any) => {
    setSelectedAppointment(app);
    setIsDetailsOpen(true);
  };

  const columns = [
    { 
      header: 'المريضة', 
      accessor: (row: any) => (
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-primary-light/20 flex items-center justify-center text-primary font-black">
            {row.patient?.user?.name?.charAt(0) || 'P'}
          </div>
          <div className="flex flex-col">
            <span className="font-black text-text-primary text-sm">{row.patient?.user?.name || row.patient_name || '---'}</span>
            <span className="text-[10px] text-text-muted font-bold tracking-wider">{row.patient?.file_number || 'No File'}</span>
          </div>
        </div>
      )
    },
    { 
      header: 'الطبيبة', 
      accessor: (row: any) => (
        <div className="flex items-center gap-2">
          <User size={14} className="text-text-muted" />
          <span className="font-bold text-text-secondary text-xs">{row.doctor?.name || '---'}</span>
        </div>
      )
    },
    { header: 'الخدمة', accessor: (row: any) => <Badge variant="secondary" className="bg-bg-soft text-text-primary text-[10px] font-bold">{row.service?.name || 'كشف طبي'}</Badge> },
    { 
      header: 'الموعد', 
      accessor: (row: any) => (
        <div className="flex flex-col">
          <span className="font-black text-text-primary text-sm">{row.appointment_time}</span>
          <span className="text-[10px] text-text-muted font-bold uppercase">{row.appointment_date}</span>
        </div>
      )
    },
    { header: 'الحالة', accessor: (row: any) => getStatusBadge(row.status) },
    { 
      header: 'الإجراءات', 
      accessor: (row: any) => (
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="rounded-xl border-border/60"
            onClick={() => openDetails(row)}
          >
            <Eye size={16} className="text-text-muted" />
          </Button>
          {row.status === 'pending' && (
            <Button 
              variant="outline" 
              size="sm" 
              className="rounded-xl border-blue-100 text-blue-500 bg-blue-50/30"
              onClick={() => updateStatusMutation.mutate({ id: row.id, status: 'confirmed' })}
            >
              <Check size={16} />
            </Button>
          )}
        </div>
      ) 
    },
  ];

  if (isLoading) return <LoadingSkeleton />;
  if (error) return <ErrorState message="حدث خطأ أثناء تحميل المواعيد" onRetry={refetch} />;

  return (
    <div className="space-y-8">
      <PageHeader title="إدارة المواعيد" description="متابعة حجوزات المريضات وتحديث حالات الحضور والجداول الزمنية.">
        <div className="flex gap-4">
           <div className="relative group">
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-primary transition-colors" size={18} />
            <input 
              type="text" 
              placeholder="بحث باسم المريضة..." 
              className="bg-white border border-border/60 rounded-[1.25rem] pr-12 pl-6 py-3 text-sm focus:ring-4 focus:ring-primary/10 outline-none w-72 shadow-soft font-bold transition-all"
            />
          </div>
      
        </div>
      </PageHeader>

      <div className="premium-card overflow-hidden">
        <Table data={appointments} columns={columns} />
      </div>

      <Modal 
        isOpen={isDetailsOpen} 
        onClose={() => setIsDetailsOpen(false)} 
        title="تفاصيل الحجز"
        className="max-w-2xl"
      >
        {selectedAppointment && (
          <div className="space-y-8 py-4">
            <div className="flex items-center gap-6 bg-bg-soft p-6 rounded-[2.5rem] border border-border/40">
              <div className="w-20 h-20 gradient-pink-blue rounded-3xl flex items-center justify-center text-white text-3xl font-black shadow-hover">
                {selectedAppointment.patient?.user?.name?.charAt(0) || 'P'}
              </div>
              <div>
                <h3 className="text-2xl font-black text-text-primary tracking-tighter mb-1">{selectedAppointment.patient?.user?.name || selectedAppointment.patient_name}</h3>
                <div className="flex gap-3">
                   {getStatusBadge(selectedAppointment.status)}
                   <Badge variant="secondary" className="bg-white text-[10px] font-black border-border/40 uppercase tracking-wider">{selectedAppointment.service?.name || 'كشف طبي'}</Badge>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
               <div className="p-6 bg-white rounded-3xl border border-border/60 shadow-sm space-y-4">
                  <div className="flex items-center gap-3">
                     <div className="w-10 h-10 rounded-xl bg-primary-light/20 flex items-center justify-center text-primary"><CalendarIcon size={20} /></div>
                     <div>
                        <p className="text-[10px] font-black text-text-muted uppercase tracking-widest">تاريخ الموعد</p>
                        <p className="text-sm font-black text-text-primary">{selectedAppointment.appointment_date}</p>
                     </div>
                  </div>
                  <div className="flex items-center gap-3">
                     <div className="w-10 h-10 rounded-xl bg-accent-light/20 flex items-center justify-center text-accent"><Clock size={20} /></div>
                     <div>
                        <p className="text-[10px] font-black text-text-muted uppercase tracking-widest">وقت الحجز</p>
                        <p className="text-sm font-black text-text-primary">{selectedAppointment.appointment_time}</p>
                     </div>
                  </div>
               </div>

               <div className="p-6 bg-white rounded-3xl border border-border/60 shadow-sm space-y-4">
                  <div className="flex items-center gap-3">
                     <div className="w-10 h-10 rounded-xl bg-secondary-light/20 flex items-center justify-center text-secondary"><User size={20} /></div>
                     <div>
                        <p className="text-[10px] font-black text-text-muted uppercase tracking-widest">الطبيبة المختصة</p>
                        <p className="text-sm font-black text-text-primary">{selectedAppointment.doctor?.name || '---'}</p>
                     </div>
                  </div>
                  <div className="flex items-center gap-3">
                     <div className="w-10 h-10 rounded-xl bg-bg-soft flex items-center justify-center text-text-muted"><MapPin size={20} /></div>
                     <div>
                        <p className="text-[10px] font-black text-text-muted uppercase tracking-widest">الموقع</p>
                        <p className="text-sm font-black text-text-primary">الفرع الرئيسي - غرفة 304</p>
                     </div>
                  </div>
               </div>
            </div>

            <div className="p-6 bg-bg-soft rounded-3xl border border-border/40">
              <h4 className="text-xs font-black text-text-primary uppercase tracking-widest mb-3">سبب الزيارة / ملاحظات</h4>
              <p className="text-sm font-bold text-text-secondary leading-relaxed">{selectedAppointment.reason || 'لا توجد ملاحظات إضافية مسجلة لهذا الحجز.'}</p>
            </div>

            <div className="flex flex-wrap gap-4 pt-4 border-t border-border">
               {selectedAppointment.status === 'pending' && (
                 <Button className="flex-1 h-14 rounded-2xl shadow-soft" variant="gradient" onClick={() => updateStatusMutation.mutate({ id: selectedAppointment.id, status: 'confirmed' })}>
                   تأكيد الحجز
                 </Button>
               )}
               <Button 
                className="flex-1 h-14 rounded-2xl bg-accent text-white hover:bg-accent-dark" 
                onClick={() => updateStatusMutation.mutate({ id: selectedAppointment.id, status: 'completed' })}
               >
                 إكمال الموعد
               </Button>
               <Button 
                variant="outline" 
                className="flex-1 h-14 rounded-2xl border-red-100 text-red-500 hover:bg-red-50"
                onClick={() => updateStatusMutation.mutate({ id: selectedAppointment.id, status: 'cancelled' })}
               >
                 إلغاء الموعد
               </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
