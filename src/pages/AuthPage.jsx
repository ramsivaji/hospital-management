import { useEffect, useState } from 'react';
import { ArrowLeft, ArrowRight, Eye, EyeOff, HeartPulse, LockKeyhole, Mail, ShieldCheck } from 'lucide-react';
import { Link, Navigate, useLocation, useNavigate, useParams } from 'react-router-dom';
import { Brand, Button } from '../components';
import { doctors } from '../data';
import { useStore } from '../store';

const patientAccount = { email: 'patient@demo.com', password: 'patient123', name: 'Jamie Rivera' };
const doctorAccounts = doctors.map(({ id, name, loginEmail, specialty }) => ({ id, name, email: loginEmail, password: 'doctor123', specialty }));

export default function AuthPage() {
  const { role } = useParams();
  const isDoctor = role === 'doctor';
  const { session, setSession } = useStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [doctorId, setDoctorId] = useState(doctorAccounts[0].id);
  const selectedDoctorAccount = doctorAccounts.find((account) => account.id === doctorId) || doctorAccounts[0];
  const demoAccount = isDoctor ? selectedDoctorAccount : patientAccount;
  const [email, setEmail] = useState(demoAccount.email);
  const [password, setPassword] = useState(demoAccount.password);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  useEffect(() => {
    const account = role === 'doctor' ? doctorAccounts[0] : patientAccount;
    setDoctorId(doctorAccounts[0].id);
    setEmail(account.email);
    setPassword(account.password);
    setError('');
  }, [role]);
  if (!['patient', 'doctor'].includes(role)) return <Navigate to="/" replace />;
  if (session?.role === role) return <Navigate to={location.state?.from?.startsWith(`/${role}`) ? location.state.from : `/${role}`} replace />;
  const submit = (event) => {
    event.preventDefault();
    const normalizedEmail = email.trim().toLowerCase();
    const account = isDoctor
      ? doctorAccounts.find((item) => item.email === normalizedEmail)
      : normalizedEmail === patientAccount.email ? patientAccount : null;
    if (!account || password !== account.password) { setError('Those demo credentials do not match. Try the sample login shown below.'); return; }
    setSession({ role, email: account.email, name: account.name, id: isDoctor ? account.id : 'patient-demo' });
    navigate(location.state?.from?.startsWith(`/${role}`) ? location.state.from : `/${role}`, { replace: true });
  };
  return <div className="auth-page"><div className="auth-left"><div className="auth-nav"><Brand/><Link to="/" className="back-home"><ArrowLeft size={15}/> Back to home</Link></div><div className="auth-center"><div className="auth-icon"><HeartPulse size={24}/></div><span className="eyebrow">{isDoctor ? 'WELCOME BACK, DOCTOR' : 'YOUR CARE, ALL IN ONE PLACE'}</span><h1>{isDoctor ? 'Good to see you again.' : 'Your health journey starts here.'}</h1><p>{isDoctor ? 'Sign in to manage visits and care for your patients.' : 'Sign in to find your doctor, manage visits, and stay connected to your care.'}</p><form className="auth-form" onSubmit={submit}>{isDoctor&&<label>Doctor account<select value={doctorId} onChange={(event)=>{const account=doctorAccounts.find((item)=>item.id===event.target.value);setDoctorId(account.id);setEmail(account.email);setPassword(account.password);setError('')}}>{doctorAccounts.map((account)=><option key={account.id} value={account.id}>{account.name} · {account.specialty}</option>)}</select></label>}<label>Email address<span className="input-wrap"><Mail size={16}/><input type="email" value={email} onChange={(e)=>setEmail(e.target.value)} required /></span></label><label>Password<span className="input-wrap"><LockKeyhole size={16}/><input type={showPassword?'text':'password'} value={password} onChange={(e)=>setPassword(e.target.value)} required/><button type="button" aria-label={showPassword?'Hide password':'Show password'} onClick={()=>setShowPassword(v=>!v)}>{showPassword?<EyeOff size={16}/>:<Eye size={16}/>}</button></span></label>{error&&<div className="form-error">{error}</div>}<Button type="submit" className="auth-submit">Continue to {isDoctor?'doctor':'patient'} portal <ArrowRight size={16}/></Button></form><div className="demo-credentials"><div><span className="credential-lock"><ShieldCheck size={15}/></span><div><strong>Demo login details</strong><small>For this portfolio preview</small></div></div><p><span>Email</span><code>{demoAccount.email}</code></p><p><span>Password</span><code>{demoAccount.password}</code></p></div><div className="switch-role">{isDoctor?'Looking for the patient view?':'Are you a doctor?'} <Link to={`/login/${isDoctor?'patient':'doctor'}`}>{isDoctor?'Patient login':'Doctor login'} <ArrowRight size={13}/></Link></div></div><div className="auth-footer">CarePoint is a fictional portfolio demo. Please do not enter real health information.</div></div><aside className={`auth-art ${isDoctor?'doctor-auth-art':''}`}><div className="auth-art-orb orb-a"/><div className="auth-art-orb orb-b"/><div className="auth-quote"><span className="quote-mark">“</span><p>{isDoctor?'The best care happens when people feel seen, heard, and cared for.':'A healthier tomorrow begins with a little care today.'}</p><span className="quote-rule"/><small>{isDoctor?'A NOTE FOR OUR CARE TEAM':'THOUGHTFUL CARE. CONNECTED.'}</small></div><div className="auth-art-detail"><span><HeartPulse size={17}/></span><div><strong>CarePoint</strong><small>Care that connects.</small></div></div><div className="auth-art-dots">✦</div></aside></div>;
}
