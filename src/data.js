const offsetDate = (offset) => {
  const date = new Date();
  date.setDate(date.getDate() + offset);
  return date.toISOString().slice(0, 10);
};

export const doctors = [
  { id: 'doc-olivia', name: 'Dr. Olivia Chen', loginEmail: 'doctor@demo.com', initials: 'OC', title: 'Consultant Cardiologist', specialty: 'Cardiology', experience: 12, fee: 11340, days: 'Mon – Fri', weekdays: [1,2,3,4,5], slots: ['09:00', '10:30', '13:00', '15:30'], tone: 'lilac', rating: '4.9' },
  { id: 'doc-james', name: 'Dr. James Carter', loginEmail: 'james@demo.com', initials: 'JC', title: 'Senior Dermatologist', specialty: 'Dermatology', experience: 9, fee: 8978, days: 'Mon, Wed, Fri', weekdays: [1,3,5], slots: ['09:30', '11:00', '14:00', '16:00'], tone: 'mint', rating: '4.8' },
  { id: 'doc-aisha', name: 'Dr. Aisha Rahman', loginEmail: 'aisha@demo.com', initials: 'AR', title: 'Pediatric Specialist', specialty: 'Pediatrics', experience: 11, fee: 8033, days: 'Tue – Sat', weekdays: [2,3,4,5,6], slots: ['09:00', '10:00', '12:30', '15:00'], tone: 'peach', rating: '5.0' },
  { id: 'doc-noah', name: 'Dr. Noah Williams', loginEmail: 'noah@demo.com', initials: 'NW', title: 'Orthopedic Surgeon', specialty: 'Orthopedics', experience: 15, fee: 13230, days: 'Mon – Thu', weekdays: [1,2,3,4], slots: ['08:30', '10:30', '13:30', '15:00'], tone: 'blue', rating: '4.9' },
  { id: 'doc-sofia', name: 'Dr. Sofia Martinez', loginEmail: 'sofia@demo.com', initials: 'SM', title: 'Consultant Neurologist', specialty: 'Neurology', experience: 10, fee: 12285, days: 'Tue – Fri', weekdays: [2,3,4,5], slots: ['09:30', '11:30', '14:00', '16:00'], tone: 'rose', rating: '4.8' },
  { id: 'doc-ethan', name: 'Dr. Ethan Brooks', loginEmail: 'ethan@demo.com', initials: 'EB', title: 'General Physician', specialty: 'General Medicine', experience: 8, fee: 7088, days: 'Mon – Sat', weekdays: [1,2,3,4,5,6], slots: ['08:30', '10:00', '12:00', '15:30'], tone: 'sand', rating: '4.9' },
];

const doctor = (id) => doctors.find((item) => item.id === id);
const appointment = (id, patientName, patientEmail, doctorId, date, time, reason, status) => ({
  id, patientId: patientEmail === 'patient@demo.com' ? 'patient-demo' : `patient-${patientEmail.replace(/[^a-z0-9]/gi, '-')}`, patientName, patientEmail, doctorId,
  doctorName: doctor(doctorId).name, specialty: doctor(doctorId).specialty,
  date, time, reason, status, createdAt: new Date().toISOString(),
});

export const createInitialData = () => {
  const appointments = [
    appointment('apt-demo-01', 'Jamie Rivera', 'patient@demo.com', 'doc-olivia', offsetDate(2), '10:30', 'Annual heart health check', 'Upcoming'),
    appointment('apt-demo-02', 'Jamie Rivera', 'patient@demo.com', 'doc-olivia', offsetDate(-12), '09:00', 'Blood pressure follow-up', 'Completed'),
    appointment('apt-demo-03', 'Morgan Lee', 'morgan@demo.com', 'doc-olivia', offsetDate(1), '13:00', 'Consultation for palpitations', 'Upcoming'),
    appointment('apt-demo-04', 'Riley Chen', 'riley@demo.com', 'doc-olivia', offsetDate(3), '15:30', 'Routine cardiac screening', 'Upcoming'),
    appointment('apt-demo-05', 'Jamie Rivera', 'patient@demo.com', 'doc-ethan', offsetDate(5), '10:00', 'Seasonal wellness visit', 'Upcoming'),
    appointment('apt-demo-06', 'Riley Chen', 'riley@demo.com', 'doc-james', offsetDate(1), '11:00', 'Skin health consultation', 'Upcoming'),
    appointment('apt-demo-07', 'Morgan Lee', 'morgan@demo.com', 'doc-aisha', offsetDate(2), '10:00', 'Child wellness check', 'Upcoming'),
    appointment('apt-demo-08', 'Avery Patel', 'avery@demo.com', 'doc-noah', offsetDate(3), '13:30', 'Knee pain consultation', 'Upcoming'),
    appointment('apt-demo-09', 'Taylor Kim', 'taylor@demo.com', 'doc-sofia', offsetDate(4), '09:30', 'Headache evaluation', 'Upcoming'),
    appointment('apt-demo-10', 'Riley Chen', 'riley@demo.com', 'doc-james', offsetDate(-8), '14:00', 'Follow-up for skin treatment', 'Completed'),
    appointment('apt-demo-11', 'Morgan Lee', 'morgan@demo.com', 'doc-aisha', offsetDate(-6), '09:00', 'Routine wellness review', 'Completed'),
    appointment('apt-demo-12', 'Avery Patel', 'avery@demo.com', 'doc-noah', offsetDate(-10), '11:00', 'Mobility assessment', 'Completed'),
    appointment('apt-demo-13', 'Taylor Kim', 'taylor@demo.com', 'doc-sofia', offsetDate(-7), '15:00', 'Neurology review', 'Completed'),
    appointment('apt-demo-14', 'Jamie Rivera', 'patient@demo.com', 'doc-ethan', offsetDate(-9), '08:30', 'General wellness check', 'Completed'),
  ];
  return {
    appointments,
    prescriptions: [{
      id: 'rx-demo-01', patientId: 'patient-demo', patientName: 'Jamie Rivera', patientEmail: 'patient@demo.com',
      doctorId: 'doc-olivia', doctorName: doctor('doc-olivia').name, appointmentId: 'apt-demo-02',
      consultationDate: offsetDate(-12), diagnosis: 'Mild hypertension',
      medicines: [{ name: 'Lisinopril', dosage: '5 mg', frequency: 'Once daily', duration: '30 days' }],
      instructions: 'Take in the morning with water. Check blood pressure twice a week.', followUpDate: offsetDate(18),
    }],
    followups: [{
      id: 'fu-demo-01', patientId: 'patient-demo', patientName: 'Jamie Rivera', patientEmail: 'patient@demo.com',
      doctorId: 'doc-olivia', doctorName: doctor('doc-olivia').name, appointmentId: 'apt-demo-02',
      previousDate: offsetDate(-12), nextDate: offsetDate(18), summary: 'Blood pressure is improving with lifestyle changes.',
      instructions: 'Bring your home blood pressure readings to the next visit.', status: 'Recommended', bookedAppointmentId: null,
    }],
    profile: { name: 'Jamie Rivera', email: 'patient@demo.com', phone: '+1 (555) 201-7788', dateOfBirth: '1992-04-18', bloodGroup: 'O+', address: '48 Garden Lane, Portland, OR' },
  };
};

export const dateOffset = offsetDate;
