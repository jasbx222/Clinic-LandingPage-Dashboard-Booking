import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { fetchServices } from '../services/publicApi';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import { ErrorState } from '../../../components/ui/ErrorState';
import { Sparkles, Clock } from 'lucide-react';
import { LoadingSkeleton } from '../../../components/ui/LoadingSkeleton';

export default function ServicesPage() {
  const navigate = useNavigate();
  
  const { data: services, isLoading, error, refetch } = useQuery({
    queryKey: ['public-services'],
    queryFn: fetchServices,
  });

  return (
    <div className="min-h-screen bg-bg py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <Badge className="mb-4">الخدمات</Badge>
          <h1 className="text-4xl font-extrabold text-text mb-4">خدماتنا الطبية والتجميلية</h1>
          <p className="text-muted max-w-2xl mx-auto">نقدم لكِ مجموعة شاملة من الخدمات المصممة خصيصاً لتلبية احتياجاتكِ بأعلى معايير الجودة.</p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map(i => <LoadingSkeleton key={i} className="h-64 rounded-3xl" />)}
          </div>
        ) : error ? (
          <ErrorState onRetry={() => refetch()} />
        ) : services?.length === 0 ? (
          <div className="text-center text-muted bg-white p-12 rounded-3xl shadow-soft border border-border">
            لا توجد خدمات متاحة حالياً.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services?.map(service => (
              <Card key={service.id} className="hover:-translate-y-2 transition-transform duration-300 p-8">
                <div className="w-16 h-16 rounded-2xl bg-lavender flex items-center justify-center text-primary mb-6">
                  <Sparkles size={32} />
                </div>
                <h3 className="text-2xl font-bold text-text mb-3">{service.name}</h3>
                <p className="text-muted mb-6 line-clamp-3">{service.description}</p>
                <div className="flex items-center text-sm text-muted mb-6">
                  <Clock className="w-4 h-4 mr-1 ml-1" />
                  <span>{service.duration_minutes} دقيقة</span>
                </div>
                <div className="flex justify-between items-center border-t border-border pt-4">
                  <span className="text-xl font-bold text-primary-dark">{service.price} د.ع</span>
                  <Button className="rounded-full px-6" onClick={() => navigate(`/book-appointment`)}>
                    احجزي الآن
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
