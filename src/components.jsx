import { useState, createContext, useContext } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Activity, CalendarDays, ChevronRight, ClipboardList, Clock3, HeartPulse, Home, LogOut, Menu, Pill, RotateCcw, Search, Stethoscope, UserRound, Users, X } from 'lucide-react';
import { useStore } from './store';

const ToastContext = createContext(() => {});
export const useToast = () => useContext(ToastContext);
export function ToastProvider({ children }) {
  const [message, setMessage] = useState('');
  const notify = (text) => { setMessage(text); window.clearTimeout(notify.timer); notify.timer = window.setTimeout(() => setMessage(''), 2800); };
  return <ToastContext.Provider value={notify}>{children}{message && <div className="toast"><span className="toast-check">✓</span>{message}</div>}</ToastContext.Provider>;
}

const patientNav = [
  { to: '/patient', label: 'Dashboard', icon: Home, end: true },
  { to: '/patient/doctors', label: 'Find doctors', icon: Stethoscope },
  { to: '/patient/book', label: 'Book appointment', icon: CalendarDays },
  { to: '/patient/appointments', label: 'My appointments', icon: ClipboardList },
  { to: '/patient/prescriptions', label: 'My prescriptions', icon: Pill },
  { to: '/patient/follow-ups', label: 'Follow-up visits', icon: RotateCcw },
  { to: '/patient/profile', label: 'My profile', icon: UserRound },
];
const doctorNav = [
  { to: '/doctor', label: 'Dashboard', icon: Home, end: true },
  { to: '/doctor/today', label: "Today's appointments", icon: CalendarDays },
  { to: '/doctor/appointments', label: 'All appointments', icon: ClipboardList },
  { to: '/doctor/patients', label: 'My patients', icon: Users },
  { to: '/doctor/prescriptions', label: 'Prescriptions', icon: Pill },
  { to: '/doctor/follow-ups', label: 'Follow-up visits', icon: RotateCcw },
  { to: '/doctor/profile', label: 'My profile', icon: UserRound },
];

export function Brand({ light = false }) { return <Link className={`brand ${light ? 'brand-light-mode' : ''}`} to="/"><span className="brand-symbol"><HeartPulse size={20} strokeWidth={2.4} /></span><span>care<span>point</span></span></Link>; }

export function PortalLayout({ role, children }) {
  const { session, setSession, resetData } = useStore();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const nav = role === 'doctor' ? doctorNav : patientNav;
  const logout = () => { setSession(null); navigate('/'); };
  const reset = () => { if (window.confirm('Restore the original fictional demo data? Your current browser demo changes will be removed.')) { resetData(); window.location.reload(); } };
  return <ToastProvider><div className="portal-shell">
    <button className={`mobile-scrim ${open ? 'visible' : ''}`} aria-label="Close menu" onClick={() => setOpen(false)} />
    <aside className={`sidebar ${open ? 'sidebar-open' : ''}`}>
      <Brand /><div className="workspace-label">{role === 'doctor' ? 'CLINIC WORKSPACE' : 'PATIENT SPACE'}</div>
      <nav className="side-nav">{nav.map(({ to, label, icon: Icon, end }) => <NavLink key={to} end={end} to={to} onClick={() => setOpen(false)} className={({ isActive }) => `side-link ${isActive ? 'active' : ''}`}><Icon size={17} strokeWidth={1.8} /><span>{label}</span>{label === 'Book appointment' && <ChevronRight size={14} className="nav-arrow" />}</NavLink>)}</nav>
      <div className="sidebar-bottom"><div className="demo-note"><span className="demo-note-icon"><Activity size={15} /></span><div><strong>Demo environment</strong><p>Fictional sample data, saved in this browser.</p></div></div><button className="side-link reset-link" onClick={reset}><RotateCcw size={16} /><span>Reset demo data</span></button><button className="side-link logout-link" onClick={logout}><LogOut size={16} /><span>Log out</span></button><div className="side-user"><div className={`avatar ${role === 'doctor' ? 'avatar-teal' : 'avatar-lilac'}`}>{role === 'doctor' ? 'OC' : 'JR'}</div><div className="side-user-name"><strong>{session?.name}</strong><span>{role === 'doctor' ? 'Cardiology' : 'Patient account'}</span></div><span className="user-dot" /></div></div>
    </aside>
    <main className="portal-main"><header className="portal-topbar"><button className="mobile-menu" onClick={() => setOpen(true)} aria-label="Open navigation"><Menu size={20} /></button><div className="top-location"><span className="location-mark"><HeartPulse size={15} /></span>CarePoint <span className="crumb-slash">/</span><strong>{role === 'doctor' ? 'Doctor portal' : 'Patient portal'}</strong></div><div className="topbar-right"><span className="secure-chip"><span /> Demo mode</span><div className="top-avatar">{role === 'doctor' ? 'OC' : 'JR'}</div></div></header><div className="page-wrap">{children}</div><footer className="portal-footer"><span>CarePoint fictional portfolio demo</span><span>For demonstration only · Do not enter real health information</span></footer></main>
  </div></ToastProvider>;
}

