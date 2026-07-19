import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'DDS - Doctor Digital System | Morocco E-Health Platform',
  description:
    'Plateforme numérique de santé au Maroc : gestion de rendez-vous, téléconsultation, dossier patient chiffré, assistant IA médical. Conforme CNDP, Loi 09-08, Loi 131-13.',
  keywords: [
    'DDS',
    'Doctor Digital System',
    'E-Health Morocco',
    'Téléconsultation Maroc',
    'CNDP',
    'Loi 09-08',
    'Médecin Maroc',
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" dir="ltr">
      <body>{children}</body>
    </html>
  );
}
