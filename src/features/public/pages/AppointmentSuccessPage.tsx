import React from 'react';
import { useLocation, Navigate, useNavigate } from 'react-router-dom';
import { CheckCircle, Calendar, Clock, User, ArrowRight } from 'lucide-react';
import { Button } from '../../../components/ui/Button';

export default function AppointmentSuccessPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const booking = location.state?.booking;

  if (!booking) {
    return <Navigate to="/book-appointment" replace />;
  }

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-card rounded-3xl p-8 shadow-soft text-center">
        <div className="w-24 h-24 bg-mint text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle size={48} />
        </div>
        
        <h1 className="text-3xl font-extrabold text-text mb-2">تم الحجز بنجاح!</h1>
        <p className="text-muted mb-8">رقم الحجز: <span className="font-bold text-primary">#{booking.id || '12345'}</span></p>

        <div className="bg-lavender/30 rounded-2xl p-6 mb-8 space-y-4 text-right">
          <div className="flex items-center gap-3">
            <Calendar className="text-primary w-5 h-5" />
            <span className="font-bold text-text">{booking.date}</span>
          </div>
          <div className="flex items-center gap-3">
            <Clock className="text-primary w-5 h-5" />
            <span className="font-bold text-text">{booking.time}</span>
          </div>
          <div className="flex items-center gap-3">
            <User className="text-primary w-5 h-5" />
            <span className="font-bold text-text">{booking.patient?.full_name}</span>
          </div>
        </div>

        <Button className="w-full rounded-full" onClick={() => navigate('/')}>
          <ArrowRight className="ml-2 w-4 h-4" /> العودة للرئيسية
        </Button>
      </div>
    </div>
  );
}