export function PageHeader({ eyebrow, title, description, action }) {
  return <div className="page-heading"><div><div className="eyebrow">{eyebrow}</div><h1>{title}</h1>{description && <p>{description}</p>}</div>{action && <div className="heading-action">{action}</div>}</div>;
}

export function Button({ children, className = '', variant = 'primary', ...props }) { return <button className={`button button-${variant} ${className}`} {...props}>{children}</button>; }

export function Avatar({ initials, tone = 'lilac', size = '' }) { return <div className={`avatar avatar-${tone} ${size ? `avatar-${size}` : ''}`}>{initials}</div>; }

export function StatCard({ label, value, detail, icon: Icon, tone = 'blue' }) { return <article className="stat-card"><div className="stat-card-top"><span>{label}</span><span className={`stat-icon stat-${tone}`}><Icon size={18} strokeWidth={1.8} /></span></div><strong>{value}</strong><p>{detail}</p></article>; }

export function SectionTitle({ title, detail, link }) { return <div className="section-title"><div><h2>{title}</h2>{detail && <p>{detail}</p>}</div>{link}</div>; }

export function EmptyState({ icon: Icon = Search, title, detail, action }) { return <div className="empty-state"><span className="empty-icon"><Icon size={22} /></span><strong>{title}</strong><p>{detail}</p>{action}</div>; }

export function StatusBadge({ status }) { const normalized = (status || 'Upcoming').toLowerCase(); return <span className={`status-badge status-${normalized.replaceAll(' ', '-')}`}><i />{status}</span>; }

export function DoctorCard({ doctor, action }) { return <article className="doctor-card"><div className="doctor-card-top"><Avatar initials={doctor.initials} tone={doctor.tone} size="large" /><span className="doctor-rating">★ {doctor.rating}</span></div><div className="doctor-details"><span className="specialty-label">{doctor.specialty}</span><h3>{doctor.name}</h3><p>{doctor.title}</p><div className="doctor-meta"><span><Stethoscope size={14} /> {doctor.experience} years experience</span><span><CalendarDays size={14} /> {doctor.days}</span><span><Clock3 size={14} /> {doctor.slots.slice(0, 3).map(formatTime).join(' · ')} slots</span></div><div className="doctor-card-bottom"><div><span>Consultation</span><strong>${doctor.fee}</strong></div>{action}</div></div></article>; }

export function SearchField({ value, onChange, placeholder = 'Search...' }) { return <label className="search-field"><Search size={16} /><input value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} /></label>; }

export function Tabs({ items, value, onChange }) { return <div className="tabs" role="tablist">{items.map((item) => <button key={item} className={value === item ? 'selected' : ''} role="tab" aria-selected={value === item} onClick={() => onChange(item)}>{item}</button>)}</div>; }

export function AppointmentTable({ appointments, onComplete, onCancel, onPrescription, compact = false }) {
  if (!appointments.length) return null;
  return <div className="table-scroll"><table className={`data-table ${compact ? 'compact-table' : ''}`}><thead><tr><th>Patient</th><th>Visit</th><th>Date & time</th><th>Reason</th><th>Status</th><th>Action</th></tr></thead><tbody>{appointments.map((apt) => <tr key={apt.id}><td><div className="table-person"><Avatar initials={apt.patientName.split(' ').map(x => x[0]).slice(0, 2).join('')} tone="lilac" /><span><strong>{apt.patientName}</strong><small>{apt.patientEmail}</small></span></div></td><td><strong>{apt.doctorName}</strong><small>{apt.specialty}</small></td><td><strong>{new Date(`${apt.date}T12:00:00`).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</strong><small>{formatTime(apt.time)}</small></td><td className="reason-cell">{apt.reason || '—'}</td><td><StatusBadge status={apt.status} /></td><td><div className="row-actions">{apt.status === 'Upcoming' && onComplete && <button className="table-action" onClick={() => onComplete(apt)} title="Mark completed">Complete</button>}{apt.status === 'Upcoming' && onCancel && <button className="table-action danger-action" onClick={() => onCancel(apt)} title="Cancel appointment">Cancel</button>}{apt.status === 'Completed' && onPrescription && <button className="table-action" onClick={() => onPrescription(apt)}>Prescription</button>}</div></td></tr>)}</tbody></table></div>;
}

export function formatTime(value) { if (!value) return '—'; const [hour, minute] = value.split(':').map(Number); return `${hour % 12 || 12}:${String(minute).padStart(2, '0')} ${hour >= 12 ? 'PM' : 'AM'}`; }

export function Modal({ title, eyebrow, onClose, children, wide = false }) { return <div className="modal-layer" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose()}><section className={`modal ${wide ? 'modal-wide' : ''}`} role="dialog" aria-modal="true" aria-label={title}><header className="modal-head"><div><span className="eyebrow">{eyebrow}</span><h2>{title}</h2></div><button className="icon-button" onClick={onClose} aria-label="Close"><X size={19} /></button></header>{children}</section></div>; }
