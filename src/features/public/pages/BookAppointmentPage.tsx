import React, { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { fetchServices, fetchDoctors, fetchAvailableSlots, createAppointment } from '../services/publicApi';
import { Stepper } from '../../../components/ui/Stepper';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Textarea } from '../../../components/ui/Textarea';
import { Select } from '../../../components/ui/Select';
import { ErrorState } from '../../../components/ui/ErrorState';
import { LoadingSkeleton } from '../../../components/ui/LoadingSkeleton';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Calendar as CalendarIcon, User, Stethoscope } from 'lucide-react';
import dayjs from 'dayjs';

const STEPS = [
  { id: 1, title: 'الخدمة' },
  { id: 2, title: 'الطبيب' },
  { id: 3, title: 'الموعد' },
  { id: 4, title: 'البيانات' },
  { id: 5, title: 'التأكيد' },
];

const patientSchema = z.object({
  full_name: z.string().min(3, "الاسم يجب أن يكون 3 أحرف على الأقل"),
  phone: z.string().min(10, "رقم الهاتف غير صحيح"),
  gender: z.enum(['male', 'female']),
  birth_date: z.string().min(1, "تاريخ الميلاد مطلوب"),
  visit_reason: z.string().min(5, "يرجى كتابة سبب الزيارة"),
  notes: z.string().optional(),
});

type PatientFormData = z.infer<typeof patientSchema>;

