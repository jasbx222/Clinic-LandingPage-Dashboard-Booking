import React, { useState, useMemo } from 'react';
import { 
  DndContext, 
  DragOverlay, 
  closestCorners, 
  KeyboardSensor, 
  PointerSensor, 
  useSensor, 
  useSensors
} from '@dnd-kit/core';
import type {
  DragStartEvent,
  DragEndEvent,
} from '@dnd-kit/core';
import { 
  SortableContext, 
  sortableKeyboardCoordinates, 
  verticalListSortingStrategy 
} from '@dnd-kit/sortable';
import { PageHeader } from '../../components/ui/PageHeader';
import { Button } from '../../components/ui/Button';
import { Plus, Search, User, Clock, MoreHorizontal, Calendar as CalendarIcon } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { appointmentService, patientService, employeeService } from '../../services/apiServices';
import { LoadingSkeleton } from '../../components/ui/LoadingSkeleton';
import { ErrorState } from '../../components/ui/ErrorState';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { motion } from 'framer-motion';

// --- Components for the Board ---

const SortableAppointmentCard = ({ appointment, isOverlay = false }: { appointment: any; isOverlay?: boolean }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({
    id: appointment.id,
    data: {
      type: 'Appointment',
      appointment,
    },
  });

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
    opacity: isDragging && !isOverlay ? 0.3 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`bg-white p-5 rounded-[1.5rem] shadow-soft border border-border/60 transition-all cursor-grab active:cursor-grabbing group hover:border-primary/40 hover:shadow-hover ${isOverlay ? 'shadow-xl border-primary ring-4 ring-primary/10 rotate-2' : ''}`}
    >
      <div className="flex justify-between items-start mb-4">
        <Badge variant="secondary" className="text-[10px] px-2 py-0">
          #{appointment.id}
        </Badge>
        <button className="text-text-muted hover:text-primary transition-colors p-1">
          <MoreHorizontal size={14} />
        </button>
      </div>
      
      <h4 className="font-black text-text-primary mb-1 text-sm tracking-tight">{appointment.patient?.user?.name || appointment.patient_name}</h4>
      <p className="text-[11px] text-text-muted font-bold mb-4">{appointment.service?.name || 'كشف طبي عام'}</p>
      
      <div className="flex flex-col gap-2 pt-4 border-t border-bg-soft">
        <div className="flex items-center gap-2 text-[10px] text-text-secondary font-black">
          <div className="w-5 h-5 rounded-lg bg-primary-light/30 flex items-center justify-center text-primary">
            <User size={10} />
          </div>
          <span>{appointment.doctor?.name || '---'}</span>
        </div>
        <div className="flex items-center justify-between">
           <div className="flex items-center gap-2 text-[10px] text-text-secondary font-black">
            <div className="w-5 h-5 rounded-lg bg-accent-light/30 flex items-center justify-center text-accent">
              <Clock size={10} />
            </div>
            <span>{appointment.appointment_time}</span>
          </div>
          <div className="w-6 h-6 rounded-full bg-bg-soft flex items-center justify-center text-text-muted">
            <CalendarIcon size={10} />
          </div>
        </div>
      </div>
    </div>
  );
};

const KanbanColumn = ({ id, title, appointments, color }: { id: string; title: string; appointments: any[]; color: string }) => {
  const { setNodeRef } = useSortable({
    id: id,
    data: {
      type: 'Column',
      id,
    },
  });

  return (
    <div className="flex flex-col w-full min-w-[320px] bg-white/40 backdrop-blur-sm rounded-[2.5rem] p-6 border border-border/40 h-[calc(100vh-240px)] shadow-inner">
      <div className="flex items-center justify-between mb-6 px-2">
        <div className="flex items-center gap-3">
          <div className={`w-3 h-3 rounded-full ${color} shadow-sm shadow-${color.split('-')[1]}-400/50`} />
          <h3 className="font-black text-text-primary uppercase tracking-tighter text-sm">{title}</h3>
          <Badge variant="outline" className="rounded-full px-2 min-w-[1.5rem] justify-center bg-white border-border/60 text-text-muted font-black">{appointments.length}</Badge>
        </div>
        <button className="w-8 h-8 rounded-xl bg-white border border-border/60 flex items-center justify-center text-text-muted hover:text-primary hover:border-primary/50 transition-all shadow-sm">
          <Plus size={16} />
        </button>
      </div>

      <div ref={setNodeRef} className="flex-1 overflow-y-auto space-y-4 custom-scrollbar pr-2 pb-4">
        <SortableContext items={appointments.map((a: any) => a.id)} strategy={verticalListSortingStrategy}>
          {appointments.map((app) => (
            <SortableAppointmentCard key={app.id} appointment={app} />
          ))}
        </SortableContext>
        {appointments.length === 0 && (
          <div className="h-32 border-2 border-dashed border-border/40 rounded-[1.5rem] flex items-center justify-center text-text-muted font-bold text-xs">
            لا توجد مواعيد
          </div>
        )}
      </div>
    </div>
  );
};

// --- Main Page ---

