import { useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Activity, ArrowRight, CalendarDays, Check, Clock3, FileText, HeartPulse, Plus, Search, ShieldCheck, Stethoscope, UserRound, Users, X } from 'lucide-react';
import { Avatar, Button, DoctorCard, EmptyState, formatTime, Modal, PageHeader, SearchField, SectionTitle, StatCard, StatusBadge, Tabs, useToast } from '../components';
import { dateOffset, doctors } from '../data';
import { useStore } from '../store';

const fmtDate = (date) => date ? new Date(`${date}T12:00:00`).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : '—';
const patientAppointments = (data, email) => data.appointments.filter((apt) => apt.patientEmail === email);
const upcomingFor = (data, email) => patientAppointments(data, email).filter((apt) => apt.status === 'Upcoming' && apt.date >= dateOffset(0)).sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time));
function nextAvailableDate(doctor, desiredDate) {
  const date = new Date(`${desiredDate}T12:00:00`);
  for (let day = 0; day < 14; day++) {
    if (!doctor || doctor.weekdays.includes(date.getDay())) return date.toISOString().slice(0, 10);
    date.setDate(date.getDate() + 1);
  }
  return desiredDate;
}

function PatientAppointmentCard({ appointment, onCancel }) {
  const doctor = doctors.find((item) => item.id === appointment.doctorId);
  return <article className="patient-appointment-card"><div className="appointment-date-tile"><span>{new Date(`${appointment.date}T12:00:00`).toLocaleDateString(undefined,{month:'short'})}</span><strong>{new Date(`${appointment.date}T12:00:00`).getDate()}</strong><small>{new Date(`${appointment.date}T12:00:00`).toLocaleDateString(undefined,{weekday:'short'})}</small></div><div className="patient-appointment-main"><div className="appointment-doctor-line"><Avatar initials={doctor?.initials || 'DR'} tone={doctor?.tone || 'lilac'} /><div><strong>{appointment.doctorName}</strong><span>{appointment.specialty}</span></div><StatusBadge status={appointment.status}/></div><p>{appointment.reason || 'Consultation'}</p><div className="appointment-bottom"><span><Clock3 size={14}/>{formatTime(appointment.time)}</span><span><Stethoscope size={14}/>CarePoint Clinic</span>{onCancel&&<button className="cancel-inline" onClick={()=>onCancel(appointment)}>Cancel visit</button>}</div></div></article>;
}

