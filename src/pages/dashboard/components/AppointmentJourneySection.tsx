import React, { useState, useEffect, type JSX } from 'react';
import api from '../../../lib/axios';

interface JourneyEvent {
  id: number;
  event_type: string;
  note: string | null;
  created_at: string;
  created_by_name: string | null;
}

const eventIcons: Record<string, JSX.Element> = {
  booked: (
    <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
  ),
  checked_in: (
    <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
  ),
  waiting: (
    <svg className="w-5 h-5 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
  ),
  called: (
    <svg className="w-5 h-5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" /></svg>
  ),
  in_consultation: (
    <svg className="w-5 h-5 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
  ),
  billing: (
    <svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2zM10 8.5a.5.5 0 11-1 0 .5.5 0 011 0zm5 5a.5.5 0 11-1 0 .5.5 0 011 0z" /></svg>
  ),
  completed: (
    <svg className="w-5 h-5 text-teal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
  ),
  cancelled: (
    <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
  ),
  priority_changed: (
    <svg className="w-5 h-5 text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
  ),
};

const eventLabels: Record<string, string> = {
  booked: 'تم الحجز',
  checked_in: 'تأكيد الوصول',
  waiting: 'في الانتظار',
  called: 'تم النداء',
  in_consultation: 'في الاستشارة',
  billing: 'الحسابات',
  completed: 'مكتمل',
  cancelled: 'ملغي',
  skipped: 'تجاوز',
  priority_changed: 'تغيير الأولوية',
};

export default function AppointmentJourneySection({ appointmentId }: { appointmentId: number }) {
  const [events, setEvents] = useState<JourneyEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJourney = async () => {
      try {
        const response = await api.get(`/admin/appointments/${appointmentId}/journey`);
        setEvents(response.data.data);
      } catch (err) {
        console.error('Failed to fetch journey', err);
      } finally {
        setLoading(false);
      }
    };

    if (appointmentId) {
      fetchJourney();
    }
  }, [appointmentId]);

  if (loading) {
    return <div className="animate-pulse flex space-x-4"><div className="h-4 bg-gray-200 rounded w-3/4"></div></div>;
  }

  if (events.length === 0) {
    return <div className="text-sm text-gray-500">لا يوجد سجلات لهذه الرحلة حتى الآن.</div>;
  }

  return (
    <div className="flow-root">
      <ul role="list" className="-mb-8">
        {events.map((event, eventIdx) => (
          <li key={event.id}>
            <div className="relative pb-8">
              {eventIdx !== events.length - 1 ? (
                <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true" />
              ) : null}
              <div className="relative flex space-x-3 space-x-reverse">
                <div>
                  <span className="h-8 w-8 rounded-full bg-white flex items-center justify-center ring-8 ring-white">
                    {eventIcons[event.event_type] || (
                      <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    )}
                  </span>
                </div>
                <div className="flex min-w-0 flex-1 justify-between space-x-4 space-x-reverse pt-1.5">
                  <div>
                    <p className="text-sm text-gray-900 font-medium">
                      {eventLabels[event.event_type] || event.event_type}
                    </p>
                    {event.note && (
                      <p className="mt-1 text-sm text-gray-500">{event.note}</p>
                    )}
                  </div>
                  <div className="whitespace-nowrap text-right text-sm text-gray-500 flex flex-col items-end">
                    <span>{new Date(event.created_at).toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })}</span>
                    {event.created_by_name && (
                      <span className="text-xs mt-1 text-gray-400">{event.created_by_name}</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