export default function BookAppointmentPage() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedServiceId, setSelectedServiceId] = useState<number | null>(null);
  const [selectedDoctorId, setSelectedDoctorId] = useState<number | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>(dayjs().format('YYYY-MM-DD'));
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  const { control, handleSubmit, formState: { errors } } = useForm<PatientFormData>({
    resolver: zodResolver(patientSchema),
    defaultValues: {
      gender: 'female',
    }
  });

  const { data: services, isLoading: isLoadingServices, error: servicesError } = useQuery({
    queryKey: ['public-services'],
    queryFn: fetchServices,
  });

  const { data: doctors, isLoading: isLoadingDoctors, error: doctorsError } = useQuery({
    queryKey: ['public-doctors'],
    queryFn: fetchDoctors,
  });

  const { data: slots, isLoading: isLoadingSlots } = useQuery({
    queryKey: ['public-slots', selectedDoctorId, selectedServiceId, selectedDate],
    queryFn: () => fetchAvailableSlots(String(selectedDoctorId), String(selectedServiceId), selectedDate),
    enabled: currentStep === 3 && !!selectedDoctorId && !!selectedServiceId && !!selectedDate,
  });

  const bookMutation = useMutation({
    mutationFn: createAppointment,
    onSuccess: (data, variables) => {
      navigate('/appointment-success', {
        state: {
          booking: {
            id: data?.appointment_id || Math.floor(Math.random() * 10000),
            date: variables.date,
            time: variables.time,
            patient: { full_name: variables.patient.full_name }
          }
        }
      });
    },
  });

  const handleNext = () => setCurrentStep(prev => Math.min(prev + 1, 5));
  const handlePrev = () => setCurrentStep(prev => Math.max(prev - 1, 1));

  const onSubmit = (data: PatientFormData) => {
    if (currentStep === 4) {
      handleNext();
    } else if (currentStep === 5) {
      bookMutation.mutate({
        service_id: selectedServiceId!,
        doctor_id: selectedDoctorId,
        date: selectedDate,
        time: selectedTime!,
        patient: {
          full_name: data.full_name,
          phone: data.phone,
          gender: data.gender,
          birth_date: data.birth_date,
          reason: data.visit_reason,
          notes: data.notes
        }
      });
    }
  };

  const selectedService = services?.find(s => s.id === selectedServiceId);
  const selectedDoctor = doctors?.find(d => d.id === selectedDoctorId);

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        if (isLoadingServices) return <div className="space-y-4"><LoadingSkeleton className="h-32" /><LoadingSkeleton className="h-32" /></div>;
        if (servicesError) return <ErrorState />;
        
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {services?.map(service => (
              <Card 
                key={service.id} 
                className={`cursor-pointer transition-all hover:shadow-md border-2 ${selectedServiceId === service.id ? 'border-primary bg-primary/5' : 'border-transparent'}`}
                onClick={() => setSelectedServiceId(service.id)}
              >
                <div className="p-5">
                  <h3 className="font-bold text-lg mb-2 text-text">{service.name}</h3>
                  <p className="text-muted text-sm mb-4 line-clamp-2">{service.description}</p>
                  <div className="flex justify-between items-center text-sm font-medium">
                    <span className="text-primary-dark">{service.price} د.ع</span>
                    <span className="flex items-center text-muted"><Clock className="w-4 h-4 mr-1 ml-1" /> {service.duration_minutes} دقيقة</span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        );

      case 2:
        if (isLoadingDoctors) return <div className="space-y-4"><LoadingSkeleton className="h-32" /><LoadingSkeleton className="h-32" /></div>;
        if (doctorsError) return <ErrorState />;

        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {doctors?.map(doctor => (
              <Card 
                key={doctor.id} 
                className={`cursor-pointer transition-all hover:shadow-md border-2 ${selectedDoctorId === doctor.id ? 'border-primary bg-primary/5' : 'border-transparent'}`}
                onClick={() => setSelectedDoctorId(doctor.id)}
              >
                <div className="p-5 flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-lavender flex items-center justify-center text-primary-dark">
                    {doctor.avatar_url ? <img src={doctor.avatar_url} alt={doctor.name} className="w-full h-full rounded-full object-cover" /> : <User size={32} />}
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-text">{doctor.name}</h3>
                    <p className="text-primary text-sm font-medium">{doctor.specialization}</p>
                    <p className="text-muted text-sm mt-1">{doctor.consultation_fee} د.ع</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-text mb-2">اختر التاريخ</label>
              <Input 
                type="date" 
                value={selectedDate} 
                min={dayjs().format('YYYY-MM-DD')}
                onChange={e => {
                  setSelectedDate(e.target.value);
                  setSelectedTime(null);
                }}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-text mb-2">الوقت المتاح</label>
              {isLoadingSlots ? (
                <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
                  {[...Array(8)].map((_, i) => <LoadingSkeleton key={i} className="h-12 rounded-xl" />)}
                </div>
              ) : slots && slots.length > 0 ? (
                <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
                  {slots.map((slot, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedTime(slot.time)}
                      className={`p-3 rounded-xl border text-sm font-bold transition-all ${
                        selectedTime === slot.time 
                          ? 'border-primary bg-primary text-white shadow-md' 
                          : 'border-border text-text hover:border-primary hover:text-primary-dark hover:bg-primary/5'
                      }`}
                    >
                      {slot.label || slot.time}
                    </button>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center bg-gray-50 rounded-2xl border border-dashed border-gray-300">
                  <p className="text-muted">لا توجد مواعيد متاحة في هذا اليوم.</p>
                </div>
              )}
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-4">
            <Controller
              name="full_name"
              control={control}
              render={({ field }) => (
                <Input label="الاسم الكامل" placeholder="أدخل اسمك الكامل" error={errors.full_name?.message} {...field} />
              )}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Controller
                name="phone"
                control={control}
                render={({ field }) => (
                  <Input label="رقم الهاتف" placeholder="05xxxxxxxx" error={errors.phone?.message} {...field} />
                )}
              />
              <Controller
                name="birth_date"
                control={control}
                render={({ field }) => (
                  <Input label="تاريخ الميلاد" type="date" error={errors.birth_date?.message} {...field} />
                )}
              />
            </div>
            <Controller
              name="gender"
              control={control}
              render={({ field }) => (
                <Select
                  label="الجنس"
                  options={[{ label: 'أنثى', value: 'female' }, { label: 'ذكر', value: 'male' }]}
                  error={errors.gender?.message}
                  {...field}
                />
              )}
            />
            <Controller
              name="visit_reason"
              control={control}
              render={({ field }) => (
                <Textarea label="سبب الزيارة" placeholder="صف سبب زيارتك باختصار..." error={errors.visit_reason?.message} {...field} />
              )}
            />
            <Controller
              name="notes"
              control={control}
              render={({ field }) => (
                <Textarea label="ملاحظات إضافية (اختياري)" placeholder="أي ملاحظات أخرى..." {...field} />
              )}
            />
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div className="bg-bg rounded-3xl p-6 border border-border">
              <h3 className="font-bold text-lg mb-4 pb-2 border-b border-border">ملخص الحجز</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Stethoscope className="text-primary shrink-0 mt-1" size={20} />
                  <div>
                    <p className="text-sm text-muted">الخدمة</p>
                    <p className="font-semibold text-text">{selectedService?.name}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <User className="text-primary shrink-0 mt-1" size={20} />
                  <div>
                    <p className="text-sm text-muted">الطبيب</p>
                    <p className="font-semibold text-text">{selectedDoctor?.name}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CalendarIcon className="text-primary shrink-0 mt-1" size={20} />
                  <div>
                    <p className="text-sm text-muted">الموعد</p>
                    <p className="font-semibold text-text">{selectedDate} - {selectedTime}</p>
                  </div>
                </div>
              </div>
            </div>
            
            {bookMutation.isError && (
              <ErrorState 
                title="خطأ في الحجز" 
                message={(bookMutation.error as any)?.response?.data?.message || "حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى."} 
              />
            )}
          </div>
        );

      default:
        return null;
    }
  };

  const isNextDisabled = () => {
    if (currentStep === 1 && !selectedServiceId) return true;
    if (currentStep === 2 && !selectedDoctorId) return true;
    if (currentStep === 3 && (!selectedDate || !selectedTime)) return true;
    return false;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 min-h-[calc(100vh-90px)]">
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-extrabold text-text mb-4">احجزي موعدك الآن</h1>
        <p className="text-muted max-w-2xl mx-auto">خطوات بسيطة لحجز موعدك مع أفضل الأطباء. نحن هنا لرعايتك.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_380px] gap-8 items-start">
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-soft border border-border">
          <Stepper steps={STEPS} currentStep={currentStep} className="mb-10" />

          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="min-h-[300px]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  transition={{ duration: 0.3 }}
                >
                  {renderStepContent()}
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="mt-10 flex justify-between pt-6 border-t border-border">
              <Button 
                type="button" 
                variant="outline" 
                onClick={handlePrev} 
                disabled={currentStep === 1}
              >
                السابق
              </Button>
              
              {currentStep < 4 ? (
                <Button 
                  type="button" 
                  onClick={handleNext} 
                  disabled={isNextDisabled()}
                  className="px-8"
                >
                  التالي
                </Button>
              ) : (
                <Button 
                  type="submit" 
                  isLoading={bookMutation.isPending}
                  className="px-8"
                >
                  {currentStep === 5 ? 'تأكيد الحجز' : 'التالي'}
                </Button>
              )}
            </div>
          </form>
        </div>

        {/* Summary Sidebar for Desktop */}
        <div className="hidden lg:block sticky top-32">
          <Card className="p-6 bg-gradient-to-b from-white to-bg border border-border">
            <h3 className="font-bold text-xl mb-6 text-text flex items-center">
              <CalendarIcon className="mr-2 ml-2 text-primary" size={24} /> ملخص الحجز
            </h3>
            
            <div className="space-y-6">
              <div>
                <p className="text-sm font-medium text-muted mb-1">الخدمة المختارة</p>
                <p className="font-bold text-text">{selectedService?.name || '---'}</p>
              </div>
              
              <div>
                <p className="text-sm font-medium text-muted mb-1">الطبيب</p>
                <p className="font-bold text-text">{selectedDoctor?.name || '---'}</p>
              </div>
              
              <div>
                <p className="text-sm font-medium text-muted mb-1">الموعد</p>
                <p className="font-bold text-text">
                  {selectedDate ? dayjs(selectedDate).format('YYYY/MM/DD') : '---'} 
                  {selectedTime ? ` - ${selectedTime}` : ''}
                </p>
              </div>

              {selectedService?.price && selectedDoctor?.consultation_fee && (
                <div className="pt-4 border-t border-border mt-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-muted">سعر الخدمة</span>
                    <span className="font-medium">{selectedService.price} د.ع</span>
                  </div>
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-muted">رسوم الكشف</span>
                    <span className="font-medium">{selectedDoctor.consultation_fee} د.ع</span>
                  </div>
                  <div className="flex justify-between items-center text-lg font-bold text-primary-dark">
                    <span>الإجمالي التقديري</span>
                    <span>{selectedService.price + selectedDoctor.consultation_fee} د.ع</span>
                  </div>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
