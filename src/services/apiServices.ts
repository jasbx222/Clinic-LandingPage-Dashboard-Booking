import api from '../lib/axios';
import type { Patient, Appointment, Visit, Prescription, User, Invoice } from '../types';

export const patientService = {
  getAll: async (params?: any) => {
    const { data } = await api.get('/patients', { params });
    return data;
  },
  getById: async (id: number) => {
    const { data } = await api.get<{ data: Patient }>(`/patients/${id}`);
    return data.data;
  },
  create: async (payload: Partial<Patient>) => {
    const { data } = await api.post('/patients', payload);
    return data;
  },
  update: async (id: number, payload: Partial<Patient>) => {
    const { data } = await api.put(`/patients/${id}`, payload);
    return data;
  },
  delete: async (id: number) => {
    const { data } = await api.delete(`/patients/${id}`);
    return data;
  }
};

export const appointmentService = {
  getAll: async (params?: any) => {
    const { data } = await api.get('/appointments', { params });
    return data;
  },
  getById: async (id: number) => {
    const { data } = await api.get<{ data: Appointment }>(`/appointments/${id}`);
    return data.data;
  },
  create: async (payload: Partial<Appointment>) => {
    const { data } = await api.post('/appointments', payload);
    return data;
  },
  update: async (id: number, payload: Partial<Appointment>) => {
    const { data } = await api.put(`/appointments/${id}`, payload);
    return data;
  },
  updateStatus: async (id: number, status: string) => {
    // Both put to /appointments/{id} and post to /appointments/{id}/status work in the backend
    const { data } = await api.put(`/appointments/${id}`, { status });
    return data;
  },
  delete: async (id: number) => {
    const { data } = await api.delete(`/appointments/${id}`);
    return data;
  },
  arrive: async (id: number) => {
    const { data } = await api.post(`/appointments/${id}/arrive`);
    return data;
  }
};

export const visitService = {
  getAll: async (params?: any) => {
    const { data } = await api.get('/visits', { params });
    return data;
  },
  startVisit: async (payload: { appointment_id?: number; patient_id?: number; chief_complaint: string }) => {
    const { data } = await api.post<{ data: Visit }>('/visits', payload);
    return data.data;
  },
  updateVisit: async (id: number, payload: Partial<Visit>) => {
    const { data } = await api.put<{ data: Visit }>(`/visits/${id}`, payload);
    return data.data;
  },
  endVisit: async (id: number) => {
    const { data } = await api.post(`/visits/${id}/end`);
    return data;
  }
};

export const prescriptionService = {
  getAll: async (params?: any) => {
    const { data } = await api.get('/prescriptions', { params });
    return data;
  },
  create: async (payload: Partial<Prescription>) => {
    const { data } = await api.post('/prescriptions', payload);
    return data;
  },
  delete: async (id: number) => {
    const { data } = await api.delete(`/prescriptions/${id}`);
    return data;
  }
};

export const employeeService = {
  getAll: async () => {
    const { data } = await api.get('/employees');
    return data;
  },
  getById: async (id: number) => {
    const { data } = await api.get(`/employees/${id}`);
    return data;
  },
  create: async (payload: Partial<User>) => {
    const { data } = await api.post('/employees', payload);
    return data;
  },
  update: async (id: number, payload: Partial<User>) => {
    const { data } = await api.put(`/employees/${id}`, payload);
    return data;
  },
  delete: async (id: number) => {
    const { data } = await api.delete(`/employees/${id}`);
    return data;
  }
};

export const invoiceService = {
  getAll: async (params?: any) => {
    const { data } = await api.get('/invoices', { params });
    return data;
  },
  getById: async (id: number) => {
    const { data } = await api.get(`/invoices/${id}`);
    return data;
  },
  create: async (payload: Partial<Invoice>) => {
    const { data } = await api.post('/invoices', payload);
    return data;
  },
  update: async (id: number, payload: Partial<Invoice>) => {
    const { data } = await api.put(`/invoices/${id}`, payload);
    return data;
  },
  delete: async (id: number) => {
    const { data } = await api.delete(`/invoices/${id}`);
    return data;
  },
  print: async (id: number) => {
    // Typically a window.open to a print route or downloading a PDF
    window.open(`http://localhost:8000/api/invoices/${id}/print`, '_blank');
  }
};

export const dashboardService = {
  getStats: async () => {
    const { data } = await api.get('/dashboard/stats');
    return data;
  }
};
