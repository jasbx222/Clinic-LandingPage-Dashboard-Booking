import { http, HttpResponse } from 'msw';

export const handlers = [
  // Mock Login Success
  http.post('http://localhost:8000/api/login', async ({ request }) => {
    const body = await request.json() as any;
    
    if (body.email === 'admin@clinic.com' && body.password === 'password') {
      return HttpResponse.json({
        access_token: 'fake-jwt-token',
        user: { id: 1, name: 'Admin User', email: 'admin@clinic.com', role: 'admin' }
      }, { status: 200 });
    }

    return HttpResponse.json({ message: 'بيانات الدخول غير صحيحة' }, { status: 401 });
  }),

  // Mock Fetch Patients
  http.get('http://localhost:8000/api/patients', () => {
    return HttpResponse.json({
      data: [
        { id: 1, file_number: 'PT-1001', user: { name: 'John Doe', phone: '0501234567' } }
      ]
    });
  }),
];
