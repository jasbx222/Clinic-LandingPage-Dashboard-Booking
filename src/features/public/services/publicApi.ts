import axios from "axios";

export const publicApi = axios.create({
  baseURL: "https://clinic-management-system-backend-main-9slmei.free.laravel.cloud/api",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

type ApiResponse<T> = {
  data: T;
};

export interface Service {
  id: number;
  name: string;
  description: string | null;
  price: number;
  duration_minutes: number;
}

export interface Doctor {
  id: number;
  name: string;
  specialty?: string;
  specialization?: string;
  consultation_fee: number;
  avatar_url?: string | null;
}

export interface TimeSlot {
  time: string;
  label: string;
  available: boolean;
}

export interface CreateAppointmentPayload {
  service_id: number;
  doctor_id: number | null;
  date: string;
  time: string;
  patient: {
    full_name: string;
    phone: string;
    gender?: "male" | "female";
    birth_date?: string;
    reason?: string;
    notes?: string;
    email?: string;
  };
}

export interface AppointmentResponse {
  appointment_id: number;
  booking_number: string;
  status: string;
  doctor_name: string;
  service_name: string;
  date: string;
  time: string;
}

const unwrapData = <T>(response: unknown): T => {
  const payload = response as ApiResponse<T> | T;
  return (payload as ApiResponse<T>).data ?? (payload as T);
};

export const fetchServices = async (): Promise<Service[]> => {
  const { data } = await publicApi.get<ApiResponse<Service[]> | Service[]>(
    "/public/services"
  );

  return unwrapData<Service[]>(data);
};

export const fetchDoctors = async (): Promise<Doctor[]> => {
  const { data } = await publicApi.get<ApiResponse<Doctor[]> | Doctor[]>(
    "/public/doctors"
  );

  return unwrapData<Doctor[]>(data);
};

export const fetchAvailableSlots = async (
  doctorId: string | number,
  serviceId: string | number,
  date: string
): Promise<TimeSlot[]> => {
  const { data } = await publicApi.get<ApiResponse<TimeSlot[]> | TimeSlot[]>(
    "/public/available-slots",
    {
      params: {
        doctor_id: doctorId,
        service_id: serviceId,
        date,
      },
    }
  );

  return unwrapData<TimeSlot[]>(data).filter((slot) => slot.available);
};

export const createAppointment = async (
  payload: CreateAppointmentPayload
): Promise<AppointmentResponse> => {
  const { data } = await publicApi.post<
    ApiResponse<AppointmentResponse> | AppointmentResponse
  >("/public/appointments", payload);

  return unwrapData<AppointmentResponse>(data);
};