export function PatientDashboard() {
  const { data, session } = useStore();
  const navigate = useNavigate();
  const visits = patientAppointments(data, session.email);
  const upcoming = upcomingFor(data, session.email);
  const completed = visits.filter((apt) => apt.status === 'Completed').length;
  const rxCount = data.prescriptions.filter((rx) => rx.patientEmail === session.email).length;
  const followups = data.followups.filter((item) => item.patientEmail === session.email && item.status !== 'Booked').length;
  return <><PageHeader eyebrow="PATIENT SPACE · OVERVIEW" title={`Good morning, ${session.name.split(' ')[0]}.`} description="Here’s a little snapshot of your care, all in one place." action={<Button onClick={()=>navigate('/patient/book')}><Plus size={16}/> Book an appointment</Button>}/>
    <div className="welcome-banner"><div className="welcome-mark"><HeartPulse size={22}/></div><div><span>YOUR HEALTH, AT YOUR PACE</span><strong>A little care goes a long way.</strong><p>Your care team is here to help you feel your best.</p></div><div className="welcome-decoration">✳</div></div>
    <div className="stats-grid">{[["Upcoming appointments",upcoming.length,'On your calendar',CalendarDays,'blue'],['Completed visits',completed,'Your care journey',Check,'mint'],['Available doctors',doctors.length,'Across 6 specialties',Stethoscope,'lilac'],['Follow-up visits',followups,'Recommended by your doctor',Activity,'peach']].map(([label,value,detail,Icon,tone])=><StatCard key={label} label={label} value={value} detail={detail} icon={Icon} tone={tone}/>)}</div>
    <div className="two-column dashboard-columns"><section className="panel appointments-panel"><SectionTitle title="Your next visits" detail="Appointments coming up" link={<button className="plain-link" onClick={()=>navigate('/patient/appointments')}>All appointments <ArrowRight size={14}/></button>}/>{upcoming.length?upcoming.slice(0,3).map((apt)=><PatientAppointmentCard key={apt.id} appointment={apt}/>):<EmptyState icon={CalendarDays} title="Nothing on the calendar" detail="Whenever you're ready, book a visit with one of our specialists." action={<Button variant="soft" onClick={()=>navigate('/patient/book')}>Find a time</Button>}/>}</section>
      <div className="dashboard-side-stack"><section className="wellness-card"><div className="wellness-icon"><ShieldCheck size={19}/></div><span className="eyebrow">A GENTLE REMINDER</span><h3>Make space for your wellbeing.</h3><p>Small steps can make a meaningful difference. Your care team is always here if you need us.</p><button onClick={()=>navigate('/patient/doctors')}>Meet your care team <ArrowRight size={14}/></button><div className="wellness-plant">✿</div></section><section className="quick-links-panel"><SectionTitle title="Your care"/><button onClick={()=>navigate('/patient/prescriptions')}><span className="quick-icon lilac-bg"><FileText size={16}/></span><span><strong>Prescriptions</strong><small>{rxCount} available</small></span><ArrowRight size={15}/></button><button onClick={()=>navigate('/patient/follow-ups')}><span className="quick-icon mint-bg"><Activity size={16}/></span><span><strong>Follow-up visits</strong><small>{followups} recommended</small></span><ArrowRight size={15}/></button></section></div></div>
  </>;
}

export function DoctorDirectory() {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [specialty, setSpecialty] = useState('All specialties');
  const specialties = ['All specialties', ...new Set(doctors.map((doc)=>doc.specialty))];
  const filtered = doctors.filter((doc)=>(specialty==='All specialties'||doc.specialty===specialty)&&`${doc.name} ${doc.specialty} ${doc.title}`.toLowerCase().includes(query.toLowerCase()));
  return <><PageHeader eyebrow="YOUR CARE TEAM" title="Find a doctor" description="Meet experienced specialists who are here to help you feel your best."/><div className="doctor-directory-toolbar"><SearchField value={query} onChange={setQuery} placeholder="Search doctors or specialties"/><label className="select-wrap"><span>Specialty</span><select value={specialty} onChange={(e)=>setSpecialty(e.target.value)}>{specialties.map((item)=><option key={item}>{item}</option>)}</select></label><span className="results-count">{filtered.length} specialists</span></div>{filtered.length?<div className="doctor-grid">{filtered.map((doc)=><DoctorCard key={doc.id} doctor={doc} action={<Button variant="soft" onClick={()=>navigate(`/patient/book?doctor=${doc.id}`)}>Book visit <ArrowRight size={14}/></Button>}/>)}</div>:<EmptyState icon={Search} title="No doctors found" detail="Try another name or choose a different specialty."/>}</>;
}

