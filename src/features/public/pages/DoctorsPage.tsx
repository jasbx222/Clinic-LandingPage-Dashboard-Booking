import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { fetchDoctors } from '../services/publicApi';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import { ErrorState } from '../../../components/ui/ErrorState';
import { LoadingSkeleton } from '../../../components/ui/LoadingSkeleton';
import { User, Star } from 'lucide-react';

export default function DoctorsPage() {
  const navigate = useNavigate();
  
  const { data: doctors, isLoading, error, refetch } = useQuery({
    queryKey: ['public-doctors'],
    queryFn: fetchDoctors,
  });

  return (
    <div className="min-h-screen bg-bg py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <Badge className="mb-4">أطباؤنا</Badge>
          <h1 className="text-4xl font-extrabold text-text mb-4">نخبة من أفضل الأطباء</h1>
          <p className="text-muted max-w-2xl mx-auto">فريق طبي متميز يجمع بين الخبرة الطويلة والمهارة العالية لتقديم أفضل رعاية لكِ.</p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map(i => <LoadingSkeleton key={i} className="h-72 rounded-3xl" />)}
          </div>
        ) : error ? (
          <ErrorState onRetry={() => refetch()} />
        ) : doctors?.length === 0 ? (
          <div className="text-center text-muted bg-white p-12 rounded-3xl shadow-soft border border-border">
            لا يوجد أطباء متاحين حالياً.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {doctors?.map(doctor => (
              <Card key={doctor.id} className="hover:-translate-y-2 transition-transform duration-300 overflow-hidden">
                <div className="h-32 bg-gradient-to-r from-primary-dark/20 to-lavender relative">
                  <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 w-24 h-24 rounded-full border-4 border-white bg-white overflow-hidden flex items-center justify-center">
                    {doctor.avatar_url ? (
                      <img src={doctor.avatar_url} alt={doctor.name} className="w-full h-full object-cover" />
                    ) : (
                      <User size={40} className="text-primary" />
                    )}
                  </div>
                </div>
                <div className="p-8 pt-16 text-center">
                  <h3 className="text-2xl font-bold text-text mb-1">{doctor.name}</h3>
                  <p className="text-primary font-medium mb-4">{doctor.specialization}</p>
                  
                  <div className="flex items-center justify-center gap-1 mb-6 text-yellow-400">
                    {[1, 2, 3, 4, 5].map(star => (
                      <Star key={star} size={16} fill="currentColor" />
                    ))}
                  </div>

                  <div className="flex justify-between items-center border-t border-border pt-4">
                    <span className="text-sm font-medium text-muted">رسوم الكشف:</span>
                    <span className="text-lg font-bold text-primary-dark">{doctor.consultation_fee} د.ع</span>
                  </div>
                  
                  <Button className="w-full mt-6 rounded-full" onClick={() => navigate(`/book-appointment`)}>
                    احجزي مع الطبيب
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