const COLUMNS = [
  { id: 'pending', title: 'قيد الانتظار', color: 'bg-amber-400' },
  { id: 'confirmed', title: 'مقبول', color: 'bg-blue-400' },
  { id: 'completed', title: 'مكتمل', color: 'bg-accent' },
  { id: 'cancelled', title: 'ملغي', color: 'bg-red-400' },
];

export default function AppointmentBoard() {
  const queryClient = useQueryClient();
  const [activeAppointment, setActiveAppointment] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: appointmentsResponse, isLoading, error, refetch } = useQuery({
    queryKey: ['appointments-board'],
    queryFn: () => appointmentService.getAll(),
  });

  const { data: patientsResponse } = useQuery({ queryKey: ['patients-list'], queryFn: () => patientService.getAll() });
  const { data: doctorsResponse } = useQuery({ queryKey: ['doctors-list'], queryFn: () => employeeService.getAll() });

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: number; status: string }) => 
      appointmentService.updateStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments-board'] });
      toast.success('تم تحديث الحالة بنجاح');
    },
    onError: () => toast.error('حدث خطأ أثناء تحديث الحالة')
  });

  const createMutation = useMutation({
    mutationFn: (data: any) => appointmentService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments-board'] });
      toast.success('تم حجز الموعد بنجاح');
      setIsModalOpen(false);
      reset();
    }
  });

  const { register, handleSubmit, reset } = useForm();

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const appointments = useMemo(() => appointmentsResponse?.data || [], [appointmentsResponse]);

  const onDragStart = (event: DragStartEvent) => {
    const { active } = event;
    if (active.data.current?.type === 'Appointment') {
      setActiveAppointment(active.data.current.appointment);
    }
  };

  const onDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) {
      setActiveAppointment(null);
      return;
    }

    const activeId = active.id;
    const overId = over.id;
    
    // Find target column
    let targetStatus: string | null = null;
    
    // Check if over a column
    const overColumn = COLUMNS.find(c => c.id === overId);
    if (overColumn) {
      targetStatus = overColumn.id;
    } else {
      // Check if over another card
      const overAppointment = appointments.find((a: any) => a.id === overId);
      if (overAppointment) {
        targetStatus = overAppointment.status;
      }
    }

    if (targetStatus && targetStatus !== activeAppointment?.status) {
      updateStatusMutation.mutate({ id: Number(activeId), status: targetStatus });
    }

    setActiveAppointment(null);
  };

  if (isLoading) return <LoadingSkeleton />;
  if (error) return <ErrorState message="حدث خطأ في تحميل لوحة الحجوزات" onRetry={refetch} />;

  return (
    <div className="space-y-10">
      <PageHeader title="لوحة الحجوزات" description="إدارة المواعيد بنظام السحب والإفلات السلس.">
        <div className="flex gap-4">
          <div className="relative group">
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-primary transition-colors" size={18} />
            <input 
              type="text" 
              placeholder="بحث عن مريضة..." 
              className="bg-white border border-border/60 rounded-[1.25rem] pr-12 pl-6 py-3 text-sm focus:ring-4 focus:ring-primary/10 outline-none w-72 shadow-soft font-bold transition-all"
            />
          </div>
          <Button variant="gradient" className="rounded-[1.25rem] px-8 shadow-soft" onClick={() => setIsModalOpen(true)}>
            <Plus className="ml-2 w-5 h-5" /> حجز جديد
          </Button>
        </div>
      </PageHeader>

      <div className="flex gap-8 overflow-x-auto pb-10 custom-scrollbar -mx-2 px-2">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={onDragStart}
          onDragEnd={onDragEnd}
        >
          {COLUMNS.map((col) => (
            <KanbanColumn
              key={col.id}
              id={col.id}
              title={col.title}
              color={col.color}
              appointments={appointments.filter((a: any) => a.status === col.id)}
            />
          ))}

          <DragOverlay adjustScale={true}>
            {activeAppointment ? (
              <SortableAppointmentCard appointment={activeAppointment} isOverlay={true} />
            ) : null}
          </DragOverlay>
        </DndContext>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="حجز موعد جديد">
        <form onSubmit={handleSubmit((data) => createMutation.mutate(data))} className="space-y-5">
          <Select 
            label="المريضة" 
            {...register('patient_id', { required: true })}
            options={patientsResponse?.data?.map((p: any) => ({ value: p.id.toString(), label: p.user?.name || p.name })) || []}
          />
          <Select 
            label="الطبيبة المختصة" 
            {...register('doctor_id', { required: true })}
            options={doctorsResponse?.data?.filter((e: any) => e.role === 'doctor').map((d: any) => ({ value: d.id.toString(), label: d.name })) || []}
          />
          <div className="grid grid-cols-2 gap-5">
            <Input label="التاريخ" type="date" {...register('appointment_date', { required: true })} />
            <Input label="الوقت" type="time" {...register('appointment_time', { required: true })} />
          </div>
          <Input label="ملاحظات أو سبب الزيارة" {...register('reason')} />
          <div className="flex gap-4 mt-8">
            <Button type="submit" className="flex-1 h-14 rounded-2xl shadow-soft" variant="gradient" isLoading={createMutation.isPending}>تأكيد الحجز</Button>
            <Button type="button" variant="outline" className="h-14 rounded-2xl px-8" onClick={() => setIsModalOpen(false)}>إلغاء</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
