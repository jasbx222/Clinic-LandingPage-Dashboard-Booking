import React, { useState, useEffect } from 'react';

import { toast } from 'react-hot-toast';
import api from '../../lib/axios';

interface QueueItem {
  id: number;
  queue_number: string;
  patient_name: string;
  doctor_name: string;
  appointment_time: string | null;
  status: string;
  priority: string;
  checked_in_at: string | null;
}

const statusColors: Record<string, string> = {
  waiting: 'bg-yellow-100 text-yellow-800',
  called: 'bg-blue-100 text-blue-800',
  in_consultation: 'bg-purple-100 text-purple-800',
  billing: 'bg-orange-100 text-orange-800',
  completed: 'bg-green-100 text-green-800',
  skipped: 'bg-gray-100 text-gray-800',
  cancelled: 'bg-red-100 text-red-800',
};

const statusLabels: Record<string, string> = {
  waiting: 'في الانتظار',
  called: 'تم النداء',
  in_consultation: 'في الاستشارة',
  billing: 'في الحسابات',
  completed: 'مكتمل',
  skipped: 'تجاوز',
  cancelled: 'ملغي',
};

const priorityColors: Record<string, string> = {
  normal: 'bg-gray-100 text-gray-800',
  urgent: 'bg-red-100 text-red-800',
  elderly: 'bg-blue-100 text-blue-800',
  vip: 'bg-yellow-100 text-yellow-800',
};

const priorityLabels: Record<string, string> = {
  normal: 'عادي',
  urgent: 'عاجل',
  elderly: 'كبار السن',
  vip: 'VIP',
};

export default function QueueDashboardPage() {
  const [queue, setQueue] = useState<QueueItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchQueue = async () => {
    try {
      const response = await api.get('/admin/queue/today');
      setQueue(response.data.data);
    } catch (err) {
      console.error('Failed to fetch queue', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQueue();
    const interval = setInterval(fetchQueue, 15000);
    return () => clearInterval(interval);
  }, []);

  const handleAction = async (id: number, action: string) => {
    try {
      const res = await api.post(`/admin/queue/${id}/${action}`);
      toast.success(res.data.message || 'تم تحديث الحالة بنجاح');
      fetchQueue();
    } catch (err: any) {
      console.error(`Failed to perform action ${action}`, err);
      toast.error(err.response?.data?.message || 'حدث خطأ أثناء تحديث الحالة');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">طابور الانتظار (اليوم)</h1>
        <button
          onClick={fetchQueue}
          className="text-primary hover:bg-primary/10 px-4 py-2 rounded-lg transition-colors"
        >
          تحديث
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
        <div className="overflow-x-auto">
          <table className="w-full text-right">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 text-sm font-medium text-gray-500">رقم الدور</th>
                <th className="px-6 py-4 text-sm font-medium text-gray-500">المريض</th>
                <th className="px-6 py-4 text-sm font-medium text-gray-500">الطبيب</th>
                <th className="px-6 py-4 text-sm font-medium text-gray-500">الوقت</th>
                <th className="px-6 py-4 text-sm font-medium text-gray-500">الأولوية</th>
                <th className="px-6 py-4 text-sm font-medium text-gray-500">الحالة</th>
                <th className="px-6 py-4 text-sm font-medium text-gray-500">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {queue.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                    لا يوجد مرضى في طابور الانتظار اليوم
                  </td>
                </tr>
              ) : (
                queue.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <span className="font-bold text-primary">{item.queue_number}</span>
                    </td>
                    <td className="px-6 py-4 text-gray-900 font-medium">{item.patient_name}</td>
                    <td className="px-6 py-4 text-gray-500">{item.doctor_name}</td>
                    <td className="px-6 py-4 text-gray-500">
                      {item.appointment_time || 'غير محدد'}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${priorityColors[item.priority] || priorityColors.normal}`}>
                        {priorityLabels[item.priority] || priorityLabels.normal}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[item.status] || statusColors.waiting}`}>
                        {statusLabels[item.status] || item.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2 flex-wrap">
                        {item.status === 'waiting' && (
                          <button onClick={() => handleAction(item.id, 'call')} className="text-xs bg-blue-50 text-blue-600 px-3 py-1 rounded hover:bg-blue-100 font-medium transition-colors">نداء</button>
                        )}
                        {(item.status === 'waiting' || item.status === 'called') && (
                          <button onClick={() => handleAction(item.id, 'start')} className="text-xs bg-purple-50 text-purple-600 px-3 py-1 rounded hover:bg-purple-100 font-medium transition-colors">دخول</button>
                        )}
                        {item.status === 'in_consultation' && (
                          <button onClick={() => handleAction(item.id, 'billing')} className="text-xs bg-orange-50 text-orange-600 px-3 py-1 rounded hover:bg-orange-100 font-medium transition-colors">حسابات</button>
                        )}
                        {['waiting', 'called', 'in_consultation', 'billing'].includes(item.status) && (
                          <button onClick={() => handleAction(item.id, 'complete')} className="text-xs bg-green-50 text-green-600 px-3 py-1 rounded hover:bg-green-100 font-medium transition-colors">اكتمال</button>
                        )}
                        {item.status === 'waiting' && (
                          <button onClick={() => handleAction(item.id, 'skip')} className="text-xs bg-gray-100 text-gray-600 px-3 py-1 rounded hover:bg-gray-200 font-medium transition-colors">تجاوز</button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
