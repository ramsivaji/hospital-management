# CarePoint — Hospital Appointment & Patient Management

CarePoint is a fictional, frontend-only hospital management portfolio demo built with React, Vite, React Router, and Lucide icons. It runs entirely in the browser and stores demo records in localStorage. It does not connect to a backend, external API, or database.

> **Demo only:** Authentication is simulated, and all sample data is fictional. This project is not suitable for real patient information or clinical use.

## Demo sign-in

| Portal | Email | Password |
| --- | --- | --- |
| Patient | `patient@demo.com` | `patient123` |
| Doctor | `doctor@demo.com` | `doctor123` |

## Local development

Requires Node.js 20.19+ or 22.12+.

```sh
npm install
npm run dev
```

Vite prints a local URL after starting the development server.

## Production build

```sh
npm run build
npm run preview
```

The static production site is written to `dist/`.

## Netlify deployment

Deploy the repository from Netlify with these build settings:

- Build command: `npm run build`
- Publish directory: `dist`

The `public/_redirects` file sends client-side routes back to `index.html`, so refreshing a patient or doctor route works on the deployed static site. No environment variables are needed.

## Demo data and workflows

- Sign in to either portal using the sample credentials above.
- Patients can search doctors, filter specialties, book visits, cancel upcoming visits, view prescriptions, and book recommended follow-ups.
- The doctor portal can mark visits completed or cancelled, create prescriptions with multiple medicines, and recommend follow-ups.
- Appointments, prescription records, follow-ups, the patient profile, and demo login state persist in this browser's localStorage.
- Use **Reset demo data** in the portal sidebar to restore the original fictional sample records.

The two portals intentionally share the local demo records so the patient → doctor → patient workflow can be demonstrated in one browser.
