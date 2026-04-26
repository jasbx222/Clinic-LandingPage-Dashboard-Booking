import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { patientService, appointmentService, visitService, prescriptionService, employeeService, invoiceService } from '../services/apiServices';

// Patients
export const usePatients = (params?: any) => {
  return useQuery({
    queryKey: ['patients', params],
    queryFn: () => patientService.getAll(params),
  });
};

export const usePatient = (id: number) => {
  return useQuery({
    queryKey: ['patient', id],
    queryFn: () => patientService.getById(id),
    enabled: !!id,
  });
};

// Appointments
export const useAppointments = (params?: any) => {
  return useQuery({
    queryKey: ['appointments', params],
    queryFn: () => appointmentService.getAll(params),
  });
};

export const useUpdateAppointmentStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: number; status: string }) => appointmentService.updateStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
    },
  });
};

// Visits
export const useStartVisit = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: visitService.startVisit,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
    },
  });
};

export const useUpdateVisit = () => {
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: any }) => visitService.updateVisit(id, payload),
  });
};

export const useCreateVisit = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: any) => visitService.startVisit(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
      queryClient.invalidateQueries({ queryKey: ['patients'] });
    },
  });
};

export const useEndVisit = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: visitService.endVisit,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
    },
  });
};

// Prescriptions
export const useCreatePrescription = () => {
  return useMutation({
    mutationFn: prescriptionService.create,
  });
};

// Employees
export const useEmployees = () => {
  return useQuery({
    queryKey: ['employees'],
    queryFn: employeeService.getAll,
  });
};

export const useCreateEmployee = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: employeeService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
    },
  });
};

export const useUpdateEmployee = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: any }) => employeeService.update(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
    },
  });
};

export const useDeleteEmployee = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: employeeService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
    },
  });
};

// Invoices
export const useInvoices = (params?: any) => {
  return useQuery({
    queryKey: ['invoices', params],
    queryFn: () => invoiceService.getAll(params),
  });
};

export const useCreateInvoice = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: invoiceService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
    },
  });
};

export const useUpdateInvoice = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: any }) => invoiceService.update(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
    },
  });
};
