import { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { createInitialData, doctors } from './data';

const DATA_KEY = 'carepoint-demo-data-v2';
const SESSION_KEY = 'carepoint-demo-session-v2';
const StoreContext = createContext(null);

function readData() {
  try {
    const saved = localStorage.getItem(DATA_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.appointments && parsed.prescriptions && parsed.followups && parsed.profile) {
        const existingPatients = {
          'apt-demo-08': { name: 'Riley Chen', email: 'riley@demo.com' },
          'apt-demo-09': { name: 'Morgan Lee', email: 'morgan@demo.com' },
          'apt-demo-12': { name: 'Riley Chen', email: 'riley@demo.com' },
          'apt-demo-13': { name: 'Morgan Lee', email: 'morgan@demo.com' },
        };
        const withExistingPatientNames = (record) => {
          const patient = existingPatients[record.appointmentId || record.id];
          if (!patient || (record.patientName === patient.name && record.patientEmail === patient.email)) return record;
          return {
            ...record,
            patientName: patient.name,
            patientEmail: patient.email,
            patientId: patient.email === 'patient@demo.com' ? 'patient-demo' : `patient-${patient.email.replace(/[^a-z0-9]/gi, '-')}`,
          };
        };
        const appointments = parsed.appointments.map(withExistingPatientNames);
        const prescriptions = parsed.prescriptions.map(withExistingPatientNames);
        const followups = parsed.followups.map(withExistingPatientNames);
        const dataChanged = appointments.some((appointment, index) => appointment !== parsed.appointments[index])
          || prescriptions.some((prescription, index) => prescription !== parsed.prescriptions[index])
          || followups.some((followup, index) => followup !== parsed.followups[index]);
        const initialAppointments = createInitialData().appointments;
        const doctorVisitTypes = new Set(appointments.map((appointment) => `${appointment.doctorId}:${appointment.status}`));
        const missingDoctorVisits = initialAppointments.filter((appointment) =>
          doctors.some((doctor) => doctor.id === appointment.doctorId) && !doctorVisitTypes.has(`${appointment.doctorId}:${appointment.status}`),
        );
        const appointmentIds = new Set(appointments.map((appointment) => appointment.id));
        const missingDemoPatients = initialAppointments.filter((appointment) =>
          /^apt-demo-(1[5-9]|20)$/.test(appointment.id) && !appointmentIds.has(appointment.id),
        );
        if (dataChanged || missingDoctorVisits.length || missingDemoPatients.length) {
          const upgraded = {
            ...parsed,
            appointments: [...appointments, ...missingDoctorVisits, ...missingDemoPatients],
            prescriptions,
            followups,
          };
          localStorage.setItem(DATA_KEY, JSON.stringify(upgraded));
          return upgraded;
        }
        return parsed;
      }
    }
  } catch { /* start with the sample set if browser data is malformed */ }
  const initial = createInitialData();
  localStorage.setItem(DATA_KEY, JSON.stringify(initial));
  return initial;
}

function readSession() {
  try { return JSON.parse(localStorage.getItem(SESSION_KEY) || 'null'); }
  catch { return null; }
}

export function StoreProvider({ children }) {
  const [data, setData] = useState(readData);
  const [session, setSession] = useState(readSession);
  const lastSavedData = useRef(null);
  useEffect(() => {
    const serialized = JSON.stringify(data);
    if (serialized === lastSavedData.current) return;
    localStorage.setItem(DATA_KEY, serialized);
    lastSavedData.current = serialized;
  }, [data]);
  useEffect(() => {
    const syncData = (event) => {
      if (event.key !== DATA_KEY) return;
      if (event.newValue === null) {
        lastSavedData.current = null;
        setData(createInitialData());
        return;
      }
      try {
        const incoming = JSON.parse(event.newValue);
        if (incoming.appointments && incoming.prescriptions && incoming.followups && incoming.profile) {
          lastSavedData.current = event.newValue;
          setData(incoming);
        }
      } catch { /* ignore malformed updates from another tab */ }
    };
    window.addEventListener('storage', syncData);
    return () => window.removeEventListener('storage', syncData);
  }, []);
  useEffect(() => {
    if (session) localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    else localStorage.removeItem(SESSION_KEY);
  }, [session]);

  const value = useMemo(() => ({
    data, setData, session, setSession,
    resetData() { const initial = createInitialData(); setData(initial); localStorage.setItem(DATA_KEY, JSON.stringify(initial)); },
  }), [data, session]);
  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const value = useContext(StoreContext);
  if (!value) throw new Error('useStore must be used inside StoreProvider');
  return value;
}
