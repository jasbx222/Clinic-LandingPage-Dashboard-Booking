import { useQuery, useMutation } from '@tanstack/react-query';
import { publicApiService } from '../features/public/services/publicApiService';
import type { AppointmentPayload } from '../features/public/services/publicApiService';

export const usePublicClinic = () => {
  return useQuery({
    queryKey: ['public-clinic'],
    queryFn: publicApiService.getClinicInfo,
  });
};

export const usePublicServices = () => {
  return useQuery({
    queryKey: ['public-services'],
    queryFn: publicApiService.getServices,
  });
};

export const usePublicDoctors = () => {
  return useQuery({
    queryKey: ['public-doctors'],
    queryFn: publicApiService.getDoctors,
  });
};

export const useAvailableSlots = (doctorId: number | null, serviceId: number | null, date: string | null) => {
  return useQuery({
    queryKey: ['available-slots', doctorId, serviceId, date],
    queryFn: () => publicApiService.getAvailableSlots(doctorId!, serviceId!, date!),
    enabled: !!doctorId && !!serviceId && !!date, // Only run query if all 3 are selected
  });
};

export const useCreatePublicAppointment = () => {
  return useMutation({
    mutationFn: (payload: AppointmentPayload) => publicApiService.createAppointment(payload),
  });
};