export function BookingPage() {
  const { data, setData, session } = useStore();
  const toast = useToast();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const followupId = params.get('followup');
  const followup = data.followups.find((item)=>item.id===followupId);
  const initialDoctorId = params.get('doctor') || followup?.doctorId || '';
  const [doctorId, setDoctorId] = useState(initialDoctorId);
  const [date, setDate] = useState(() => nextAvailableDate(doctors.find((doc)=>doc.id===initialDoctorId),followup?.nextDate && followup.nextDate>=dateOffset(0) ? followup.nextDate : dateOffset(1)));
  const [time, setTime] = useState('');
  const [reason, setReason] = useState(followup ? `Follow-up visit · ${followup.summary}` : '');
  const selectedDoctor = doctors.find((doc)=>doc.id===doctorId);
  const booked = data.appointments.filter((apt)=>apt.doctorId===doctorId&&apt.date===date&&apt.status!=='Cancelled').map((apt)=>apt.time);
  const availableWeekday = selectedDoctor?.weekdays.includes(new Date(`${date}T12:00:00`).getDay());
  const slots = selectedDoctor && availableWeekday ? selectedDoctor.slots.filter((slot)=>!booked.includes(slot)) : [];
  const submit = (event) => {
    event.preventDefault();
    if (!selectedDoctor || !date || !time || !reason.trim()) { toast('Please complete each step to book your visit.'); return; }
    if (!availableWeekday) { toast('That doctor is not available on this day. Choose another date.'); return; }
    if (data.appointments.some((apt)=>apt.doctorId===doctorId&&apt.date===date&&apt.time===time&&apt.status!=='Cancelled')) { toast('That appointment time has just been booked. Please choose another.'); setTime(''); return; }
    const appointment = { id:`apt-${Date.now()}`, patientId:session.id, patientName:data.profile.name, patientEmail:session.email, doctorId, doctorName:selectedDoctor.name, specialty:selectedDoctor.specialty, date, time, reason:reason.trim(), status:'Upcoming', createdAt:new Date().toISOString(), followupId:followupId||null };
    setData((previous)=>({ ...previous, appointments:[appointment,...previous.appointments], followups:followupId?previous.followups.map((item)=>item.id===followupId?{...item,status:'Booked',bookedAppointmentId:appointment.id}:item):previous.followups }));
    toast('Your appointment is confirmed. See you soon!');
    navigate('/patient/appointments');
  };
  return <><PageHeader eyebrow="SCHEDULE YOUR VISIT" title={followup?'Book your follow-up':'Book an appointment'} description="Choose your specialist, a convenient time, and we’ll take care of the rest."/><form className="booking-layout" onSubmit={submit}><div className="booking-main"><section className="panel booking-step"><div className="step-heading"><span>01</span><div><h2>Choose your doctor</h2><p>Pick the specialist who feels right for you.</p></div></div><div className="booking-doctor-grid">{doctors.map((doc)=><button type="button" key={doc.id} className={`booking-doctor-option ${doctorId===doc.id?'selected':''}`} onClick={()=>{setDoctorId(doc.id);setDate((current)=>nextAvailableDate(doc,current<dateOffset(0)?dateOffset(1):current));setTime('')}}><Avatar initials={doc.initials} tone={doc.tone}/><span><strong>{doc.name}</strong><small>{doc.specialty}</small></span>{doctorId===doc.id&&<Check size={16} className="selected-check"/>}</button>)}</div></section>
    <section className="panel booking-step"><div className="step-heading"><span>02</span><div><h2>Pick a date and time</h2><p>{selectedDoctor?`${selectedDoctor.days} · Please choose a time that works for you.`:'Select a doctor to see their available slots.'}</p></div></div><label className="field-label booking-date-label">Appointment date<input type="date" min={dateOffset(0)} value={date} onChange={(e)=>{setDate(e.target.value);setTime('')}} required/></label>{selectedDoctor&&<><span className="field-label">Available times <span className="field-hint">Local clinic time</span></span><div className="time-slot-grid">{slots.length?slots.map((slot)=><button type="button" key={slot} className={`time-slot ${time===slot?'chosen':''}`} onClick={()=>setTime(slot)}>{formatTime(slot)}</button>):<span className="no-slots">{!availableWeekday?'This doctor is not available that day. Choose another date.':'No open times for this day. Try another date.'}</span>}</div></>}</section>
    <section className="panel booking-step"><div className="step-heading"><span>03</span><div><h2>A note for your doctor</h2><p>What would you like help with during this visit?</p></div></div><label className="field-label">Reason for visit<textarea rows="4" maxLength="500" value={reason} onChange={(e)=>setReason(e.target.value)} placeholder="A few words about what brings you in..." required/></label><div className="character-note">Your information is saved in this browser demo only.</div></section></div>
    <aside className="booking-summary panel"><span className="summary-icon"><CalendarDays size={19}/></span><span className="eyebrow">YOUR VISIT</span><h2>Appointment summary</h2><p>Review your visit details before confirming.</p>{selectedDoctor?<><div className="summary-doctor"><Avatar initials={selectedDoctor.initials} tone={selectedDoctor.tone}/><span><strong>{selectedDoctor.name}</strong><small>{selectedDoctor.specialty}</small></span></div><div className="summary-line"><span><CalendarDays size={15}/> Date</span><strong>{fmtDate(date)}</strong></div><div className="summary-line"><span><Clock3 size={15}/> Time</span><strong>{time?formatTime(time):'Choose a time'}</strong></div><div className="summary-line"><span><HeartPulse size={15}/> Visit</span><strong>{followup?'Follow-up consultation':'New consultation'}</strong></div><div className="summary-fee"><span>Consultation fee</span><strong>${selectedDoctor.fee}</strong></div><Button type="submit" className="summary-submit">Confirm appointment <ArrowRight size={15}/></Button><div className="summary-safe"><ShieldCheck size={15}/> Demo booking · no payment collected</div></>:<div className="summary-placeholder">Select a specialist to see your visit summary.</div>}</aside></form></>;
}

