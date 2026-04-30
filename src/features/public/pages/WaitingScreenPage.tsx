import React, { useState, useEffect } from 'react';

import { toast } from 'react-hot-toast';
import api from '../../../lib/axios';

interface QueueItem {
  queue_number: string;
  status?: string;
}

interface DoctorQueue {
  doctor_name: string;
  current: QueueItem | null;
  next: QueueItem[];
}

export default function WaitingScreenPage() {
  const [data, setData] = useState<DoctorQueue[]>([]);
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const fetchQueue = async () => {
      try {
        const response = await api.get('/public/waiting-screen');
        setData(response.data.data);
      } catch (err) {
        console.error('Failed to fetch waiting screen data', err);
      }
    };

    fetchQueue();
    const intervalId = setInterval(fetchQueue, 10000); // Poll every 10 seconds

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    const timerId = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timerId);
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8 rtl" dir="rtl">
      <div className="flex justify-between items-center mb-12">
        <h1 className="text-4xl font-bold text-primary">العيادة الذكية</h1>
        <div className="text-2xl font-mono">
          {time.toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {data.length === 0 ? (
          <div className="col-span-full flex justify-center items-center h-64 text-gray-500 text-2xl">
            لا يوجد مرضى في طابور الانتظار حالياً
          </div>
        ) : (
          data.map((doctor, index) => (
            <div key={index} className="bg-gray-800 rounded-2xl overflow-hidden border border-gray-700 shadow-2xl">
              <div className="bg-gray-700 p-4 text-center border-b border-gray-600">
                <h2 className="text-2xl font-semibold text-gray-100">{doctor.doctor_name}</h2>
              </div>

              <div className="p-8 text-center bg-gray-800">
                <div className="text-gray-400 text-lg mb-2">الدور الحالي</div>
                {doctor.current ? (
                  <div className="text-7xl font-bold text-primary mb-4 animate-pulse">
                    {doctor.current.queue_number}
                  </div>
                ) : (
                  <div className="text-4xl font-medium text-gray-500 mb-4 py-6">
                    في الانتظار
                  </div>
                )}
              </div>

              {doctor.next && doctor.next.length > 0 && (
                <div className="bg-gray-900 p-6 border-t border-gray-700">
                  <div className="text-gray-400 mb-3 text-center">التالي</div>
                  <div className="flex justify-center gap-4 flex-wrap">
                    {doctor.next.map((item, i) => (
                      <span key={i} className="px-4 py-2 bg-gray-800 rounded-lg text-xl font-medium text-gray-300 border border-gray-700">
                        {item.queue_number}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
