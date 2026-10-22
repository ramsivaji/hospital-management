import { createContext, useContext, useEffect, useMemo, useState } from 'react';
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
        const doctorVisitTypes = new Set(appointments.map((appointment) => `${appointment.doctorId}:${appointment.status}`));
        const missingDoctorVisits = createInitialData().appointments.filter((appointment) =>
          doctors.some((doctor) => doctor.id === appointment.doctorId) && !doctorVisitTypes.has(`${appointment.doctorId}:${appointment.status}`),
        );
        if (dataChanged || missingDoctorVisits.length) {
          const upgraded = {
            ...parsed,
            appointments: [...appointments, ...missingDoctorVisits],
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
  useEffect(() => localStorage.setItem(DATA_KEY, JSON.stringify(data)), [data]);
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
