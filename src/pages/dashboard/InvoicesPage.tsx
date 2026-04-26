import React, { useState, useEffect } from 'react';
import { PageHeader } from '../../components/ui/PageHeader';
import { Table } from '../../components/ui/Table';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Printer, Eye, Download, Search, Filter, FileText, Plus, CheckCircle, RefreshCw } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { invoiceService, patientService, visitService } from '../../services/apiServices';
import { LoadingSkeleton } from '../../components/ui/LoadingSkeleton';
import { ErrorState } from '../../components/ui/ErrorState';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { useForm, useWatch } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';

export default function InvoicesPage() {
  const queryClient = useQueryClient();
  const [selectedInvoice, setSelectedInvoice] = useState<any>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<"cancelled" | "unpaid" | "partially_paid" | "paid" | "">('');

  const { data: invoicesResponse, isLoading, error, refetch } = useQuery({
    queryKey: ['invoices', statusFilter],
    queryFn: () => invoiceService.getAll(statusFilter ? { status: statusFilter as any } : {}),
  });

  const { data: patientsResponse } = useQuery({
    queryKey: ['patients-list'],
    queryFn: () => patientService.getAll(),
  });

  const { data: visitsResponse } = useQuery({
    queryKey: ['visits-list'],
    queryFn: () => visitService.getAll(),
  });

  const createMutation = useMutation({
    mutationFn: (data: any) => invoiceService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
      toast.success('تم إصدار الفاتورة بنجاح');
      setIsAddModalOpen(false);
      reset();
    },
    onError: () => toast.error('حدث خطأ أثناء إصدار الفاتورة')
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: number; status: "cancelled" | "unpaid" | "partially_paid" | "paid" }) => invoiceService.update(id, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
      toast.success('تم تحديث حالة الفاتورة بنجاح');
      setIsDetailsOpen(false);
    },
    onError: () => toast.error('حدث خطأ أثناء تحديث الحالة')
  });

  const { register, handleSubmit, reset, control, setValue } = useForm();
  
  const selectedPatientId = useWatch({
    control,
    name: "patient_id"
  });

  const patientVisits = (visitsResponse?.data || []).filter((v: any) => 
    v.patient_id === Number(selectedPatientId)
  );

  useEffect(() => {
    if (selectedPatientId && visitsResponse?.data) {
      const visits = visitsResponse.data.filter((v: any) => v.patient_id === Number(selectedPatientId));
      if (visits.length > 0) {
        const latestVisit = visits.sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())[0];
        setValue('visit_id', latestVisit.id.toString());
      } else {
        setValue('visit_id', '');
      }
    }
  }, [selectedPatientId, visitsResponse, setValue]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'paid': return <Badge variant="success" className="rounded-full px-4">مدفوعة</Badge>;
      case 'unpaid': return <Badge variant="danger" className="rounded-full px-4">غير مدفوعة</Badge>;
      case 'partially_paid': return <Badge variant="warning" className="rounded-full px-4">مدفوعة جزئياً</Badge>;
      case 'cancelled': return <Badge variant="secondary" className="rounded-full px-4">ملغية</Badge>;
      default: return <Badge className="rounded-full px-4">{status}</Badge>;
    }
  };

  const invoices = invoicesResponse?.data || [];

  const openDetails = (invoice: any) => {
    setSelectedInvoice(invoice);
    setIsDetailsOpen(true);
  };

  const columns = [
    { 
      header: 'رقم الفاتورة', 
      accessor: (row: any) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary-light/20 flex items-center justify-center text-primary">
            <FileText size={18} />
          </div>
          <span className="font-black text-text-primary">INV-{row.id.toString().padStart(5, '0')}</span>
        </div>
      )
    },
    { 
      header: 'المريضة', 
      accessor: (row: any) => (
        <div className="flex flex-col">
          <span className="font-bold text-text-primary">{row.patient?.user?.name || row.patient_name || '---'}</span>
          <span className="text-[10px] text-text-muted font-bold uppercase tracking-wider">{row.patient?.file_number || 'No File'}</span>
        </div>
      )
    },
    { 
      header: 'المبلغ النهائي', 
      accessor: (row: any) => (
        <span className="font-black text-text-primary text-lg">
          {row.total || '0'} <span className="text-xs text-primary">د.ع</span>
        </span>
      )
    },
    { 
      header: 'التاريخ', 
      accessor: (row: any) => (
        <span className="font-bold text-text-secondary text-sm">
          {new Date(row.created_at).toLocaleDateString('ar-SA', { year: 'numeric', month: 'long', day: 'numeric' })}
        </span>
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
            className="rounded-xl border-border/60 hover:border-primary/40 hover:bg-primary-light/10"
            onClick={() => openDetails(row)}
          >
            <Eye size={16} className="text-primary" />
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="rounded-xl border-border/60 hover:border-accent/40 hover:bg-accent-light/10"
            onClick={() => invoiceService.print(row.id)}
          >
            <Printer size={16} className="text-accent" />
          </Button>
        </div>
      ) 
    },
  ];

  if (isLoading) return <LoadingSkeleton />;
  if (error) return <ErrorState message="حدث خطأ أثناء تحميل الفواتير" onRetry={refetch} />;

  return (
    <div className="space-y-8">
      <PageHeader title="الفواتير والمدفوعات" description="إدارة العمليات المالية والمستحقات والتقارير الضريبية.">
        <div className="flex gap-3">
          <div className="relative group">
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-primary transition-colors" size={18} />
            <input 
              type="text" 
              placeholder="بحث برقم الفاتورة أو المريضة..." 
              className="bg-white border border-border/60 rounded-[1.25rem] pr-12 pl-6 py-3 text-sm focus:ring-4 focus:ring-primary/10 outline-none w-64 shadow-soft font-bold transition-all"
            />
          </div>
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="h-full bg-white border border-border/60 rounded-[1.25rem] px-6 text-sm font-bold text-text-primary outline-none focus:ring-4 focus:ring-primary/10 shadow-soft appearance-none pr-10"
            >
              <option value="">كل الحالات</option>
              <option value="paid">مدفوعة</option>
              <option value="unpaid">غير مدفوعة</option>
              <option value="partially_paid">مدفوعة جزئياً</option>
            </select>
            <Filter size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
          </div>
          <Button variant="gradient" className="rounded-[1.25rem] px-8 shadow-soft" onClick={() => setIsAddModalOpen(true)}>
             <Plus className="ml-2 w-5 h-5" /> إضافة فاتورة
          </Button>
        </div>
      </PageHeader>

      <div className="premium-card overflow-hidden">
        <Table data={invoices} columns={columns} />
      </div>

      {/* Add Invoice Modal */}
      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="إصدار فاتورة جديدة" className="max-w-xl">
        <form onSubmit={handleSubmit((data) => createMutation.mutate(data))} className="space-y-5 py-4">
          <Select 
            label="المريضة" 
            {...register('patient_id', { required: true })}
            options={[{ value: '', label: 'اختر مريضة' }, ...(patientsResponse?.data?.map((p: any) => ({ value: p.id.toString(), label: p.user?.name || p.name })) || [])]}
          />
          {selectedPatientId && (
            <Select 
              label="الكشف المرتبط (اختياري)" 
              {...register('visit_id')}
              options={[{ value: '', label: 'بدون كشف محدد' }, ...patientVisits.map((v: any) => ({ 
                value: v.id.toString(), 
                label: `${v.chief_complaint?.substring(0, 30) || 'كشف'} - ${new Date(v.created_at).toLocaleDateString('ar-SA')}` 
              }))]}
            />
          )}
          <div className="grid grid-cols-2 gap-5">
            <Input label="المبلغ (قبل الضريبة)" type="number" step="0.01" {...register('subtotal', { required: true })} />
            <Input label="قيمة الضريبة" type="number" step="0.01" defaultValue="0" {...register('tax')} />
          </div>
          <Input label="ملاحظات" {...register('notes')} />
          
          <div className="flex gap-4 mt-8">
            <Button type="submit" className="flex-1 h-14 rounded-2xl shadow-soft" variant="gradient" isLoading={createMutation.isPending}>
               إصدار الفاتورة
            </Button>
            <Button type="button" variant="outline" className="h-14 rounded-2xl px-8" onClick={() => setIsAddModalOpen(false)}>إلغاء</Button>
          </div>
        </form>
      </Modal>

      {/* Invoice Details Modal */}
      <Modal 
        isOpen={isDetailsOpen} 
        onClose={() => setIsDetailsOpen(false)} 
        title="تفاصيل الفاتورة"
        className="max-w-3xl"
      >
        {selectedInvoice && (
          <div className="space-y-8 py-4">
            {/* Header Info */}
            <div className="flex justify-between items-start border-b border-border pb-8">
              <div className="space-y-1">
                <h3 className="text-3xl font-black text-text-primary tracking-tighter">INV-{selectedInvoice.id.toString().padStart(5, '0')}</h3>
                <p className="text-text-muted font-bold text-sm">تاريخ الإصدار: {new Date(selectedInvoice.created_at).toLocaleDateString('ar-SA')}</p>
                {getStatusBadge(selectedInvoice.status)}
              </div>
              <div className="text-left space-y-1">
                <h4 className="text-xl font-black text-primary tracking-tighter">عيادة ديفاميد</h4>
                <p className="text-text-muted font-bold text-xs">الرياض، المملكة العربية السعودية</p>
                <p className="text-text-muted font-bold text-xs">الرقم الضريبي: 300012345600003</p>
              </div>
            </div>

            {/* Patient Info */}
            <div className="grid grid-cols-2 gap-8 bg-bg-soft rounded-3xl p-6 border border-border/40">
              <div>
                <p className="text-[10px] font-black text-text-muted uppercase tracking-widest mb-2">معلومات المريضة</p>
                <h5 className="text-lg font-black text-text-primary mb-1">{selectedInvoice.patient?.user?.name || selectedInvoice.patient_name}</h5>
                <p className="text-sm font-bold text-text-secondary">{selectedInvoice.patient?.user?.phone || '---'}</p>
              </div>
              <div className="text-left">
                <p className="text-[10px] font-black text-text-muted uppercase tracking-widest mb-2">رقم الملف</p>
                <h5 className="text-lg font-black text-text-primary tracking-wider">{selectedInvoice.patient?.file_number || '---'}</h5>
              </div>
            </div>

            {/* Items Table */}
            <div className="space-y-4">
              <p className="text-[10px] font-black text-text-muted uppercase tracking-widest px-2">تفاصيل الخدمات</p>
              <div className="border border-border/60 rounded-[2rem] overflow-hidden">
                <table className="w-full text-right text-sm">
                  <thead className="bg-bg-soft/50 border-b border-border">
                    <tr>
                      <th className="px-6 py-4 font-black text-text-primary">الخدمة</th>
                      <th className="px-6 py-4 font-black text-text-primary text-center">الكمية</th>
                      <th className="px-6 py-4 font-black text-text-primary text-left">السعر</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/40">
                    <tr>
                      <td className="px-6 py-5 font-bold text-text-primary">كشف طبي أو خدمة عامة</td>
                      <td className="px-6 py-5 font-bold text-text-secondary text-center">1</td>
                      <td className="px-6 py-5 font-black text-text-primary text-left">{selectedInvoice.subtotal || selectedInvoice.total} د.ع</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Summary */}
            <div className="flex justify-end pt-4">
              <div className="w-72 space-y-4">
                <div className="flex justify-between text-sm font-bold px-2">
                  <span className="text-text-muted">المجموع الفرعي:</span>
                  <span className="text-text-primary">{selectedInvoice.subtotal || selectedInvoice.total} د.ع</span>
                </div>
                <div className="flex justify-between text-sm font-bold px-2">
                  <span className="text-text-muted">الخصم:</span>
                  <span className="text-red-500">-{selectedInvoice.discount || '0'} د.ع</span>
                </div>
                <div className="flex justify-between text-sm font-bold px-2">
                  <span className="text-text-muted">الضريبة:</span>
                  <span className="text-text-primary">{selectedInvoice.tax || '0'} د.ع</span>
                </div>
                <div className="flex justify-between items-center bg-primary-light/20 p-4 rounded-2xl border border-primary/10">
                  <span className="text-primary font-black text-lg tracking-tight">الإجمالي النهائي:</span>
                  <span className="text-primary-dark font-black text-2xl tracking-tighter">{selectedInvoice.total} د.ع</span>
                </div>
              </div>
            </div>

            {/* Actions & Status Change */}
            <div className="border-t border-border pt-6 mt-6">
              <h4 className="text-xs font-black text-text-muted uppercase tracking-widest mb-4">تحديث حالة الفاتورة</h4>
              <div className="flex flex-wrap gap-3 mb-6">
                <Button 
                  variant={selectedInvoice.status === 'paid' ? 'primary' : 'outline'} 
                  className={selectedInvoice.status === 'paid' ? "bg-emerald-500 hover:bg-emerald-600 border-none rounded-xl text-white shadow-soft" : "rounded-xl border-border/60 text-text-primary"}
                  onClick={() => updateStatusMutation.mutate({ id: selectedInvoice.id, status: 'paid' })}
                  disabled={selectedInvoice.status === 'paid'}
                >
                  <CheckCircle size={16} className="ml-2" /> مدفوعة
                </Button>
                <Button 
                  variant={selectedInvoice.status === 'partially_paid' ? 'primary' : 'outline'} 
                  className={selectedInvoice.status === 'partially_paid' ? "bg-amber-500 hover:bg-amber-600 border-none rounded-xl text-white shadow-soft" : "rounded-xl border-border/60 text-text-primary"}
                  onClick={() => updateStatusMutation.mutate({ id: selectedInvoice.id, status: 'partially_paid' })}
                  disabled={selectedInvoice.status === 'partially_paid'}
                >
                  <RefreshCw size={16} className="ml-2" /> مدفوعة جزئياً
                </Button>
              </div>

              <div className="flex gap-4">
                 <Button className="flex-1 h-14 rounded-2xl shadow-soft" variant="gradient" onClick={() => invoiceService.print(selectedInvoice.id)}>
                   <Printer size={20} className="ml-2" /> طباعة الفاتورة
                 </Button>
                 <Button variant="outline" className="flex-1 h-14 rounded-2xl border-border/60 shadow-sm">
                   <Download size={20} className="ml-2" /> تحميل PDF
                 </Button>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
