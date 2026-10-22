import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { createInitialData } from './data';

const DATA_KEY = 'carepoint-demo-data-v2';
const SESSION_KEY = 'carepoint-demo-session-v2';
const StoreContext = createContext(null);

function readData() {
  try {
    const saved = localStorage.getItem(DATA_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.appointments && parsed.prescriptions && parsed.followups && parsed.profile) return parsed;
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
