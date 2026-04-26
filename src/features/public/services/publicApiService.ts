import api from '../../../lib/axios';

export interface ClinicInfo {
  name: string;
  description: string;
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  working_hours: string;
  hero_title: string;
  hero_subtitle: string;
  logo_url: string | null;
}

export interface PublicService {
  id: number;
  name: string;
  description: string | null;
  price: string;
  duration_minutes: number;
  is_active: boolean;
}

export interface PublicDoctor {
  id: number;
  name: string;
  specialty: string;
  bio: string;
  consultation_fee: string;
  appointment_duration: number;
  image_url: string | null;
  is_active: boolean;
}

export interface AvailableSlot {
  time: string;
  label: string;
  available: boolean;
}

export interface AppointmentPayload {
  service_id: number;
  doctor_id: number;
  date: string;
  time: string;
  patient: {
    full_name: string;
    phone: string;
    gender: 'male' | 'female' | 'other';
    birth_date: string;
    reason?: string;
    notes?: string;
  };
}

export const publicApiService = {
  getClinicInfo: async (): Promise<ClinicInfo> => {
    const response = await api.get('/public/clinic');
    return response.data.data;
  },
  
  getServices: async (): Promise<PublicService[]> => {
    const response = await api.get('/public/services');
    return response.data.data;
  },

  getDoctors: async (): Promise<PublicDoctor[]> => {
    const response = await api.get('/public/doctors');
    return response.data.data;
  },

  getAvailableSlots: async (doctorId: number, serviceId: number, date: string): Promise<AvailableSlot[]> => {
    const response = await api.get('/public/available-slots', {
      params: { doctor_id: doctorId, service_id: serviceId, date }
    });
    return response.data.data;
  },

  createAppointment: async (payload: AppointmentPayload) => {
    const response = await api.post('/public/appointments', payload);
    return response.data.data;
  }
};