export function PatientAppointments() {
  const { data, setData, session } = useStore();
  const [tab, setTab] = useState('Upcoming');
  const toast = useToast();
  const navigate = useNavigate();
  const all = patientAppointments(data, session.email);
  const shown = all.filter((apt)=>tab==='Upcoming'?apt.status==='Upcoming'&&apt.date>=dateOffset(0):tab==='Past'?apt.status==='Completed'||(apt.status==='Upcoming'&&apt.date<dateOffset(0)):apt.status==='Cancelled').sort((a,b)=>(tab==='Upcoming'?1:-1)*(a.date+a.time).localeCompare(b.date+b.time));
  const cancel = (apt) => { if(!window.confirm(`Cancel your appointment with ${apt.doctorName}?`)) return;setData((prev)=>({...prev,appointments:prev.appointments.map((item)=>item.id===apt.id?{...item,status:'Cancelled'}:item)}));toast('Your appointment was cancelled.'); };
  return <><PageHeader eyebrow="YOUR CARE, AT A GLANCE" title="My appointments" description="Keep track of upcoming visits and your recent care." action={<Button onClick={()=>navigate('/patient/book')}><CalendarDays size={16}/> Book a visit</Button>}/><Tabs items={['Upcoming','Past','Cancelled']} value={tab} onChange={setTab}/><div className="patient-appointment-list">{shown.length?shown.map((apt)=><PatientAppointmentCard key={apt.id} appointment={apt} onCancel={tab==='Upcoming'?cancel:null}/>):<EmptyState icon={CalendarDays} title={`No ${tab.toLowerCase()} visits`} detail={tab==='Upcoming'?'Your next appointment will appear here after you book.':'Your appointment history will show up here.'} action={tab==='Upcoming'?<Button variant="soft" onClick={()=>navigate('/patient/doctors')}>Find a doctor</Button>:null}/>}</div></>;
}

