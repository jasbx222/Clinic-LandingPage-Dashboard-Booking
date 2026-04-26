import React, { useState } from 'react';
import { PageHeader } from '../../components/ui/PageHeader';
import { Table } from '../../components/ui/Table';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Plus, Edit, Trash2, Shield, User, Search, Filter, Mail, Phone, Lock } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { employeeService } from '../../services/apiServices';
import { LoadingSkeleton } from '../../components/ui/LoadingSkeleton';
import { ErrorState } from '../../components/ui/ErrorState';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';

export default function EmployeesPage() {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<any>(null);

  const { data: employeesResponse, isLoading, error, refetch } = useQuery({
    queryKey: ['employees'],
    queryFn: () => employeeService.getAll(),
  });

  const { register, handleSubmit, reset, setValue } = useForm();

  const mutation = useMutation({
    mutationFn: (data: any) => selectedEmployee 
      ? employeeService.update(selectedEmployee.id, data) 
      : employeeService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      toast.success(selectedEmployee ? 'تم تحديث بيانات الموظف' : 'تم إضافة موظف جديد بنجاح');
      setIsModalOpen(false);
      reset();
      setSelectedEmployee(null);
    },
    onError: () => toast.error('حدث خطأ أثناء حفظ البيانات')
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => employeeService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      toast.success('تم حذف الموظف بنجاح');
    }
  });

  const openAddModal = () => {
    setSelectedEmployee(null);
    reset();
    setIsModalOpen(true);
  };

  const openEditModal = (employee: any) => {
    setSelectedEmployee(employee);
    setValue('name', employee.name);
    setValue('email', employee.email);
    setValue('role', employee.role);
    setValue('phone', employee.phone || '');
    setIsModalOpen(true);
  };

  const getRoleBadge = (role: string) => {
    switch(role) {
      case 'admin': return <Badge variant="secondary" className="bg-purple-50 text-purple-600 rounded-full px-4">مدير النظام</Badge>;
      case 'doctor': return <Badge variant="secondary" className="bg-blue-50 text-blue-600 rounded-full px-4">طبيبة مختصة</Badge>;
      case 'receptionist': return <Badge variant="secondary" className="bg-emerald-50 text-emerald-600 rounded-full px-4">استقبال</Badge>;
      case 'nurse': return <Badge variant="secondary" className="bg-pink-50 text-pink-600 rounded-full px-4">ممرضة</Badge>;
      default: return <Badge className="rounded-full px-4">{role}</Badge>;
    }
  };

  const employees = employeesResponse?.data || [];

  const columns = [
    { 
      header: 'الموظف', 
      accessor: (row: any) => (
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl gradient-pink-blue flex items-center justify-center text-white font-black shadow-sm">
            {row.name?.charAt(0)}
          </div>
          <div className="flex flex-col">
            <span className="font-black text-text-primary text-sm tracking-tight">{row.name}</span>
            <span className="text-[10px] text-text-muted font-bold uppercase tracking-wider">{row.role}</span>
          </div>
        </div>
      )
    },
    { header: 'الدور الوظيفي', accessor: (row: any) => getRoleBadge(row.role) },
    { 
      header: 'معلومات الاتصال', 
      accessor: (row: any) => (
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 text-xs font-bold text-text-secondary">
             <Mail size={12} className="text-primary" /> {row.email}
          </div>
          <div className="flex items-center gap-2 text-xs font-bold text-text-secondary">
             <Phone size={12} className="text-accent" /> {row.phone || '---'}
          </div>
        </div>
      )
    },
    { 
      header: 'الحالة', 
      accessor: (row: any) => (
        row.is_active !== false ? 
        <Badge variant="success" className="rounded-full px-4">نشط</Badge> : 
        <Badge variant="danger" className="rounded-full px-4">غير نشط</Badge>
      )
    },
    { 
      header: 'الإجراءات', 
      accessor: (row: any) => (
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="rounded-xl border-border/60 hover:border-primary/40 hover:bg-primary-light/10"
            onClick={() => openEditModal(row)}
          >
            <Edit size={16} className="text-primary" />
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="rounded-xl border-red-100 hover:bg-red-50 group"
            onClick={() => { if(window.confirm('هل أنت متأكد من حذف هذا الموظف؟')) deleteMutation.mutate(row.id); }}
          >
            <Trash2 size={16} className="text-red-400 group-hover:text-red-600 transition-colors" />
          </Button>
        </div>
      ) 
    },
  ];

  if (isLoading) return <LoadingSkeleton />;
  if (error) return <ErrorState message="حدث خطأ أثناء تحميل قائمة الموظفين" onRetry={refetch} />;

  return (
    <div className="space-y-8">
      <PageHeader title="إدارة الموظفين" description="إدارة الطاقم الطبي والإداري، توزيع الأدوار والتحكم في صلاحيات الوصول للمنظومة.">
        <div className="flex gap-4">
           <div className="relative group">
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-primary transition-colors" size={18} />
            <input 
              type="text" 
              placeholder="بحث باسم الموظف..." 
              className="bg-white border border-border/60 rounded-[1.25rem] pr-12 pl-6 py-3 text-sm focus:ring-4 focus:ring-primary/10 outline-none w-72 shadow-soft font-bold transition-all"
            />
          </div>
          <Button variant="gradient" className="rounded-[1.25rem] px-8 shadow-soft" onClick={openAddModal}>
            <Plus className="ml-2 w-5 h-5" /> إضافة موظف
          </Button>
        </div>
      </PageHeader>

      <div className="premium-card overflow-hidden">
        <Table data={employees} columns={columns} />
      </div>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title={selectedEmployee ? 'تعديل بيانات موظف' : 'إضافة موظف جديد'}
        className="max-w-xl"
      >
        <form onSubmit={handleSubmit((data) => mutation.mutate(data))} className="space-y-5 py-4">
          <Input label="الاسم الكامل" icon={<User size={18} />} {...register('name', { required: true })} />
          <div className="grid grid-cols-2 gap-5">
            <Input label="البريد الإلكتروني" type="email" icon={<Mail size={18} />} {...register('email', { required: true })} />
            <Input label="رقم الهاتف" icon={<Phone size={18} />} {...register('phone')} />
          </div>
          <Select 
            label="الدور الوظيفي" 
            icon={<Shield size={18} />}
            {...register('role', { required: true })}
            options={[
              { value: 'receptionist', label: 'طاقم الاستقبال' },
              { value: 'doctor', label: 'طبيبة مختصة' },
              { value: 'nurse', label: 'تمريض' },
              { value: 'accountant', label: 'محاسب' },
              { value: 'admin', label: 'مدير نظام' }
            ]}
          />
          {!selectedEmployee && (
             <Input label="كلمة المرور" type="password" icon={<Lock size={18} />} {...register('password', { required: true })} />
          )}
          <div className="flex gap-4 mt-10">
            <Button type="submit" className="flex-1 h-14 rounded-2xl shadow-soft" variant="gradient" isLoading={mutation.isPending}>
               {selectedEmployee ? 'تحديث البيانات' : 'تأكيد الإضافة'}
            </Button>
            <Button type="button" variant="outline" className="h-14 rounded-2xl px-8" onClick={() => setIsModalOpen(false)}>إلغاء</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
