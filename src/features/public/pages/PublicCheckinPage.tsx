import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../../lib/axios';
interface CheckinData {
  patient_name: string;
  doctor_name: string;
  appointment_date: string;
  appointment_time: string;
  status: string;
  can_checkin: boolean;
}

export default function PublicCheckinPage() {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const [data, setData] = useState<CheckinData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [confirming, setConfirming] = useState(false);
  const [success, setSuccess] = useState(false);
  const [queueNumber, setQueueNumber] = useState('');

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const response = await api.get(`/public/checkin/${token}`);
        if (response.data.data.already_checked_in) {
          setQueueNumber(response.data.data.queue_number);
          setSuccess(true);
        } else {
          setData(response.data.data);
        }
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to load check-in details');
      } finally {
        setLoading(false);
      }
    };

    if (token) fetchDetails();
  }, [token]);

  const handleConfirm = async () => {
    setConfirming(true);
    try {
      const response = await api.post(`/public/checkin/${token}/confirm`);
      setQueueNumber(response.data.data.queue_number);
      setSuccess(true);
    } catch (err: any) {
      if (err.response?.data?.data?.queue_number) {
        // Fallback if backend sends 400 with queue number
        setQueueNumber(err.response.data.data.queue_number);
        setSuccess(true);
      } else {
        setError(err.response?.data?.message || 'Failed to confirm check-in');
      }
    } finally {
      setConfirming(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center rtl">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 rtl" dir="rtl">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
        <div className="text-center mb-8">
          <div className="h-16 w-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900">تسجيل الوصول الذكي</h2>
          <p className="text-gray-500 mt-2">عيادة الطبيب</p>
        </div>

        {error ? (
          <div className="bg-red-50 text-red-600 p-4 rounded-lg text-center font-medium">
            {error}
          </div>
        ) : success ? (
          <div className="text-center">
            <div className="bg-green-50 text-green-600 p-6 rounded-lg mb-6">
              <h3 className="text-lg font-semibold mb-2">تم تسجيل وصولك بنجاح</h3>
              <p className="text-sm">رقم دورك هو:</p>
              <div className="text-4xl font-bold mt-2">{queueNumber}</div>
            </div>
            <p className="text-gray-500 text-sm">
              يرجى الانتظار في صالة الاستقبال حتى يتم نداء رقمك عبر الشاشة.
            </p>
          </div>
        ) : data ? (
          <div className="space-y-6">
            <div className="bg-gray-50 p-4 rounded-lg space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-500">المريض</span>
                <span className="font-medium text-gray-900">{data.patient_name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">الطبيب</span>
                <span className="font-medium text-gray-900">{data.doctor_name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">الموعد</span>
                <span className="font-medium text-gray-900">{data.appointment_date} {data.appointment_time}</span>
              </div>
            </div>

            <button
              onClick={handleConfirm}
              disabled={confirming}
              className={`w-full py-3 px-4 rounded-lg text-white font-medium flex items-center justify-center transition-colors ${confirming ? 'bg-primary/70 cursor-not-allowed' : 'bg-primary hover:bg-primary/90'
                }`}
            >
              {confirming ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : (
                'تأكيد الوصول'
              )}
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
}
