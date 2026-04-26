import React, { useState } from 'react';
import { PageHeader } from '../../components/ui/PageHeader';
import { Table } from '../../components/ui/Table';
import { Button } from '../../components/ui/Button';
import { Plus, Eye, Edit, Trash2 } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { patientService } from '../../services/apiServices';
import { LoadingSkeleton } from '../../components/ui/LoadingSkeleton';
import { ErrorState } from '../../components/ui/ErrorState';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';

export default function PatientsPage() {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<any>(null);

  const { data: patientsResponse, isLoading, error, refetch } = useQuery({
    queryKey: ['patients'],
    queryFn: () => patientService.getAll(),
  });

  const { register, handleSubmit, reset, setValue } = useForm();

  const mutation = useMutation({
    mutationFn: (data: any) => selectedPatient 
      ? patientService.update(selectedPatient.id, data) 
      : patientService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['patients'] });
      toast.success(selectedPatient ? 'تم تحديث بيانات المريض' : 'تم إضافة مريض جديد');
      setIsModalOpen(false);
      reset();
      setSelectedPatient(null);
    },
    onError: () => toast.error('حدث خطأ أثناء حفظ البيانات')
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => patientService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['patients'] });
      toast.success('تم حذف المريض بنجاح');
    }
  });

  const openAddModal = () => {
    setSelectedPatient(null);
    reset();
    setIsModalOpen(true);
  };

  const openEditModal = (patient: any) => {
    setSelectedPatient(patient);
    setValue('name', patient.user?.name || patient.name);
    setValue('phone', patient.user?.phone || patient.phone);
    setValue('email', patient.user?.email || '');
    setValue('gender', patient.gender);
    setValue('birth_date', patient.birth_date);
    setIsModalOpen(true);
  };

  const patients = patientsResponse?.data || [];

  const columns = [
    { header: 'رقم الملف', accessor: (row: any) => <span className="font-bold text-primary">#{row.id}</span> },
    { header: 'الاسم', accessor: (row: any) => row.user?.name || row.name },
    { header: 'رقم الهاتف', accessor: (row: any) => row.user?.phone || row.phone || '---' },
    { header: 'الجنس', accessor: (row: any) => row.gender === 'male' ? 'ذكر' : 'أنثى' },
    { header: 'تاريخ الميلاد', accessor: 'birth_date' },
    { 
      header: 'الإجراءات', 
      accessor: (row: any) => (
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => openEditModal(row)}><Edit size={16} /></Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="text-red-600 border-red-200"
            onClick={() => { if(window.confirm('هل أنت متأكد من الحذف؟')) deleteMutation.mutate(row.id); }}
          >
            <Trash2 size={16} />
          </Button>
        </div>
      ) 
    },
  ];

  if (isLoading) return <LoadingSkeleton />;
  if (error) return <ErrorState message="حدث خطأ أثناء تحميل المرضى" onRetry={refetch} />;

  return (
    <div className="space-y-6">
      <PageHeader title="المرضى" description="إدارة ملفات المرضى وتاريخهم الطبي وبيانات التواصل.">
        <Button onClick={openAddModal}><Plus className="ml-2 w-4 h-4" /> مريض جديد</Button>
      </PageHeader>

      <Table data={patients} columns={columns} />

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title={selectedPatient ? 'تعديل بيانات مريض' : 'إضافة مريض جديد'}
      >
        <form onSubmit={handleSubmit((data) => mutation.mutate(data))} className="space-y-4">
          <Input label="الاسم الكامل" {...register('name', { required: true })} />
          <div className="grid grid-cols-2 gap-4">
            <Input label="رقم الهاتف" {...register('phone', { required: true })} />
            <Input label="البريد الإلكتروني" type="email" {...register('email')} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Select 
              label="الجنس" 
              {...register('gender', { required: true })}
              options={[
                { value: 'female', label: 'أنثى' },
                { value: 'male', label: 'ذكر' }
              ]}
            />
            <Input label="تاريخ الميلاد" type="date" {...register('birth_date', { required: true })} />
          </div>
          <div className="flex gap-3 mt-6">
            <Button type="submit" className="flex-1" isLoading={mutation.isPending}>حفظ</Button>
            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>إلغاء</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
