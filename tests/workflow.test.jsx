// @vitest-environment jsdom
import React from 'react';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { cleanup, fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from '../src/App';
import { StoreProvider } from '../src/store';

function renderApp() {
  return render(<MemoryRouter initialEntries={['/']}><StoreProvider><App /></StoreProvider></MemoryRouter>);
}

function loginAs(role) {
  const link = screen.getAllByRole('link', { name: role === 'doctor' ? /Doctor (portal|login)/i : /Patient (login|portal)/i })[0];
  fireEvent.click(link);
  fireEvent.click(screen.getByRole('button', { name: new RegExp(`Continue to ${role} portal`, 'i') }));
}

describe('CarePoint portal workflow', () => {
  beforeEach(() => localStorage.clear());
  afterEach(() => cleanup());

  it('books a patient visit, completes it as a doctor, and shares a prescription and follow-up back to the patient', async () => {
    renderApp();
    loginAs('patient');
    expect(await screen.findByRole('heading', { name: /Good morning, Jamie/i })).toBeTruthy();

    fireEvent.click(screen.getByRole('link', { name: /Find doctors/i }));
    const doctorCard = screen.getByText('Dr. Olivia Chen').closest('.doctor-card');
    fireEvent.click(within(doctorCard).getByRole('button', { name: /Book visit/i }));
    fireEvent.change(screen.getByLabelText('Appointment date'), { target: { value: '2030-01-07' } });
    fireEvent.click(screen.getByRole('button', { name: '9:00 AM' }));
    fireEvent.change(screen.getByLabelText('Reason for visit'), { target: { value: 'Annual cardiac check' } });
    fireEvent.click(screen.getByRole('button', { name: /Confirm appointment/i }));
    expect(await screen.findByText('Annual cardiac check')).toBeTruthy();

    fireEvent.click(screen.getByRole('button', { name: /Log out/i }));
    loginAs('doctor');
    fireEvent.click(screen.getByRole('link', { name: /All appointments/i }));
    const visitRow = await screen.findByRole('row', { name: /Annual cardiac check/i });
    fireEvent.click(within(visitRow).getByRole('button', { name: 'View details' }));
    fireEvent.click(screen.getByRole('button', { name: /Mark completed/i }));

    const dataAfterVisit = JSON.parse(localStorage.getItem('carepoint-demo-data-v2'));
    const visit = dataAfterVisit.appointments.find((appointment) => appointment.reason === 'Annual cardiac check');
    expect(visit.status).toBe('Completed');

    fireEvent.click(screen.getByRole('link', { name: 'Prescriptions' }));
    const rxAppointment = screen.getByLabelText('Completed appointment');
    fireEvent.change(rxAppointment, { target: { value: visit.id } });
    fireEvent.change(screen.getByLabelText('Diagnosis'), { target: { value: 'Healthy heart check' } });
    fireEvent.change(screen.getByLabelText('Medicine name'), { target: { value: 'Example medicine' } });
    fireEvent.change(screen.getByLabelText('Dosage'), { target: { value: '10 mg' } });
    fireEvent.change(screen.getByLabelText('Frequency'), { target: { value: 'Once daily' } });
    fireEvent.change(screen.getByLabelText('Duration'), { target: { value: '7 days' } });
    fireEvent.change(screen.getByLabelText('Doctor’s instructions'), { target: { value: 'Take with water.' } });
    fireEvent.change(screen.getByLabelText('Recommended follow-up date'), { target: { value: '2030-02-01' } });
    fireEvent.click(screen.getByRole('button', { name: /Save prescription/i }));
    await waitFor(() => expect(JSON.parse(localStorage.getItem('carepoint-demo-data-v2')).prescriptions.some((rx) => rx.appointmentId === visit.id && rx.diagnosis === 'Healthy heart check')).toBe(true));

    fireEvent.click(screen.getByRole('link', { name: 'Follow-up visits' }));
    fireEvent.change(screen.getByLabelText('Completed appointment'), { target: { value: visit.id } });
    fireEvent.change(screen.getByLabelText('Recommended next visit'), { target: { value: '2030-02-01' } });
    fireEvent.change(screen.getByLabelText('Consultation summary'), { target: { value: 'Continue routine monitoring.' } });
    fireEvent.change(screen.getByLabelText('Follow-up instructions'), { target: { value: 'Bring your home readings.' } });
    fireEvent.click(screen.getByRole('button', { name: /Save recommendation/i }));
    await waitFor(() => expect(JSON.parse(localStorage.getItem('carepoint-demo-data-v2')).followups.some((item) => item.appointmentId === visit.id && item.summary === 'Continue routine monitoring.')).toBe(true));

    fireEvent.click(screen.getByRole('button', { name: /Log out/i }));
    loginAs('patient');
    fireEvent.click(screen.getByRole('link', { name: 'My prescriptions' }));
    expect(await screen.findByText('Healthy heart check')).toBeTruthy();
    fireEvent.click(screen.getByRole('link', { name: 'Follow-up visits' }));
    expect(await screen.findByText('Continue routine monitoring.')).toBeTruthy();
  });
});