function escapeText(text=''){return String(text).replace(/[&<>"']/g,(ch)=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));}
function printPrescription(rx){const popup=window.open('','_blank','width=760,height=850');if(!popup)return;popup.document.write(`<html><head><title>Prescription · CarePoint</title><style>body{font:15px Arial,sans-serif;color:#24324a;padding:40px;max-width:700px;margin:auto}header{display:flex;justify-content:space-between;border-bottom:2px solid #6072d9;padding-bottom:18px}h1{font-size:25px}h2{font-size:17px;margin-top:30px}p,li{line-height:1.7;color:#526077}.rx{border:1px solid #dfe4ed;border-radius:10px;padding:18px;margin:12px 0}.fine{font-size:11px;color:#8994a5;margin-top:35px}</style></head><body><header><div><h1>CarePoint</h1><span>Fictional healthcare demo</span></div><div>${escapeText(fmtDate(rx.consultationDate))}</div></header><h2>Prescription for ${escapeText(rx.patientName)}</h2><p>Prescribed by ${escapeText(rx.doctorName)} · ${escapeText(rx.diagnosis)}</p>${rx.medicines.map(m=>`<div class="rx"><strong>${escapeText(m.name)} — ${escapeText(m.dosage)}</strong><p>${escapeText(m.frequency)} · ${escapeText(m.duration)}</p></div>`).join('')}<p><strong>Instructions:</strong> ${escapeText(rx.instructions)}</p><p><strong>Recommended follow-up:</strong> ${escapeText(fmtDate(rx.followUpDate))}</p><p class="fine">Fictional sample data for portfolio demonstration only. Not a medical document.</p><script>window.print()</script></body></html>`);popup.document.close();}

export function PatientPrescriptions() {
  const { data, session } = useStore();
  const [selected, setSelected] = useState(null);
  const prescriptions = data.prescriptions.filter((rx)=>rx.patientEmail===session.email).sort((a,b)=>b.consultationDate.localeCompare(a.consultationDate));
  return <><PageHeader eyebrow="YOUR CARE RECORDS" title="My prescriptions" description="Your care notes and medicines, together in one place."/>{prescriptions.length?<div className="prescription-list">{prescriptions.map((rx)=><article className="prescription-card" key={rx.id}><div className="rx-card-icon"><FileText size={20}/></div><div className="rx-card-main"><span className="eyebrow">CONSULTATION · {fmtDate(rx.consultationDate)}</span><h3>{rx.diagnosis}</h3><p>Prescribed by {rx.doctorName} · {rx.medicines.length} {rx.medicines.length===1?'medicine':'medicines'}</p><div className="rx-medicine-preview">{rx.medicines.slice(0,2).map((med)=><span key={med.name}><i/> {med.name}</span>)}</div></div><div className="rx-card-actions"><Button variant="soft" onClick={()=>setSelected(rx)}>View prescription <ArrowRight size={14}/></Button><span>Follow-up {fmtDate(rx.followUpDate)}</span></div></article>)}</div>:<EmptyState icon={FileText} title="No prescriptions yet" detail="Your doctor’s recommendations will appear here after your visit."/>}{selected&&<Modal title="Prescription details" eyebrow="YOUR CARE RECORD" onClose={()=>setSelected(null)}><div className="prescription-detail"><div className="rx-detail-summary"><span className="rx-card-icon"><FileText size={19}/></span><div><strong>{selected.diagnosis}</strong><small>{fmtDate(selected.consultationDate)} · {selected.doctorName}</small></div></div><span className="field-label">MEDICINES</span>{selected.medicines.map((med,i)=><div className="medicine-detail" key={`${med.name}-${i}`}><span className="medicine-number">0{i+1}</span><div><strong>{med.name} <small>{med.dosage}</small></strong><p>{med.frequency} · {med.duration}</p></div></div>)}<div className="rx-instructions"><span>DOCTOR'S INSTRUCTIONS</span><p>{selected.instructions||'No additional instructions.'}</p></div><div className="rx-followdate"><CalendarDays size={15}/> Recommended follow-up <strong>{fmtDate(selected.followUpDate)}</strong></div><div className="modal-actions"><Button variant="outline" onClick={()=>printPrescription(selected)}>Print prescription</Button><Button onClick={()=>setSelected(null)}>Done</Button></div></div></Modal>}</>;
}

export function PatientFollowups() {
  const { data, session } = useStore();
  const navigate = useNavigate();
  const list = data.followups.filter((item)=>item.patientEmail===session.email).sort((a,b)=>a.nextDate.localeCompare(b.nextDate));
  return <><PageHeader eyebrow="A LITTLE CONTINUITY OF CARE" title="Follow-up visits" description="Your doctor’s next-step recommendations and check-ins."/>{list.length?<div className="followup-list">{list.map((item)=><article className="followup-card" key={item.id}><div className="followup-card-head"><span className="followup-icon"><Activity size={18}/></span><StatusBadge status={item.status}/></div><span className="eyebrow">RECOMMENDED FOLLOW-UP</span><h3>{item.doctorName}</h3><p className="followup-specialty">{doctors.find((doc)=>doc.id===item.doctorId)?.specialty || 'Care team'}</p><div className="followup-dates"><div><span>Previous visit</span><strong>{fmtDate(item.previousDate)}</strong></div><ArrowRight size={16}/><div><span>Recommended next visit</span><strong>{fmtDate(item.nextDate)}</strong></div></div><div className="followup-note"><strong>Visit summary</strong><p>{item.summary}</p></div><div className="followup-note"><strong>Doctor’s instructions</strong><p>{item.instructions}</p></div>{item.status==='Booked'?<div className="booked-confirmation"><Check size={16}/> Your follow-up appointment is booked.</div>:<Button onClick={()=>navigate(`/patient/book?followup=${item.id}`)}>Book follow-up <ArrowRight size={15}/></Button>}</article>)}</div>:<EmptyState icon={Activity} title="No follow-ups recommended" detail="If your doctor recommends a follow-up, the details will appear here."/>}</>;
}

export function PatientProfile() {
  const { data, setData, session, setSession } = useStore();
  const [form, setForm] = useState(data.profile);
  const toast=useToast();
  const change=(event)=>setForm({...form,[event.target.name]:event.target.value});
  const save=(event)=>{event.preventDefault();setData((prev)=>({...prev,profile:form,appointments:prev.appointments.map((apt)=>apt.patientEmail===session.email?{...apt,patientName:form.name}:apt),prescriptions:prev.prescriptions.map((rx)=>rx.patientEmail===session.email?{...rx,patientName:form.name}:rx),followups:prev.followups.map((item)=>item.patientEmail===session.email?{...item,patientName:form.name}:item)}));setSession((previous)=>previous?{...previous,name:form.name}:previous);toast('Your profile details have been saved.');};
  return <><PageHeader eyebrow="YOUR DETAILS" title="My profile" description="Keep your contact details up to date for your care team."/><div className="profile-layout"><section className="panel profile-panel"><div className="profile-card-head"><Avatar initials={form.name.split(' ').map(x=>x[0]).slice(0,2).join('')} tone="lilac" size="large"/><div><h2>{form.name}</h2><p>Patient account · CarePoint demo</p></div></div><form className="profile-form" onSubmit={save}><div className="form-two-col"><label className="field-label">Full name<input name="name" value={form.name} onChange={change} required/></label><label className="field-label">Email address<input value={form.email} disabled/><small>Demo account email</small></label><label className="field-label">Phone number<input name="phone" value={form.phone} onChange={change}/></label><label className="field-label">Date of birth<input type="date" name="dateOfBirth" value={form.dateOfBirth} onChange={change}/></label><label className="field-label">Blood group<select name="bloodGroup" value={form.bloodGroup} onChange={change}><option>Unknown</option>{['A+','A-','B+','B-','AB+','AB-','O+','O-'].map(x=><option key={x}>{x}</option>)}</select></label><label className="field-label">Address<input name="address" value={form.address} onChange={change}/></label></div><div className="form-actions"><span><ShieldCheck size={15}/> Stored in local browser demo only</span><Button type="submit">Save changes <Check size={15}/></Button></div></form></section><aside className="profile-safety"><span><ShieldCheck size={20}/></span><h3>Your demo data stays in this browser.</h3><p>This portfolio project uses fictional sample information and local browser storage. It is not a medical record system.</p></aside></div></>;
}
