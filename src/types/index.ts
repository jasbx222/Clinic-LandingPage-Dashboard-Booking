export interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'receptionist' | 'doctor' | 'nurse' | 'accountant' | 'patient';
  phone?: string;
  is_active?: boolean;
  permissions?: { id: number; name: string }[];
}

export interface Patient {
  id: number;
  user_id: number;
  file_number: string;
  date_of_birth: string;
  gender: 'male' | 'female' | 'other';
  blood_group?: string;
  allergies?: string;
  chronic_diseases?: string;
  address?: string;
  user: User;
  visits?: Visit[];
  invoices?: Invoice[];
  prescriptions?: Prescription[];
}

export interface Doctor {
  id: number;
  user_id: number;
  specialization: string;
  consultation_fee: string;
  appointment_duration: number;
  user: User;
}

export interface Appointment {
  id: number;
  patient_id: number;
  doctor_id: number;
  appointment_date: string;
  appointment_time: string;
  status: 'pending' | 'confirmed' | 'arrived' | 'waiting' | 'in_consultation' | 'completed' | 'cancelled' | 'no_show';
  reason?: string;
  patient: Patient;
  doctor: User;
  service?: { id: number; name: string };
}

export interface Visit {
  id: number;
  appointment_id?: number;
  patient_id: number;
  doctor_id: number;
  start_time: string;
  end_time?: string;
  chief_complaint?: string;
  history?: string;
  examination?: string;
  diagnosis?: string;
  treatment_plan?: string;
  status: 'in_progress' | 'completed';
  patient?: Patient;
  doctor?: User;
}

export interface PrescriptionItem {
  id?: number;
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions?: string;
}

export interface Prescription {
  id: number;
  visit_id: number;
  notes?: string;
  items: PrescriptionItem[];
}

export interface Invoice {
  id: number;
  total: number;
  paid_amount: number;
  status: 'unpaid' | 'partially_paid' | 'paid' | 'cancelled';
}
