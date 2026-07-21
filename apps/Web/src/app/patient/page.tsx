"use client";

import React, { Suspense, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';

/* ─── Mock Patient Data ──────────────────────────── */
const PATIENT_USER = {
  id: 'p1',
  name: 'Mohamed El Alami',
  phone: '+212 661-123456',
  cin: 'AB123456',
  city: 'Casablanca',
  birthDate: '1985-03-15',
};

const MY_APPOINTMENTS = [
  { id: 'a1', doctor: 'Dr. Ahmed Benhaddou', specialty: 'Médecine Générale', date: '2026-07-18', time: '09:30', type: 'TELECONSULTATION', status: 'CONFIRMED', location: 'Casablanca' },
  { id: 'a2', doctor: 'Dr. Salma Idrissi', specialty: 'Dermatologie', date: '2026-07-22', time: '14:00', type: 'PHYSICAL', status: 'PENDING', location: 'Rabat' },
  { id: 'a3', doctor: 'Dr. Ahmed Benhaddou', specialty: 'Médecine Générale', date: '2026-06-20', time: '10:00', type: 'PHYSICAL', status: 'COMPLETED', location: 'Casablanca' },
];

const MY_RECORDS = [
  { date: '2026-06-20', doctor: 'Dr. Ahmed Benhaddou', diagnosis: 'HTA Grade 1', prescription: 'Ramipril 5mg/jour', notes: 'Contrôle dans 1 mois.' },
  { date: '2026-05-10', doctor: 'Dr. Ahmed Benhaddou', diagnosis: 'Suivi HTA', prescription: 'Renouvellement traitement', notes: 'TA normalisée à 130/80.' },
];

const MY_PRESCRIPTIONS = [
  { id: 'rx1', date: '2026-06-20', doctor: 'Dr. Ahmed Benhaddou', items: ['Ramipril 5mg — 1x/jour le matin', 'Amlodipine 5mg — 1x/jour si TA > 150/90'], status: 'active' },
  { id: 'rx2', date: '2026-05-10', doctor: 'Dr. Ahmed Benhaddou', items: ['Ramipril 2.5mg — 1x/jour'], status: 'expired' },
];

const AVAILABLE_DOCTORS = [
  { id: 'd1', name: 'Dr. Ahmed Benhaddou', specialty: 'Médecine Générale', city: 'Casablanca', rating: 4.8, nextSlot: '2026-07-19 10:00' },
  { id: 'd2', name: 'Dr. Salma Idrissi', specialty: 'Dermatologie', city: 'Rabat', rating: 4.9, nextSlot: '2026-07-20 15:00' },
  { id: 'd3', name: 'Dr. Karim Ouazzani', specialty: 'Cardiologie', city: 'Casablanca', rating: 4.7, nextSlot: '2026-07-21 09:00' },
  { id: 'd4', name: 'Dr. Meryem Fassi', specialty: 'Pédiatrie', city: 'Marrakech', rating: 4.6, nextSlot: '2026-07-22 11:00' },
];

const CONSENTS = [
  { type: 'TELECONSULTATION', label: 'Téléconsultation vidéo', desc: 'J\'autorise la consultation à distance via vidéo sécurisée, conformément à la Loi 131-13.', granted: true },
  { type: 'WHATSAPP_REMINDERS', label: 'Rappels WhatsApp', desc: 'J\'accepte de recevoir des rappels de rendez-vous par WhatsApp (message chiffré E2E).', granted: true },
  { type: 'DATA_TREATMENT', label: 'Traitement des données médicales', desc: 'Je consens au traitement de mes données de santé conformément à la Loi 09-08 (CNDP).', granted: true },
];

type PatientTab = 'dashboard' | 'appointments' | 'records' | 'prescriptions' | 'book' | 'consent';

export default function PatientPortal() {
  return (
    <Suspense fallback={<div style={{ ...S.loadingCard, minHeight: '60vh' }}>Chargement de l’espace patient…</div>}>
      <PatientPortalContent />
    </Suspense>
  );
}

function PatientPortalContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tabParam = searchParams.get('tab');
  const activeTab: PatientTab = tabParam && ['dashboard', 'appointments', 'records', 'prescriptions', 'book', 'consent'].includes(tabParam) ? (tabParam as PatientTab) : 'dashboard';
  const setActiveTab = (tab: PatientTab) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('tab', tab);
    router.push(`/patient?${params.toString()}`, { scroll: false });
  };
  const [consents, setConsents] = useState(CONSENTS);
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);

  // Booking form
  const [bookDoctor, setBookDoctor] = useState('d1');
  const [bookDate, setBookDate] = useState('');
  const [bookTime, setBookTime] = useState('');
  const [bookType, setBookType] = useState<'PHYSICAL' | 'TELECONSULTATION'>('PHYSICAL');
  const [bookReminder, setBookReminder] = useState<'whatsapp' | 'sms' | 'none'>('whatsapp');
  const [bookReason, setBookReason] = useState('');
  const [bookings, setBookings] = useState(MY_APPOINTMENTS);

  const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const handleBook = () => {
    if (!bookDate || !bookTime) { showToast('Remplissez la date et l\'heure', 'error'); return; }
    const doc = AVAILABLE_DOCTORS.find(d => d.id === bookDoctor)!;
    const newBooking = {
      id: `a${Date.now()}`, doctor: doc.name, specialty: doc.specialty,
      date: bookDate, time: bookTime, type: bookType,
      status: 'PENDING' as const, location: doc.city,
    };
    setBookings(prev => [newBooking, ...prev]);
    showToast(`RDV demandé chez ${doc.name} — rappel ${bookReminder === 'whatsapp' ? 'WhatsApp' : bookReminder === 'sms' ? 'SMS' : 'désactivé'} programmé ✓`);
    setBookDate(''); setBookTime(''); setBookReason('');
  };

  const handleToggleConsent = (type: string) => {
    setConsents(prev => prev.map(c => c.type === type ? { ...c, granted: !c.granted } : c));
    showToast('Consentement mis à jour ✓');
  };

  const statusColor = (s: string) => {
    if (s === 'CONFIRMED') return '#10b981';
    if (s === 'PENDING') return '#fbbf24';
    if (s === 'COMPLETED') return '#64748b';
    return '#94a3b8';
  };

  const tabItems: { key: PatientTab; label: string; icon: string }[] = [
    { key: 'dashboard', label: 'Accueil', icon: '🏠' },
    { key: 'book', label: 'Prendre RDV', icon: '📅' },
    { key: 'appointments', label: 'Mes RDV', icon: '📋' },
    { key: 'records', label: 'Dossier Médical', icon: '📁' },
    { key: 'prescriptions', label: 'Ordonnances', icon: '💊' },
    { key: 'consent', label: 'Consentements', icon: '🔒' },
  ];

  return (
    <div style={S.root}>
      {toast && (
        <div className="animate-fade" style={{ ...S.toast, background: toast.type === 'success' ? 'linear-gradient(135deg, #10b981, #059669)' : 'linear-gradient(135deg, #ef4444, #dc2626)' }}>
          {toast.msg}
        </div>
      )}

      {/* Header */}
      <header style={S.header}>
        <div style={S.headerLeft}>
          <Link href="/" style={{ textDecoration: 'none', color: 'inherit' }}>
            <div style={S.logoBox}>DDS</div>
          </Link>
          <div>
            <h1 style={S.headerTitle}>Espace Patient</h1>
            <p style={S.headerSub}>{PATIENT_USER.name} — {PATIENT_USER.city}</p>
          </div>
        </div>
        <div style={S.complianceBadge}>
          <span style={S.dot} /> Données Chiffrées
        </div>
      </header>

      <div style={S.layout}>
        {/* Sidebar */}
        <nav style={S.sidebar}>
          {tabItems.map(t => (
            <button key={t.key} onClick={() => setActiveTab(t.key)} style={{
              ...S.sideBtn,
              background: activeTab === t.key ? 'rgba(56,189,248,0.1)' : 'transparent',
              borderColor: activeTab === t.key ? 'rgba(56,189,248,0.3)' : 'transparent',
              color: activeTab === t.key ? '#38bdf8' : '#94a3b8',
            }}>
              <span style={{ fontSize: '1.1rem' }}>{t.icon}</span>
              <span>{t.label}</span>
            </button>
          ))}
        </nav>

        {/* Main */}
        <main style={S.main} className="animate-fade">

          {/* ──── DASHBOARD ──── */}
          {activeTab === 'dashboard' && (
            <div>
              <h2 style={S.title}>Bienvenue, {PATIENT_USER.name.split(' ')[0]} 👋</h2>
              <div style={S.statsRow}>
                <div style={S.statCard}>
                  <span style={S.statIcon}>📅</span>
                  <span style={S.statVal}>{bookings.filter(a => a.status !== 'COMPLETED').length}</span>
                  <span style={S.statLbl}>RDV à venir</span>
                </div>
                <div style={S.statCard}>
                  <span style={S.statIcon}>📁</span>
                  <span style={{ ...S.statVal, color: '#4ade80' }}>{MY_RECORDS.length}</span>
                  <span style={S.statLbl}>Consultations</span>
                </div>
                <div style={S.statCard}>
                  <span style={S.statIcon}>💊</span>
                  <span style={{ ...S.statVal, color: '#a78bfa' }}>{MY_PRESCRIPTIONS.filter(p => p.status === 'active').length}</span>
                  <span style={S.statLbl}>Ordonnances Actives</span>
                </div>
              </div>

              {/* Next appointment card */}
              {bookings.filter(a => a.status === 'CONFIRMED')[0] && (() => {
                const next = bookings.filter(a => a.status === 'CONFIRMED')[0];
                return (
                  <div style={S.nextAptCard}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap' as const, gap: '0.5rem' }}>
                      <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: 0 }}>Prochain Rendez-vous</h3>
                      <span style={{ ...S.typeBadge, background: next.type === 'TELECONSULTATION' ? 'rgba(14,165,233,0.15)' : 'rgba(16,185,129,0.15)', color: next.type === 'TELECONSULTATION' ? '#38bdf8' : '#4ade80' }}>
                        {next.type === 'TELECONSULTATION' ? '📹 Téléconsultation' : '🏥 Présentiel'}
                      </span>
                    </div>
                    <div style={S.nextAptInfo}>
                      <div><span style={S.infoLabel}>Médecin</span><span style={S.infoVal}>{next.doctor}</span></div>
                      <div><span style={S.infoLabel}>Spécialité</span><span style={S.infoVal}>{next.specialty}</span></div>
                      <div><span style={S.infoLabel}>Date</span><span style={S.infoVal}>{next.date}</span></div>
                      <div><span style={S.infoLabel}>Heure</span><span style={S.infoVal}>{next.time}</span></div>
                    </div>
                    {next.type === 'TELECONSULTATION' && (
                      <button style={{ ...S.primaryBtn, width: '100%', marginTop: '1rem' }}>
                        📹 Rejoindre la Téléconsultation
                      </button>
                    )}
                  </div>
                );
              })()}

              <div style={S.dashboardCard}>
                <h3 style={S.cardTitle}>Pré-consultation rapide</h3>
                <p style={S.cardText}>Préparez votre visite avec un rappel, une fiche de symptômes et vos consentements déjà enregistrés.</p>
                <div style={S.quickChecklist}>
                  <span style={S.checkItem}>✓ Consentements validés</span>
                  <span style={S.checkItem}>✓ Rappels WhatsApp actifs</span>
                  <span style={S.checkItem}>✓ Dossier médical disponible</span>
                </div>
              </div>

              <div style={{ marginTop: '1.5rem' }}>
                <button style={S.primaryBtn} onClick={() => setActiveTab('book')}>📅 Prendre un Rendez-vous</button>
              </div>
            </div>
          )}

          {/* ──── BOOK APPOINTMENT ──── */}
          {activeTab === 'book' && (
            <div>
              <h2 style={S.title}>📅 Prendre Rendez-vous</h2>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>Choisissez votre médecin, la date, et le type de consultation.</p>

              {/* Doctor cards */}
              <div style={S.doctorGrid}>
                {AVAILABLE_DOCTORS.map(doc => (
                  <div key={doc.id} onClick={() => setBookDoctor(doc.id)} style={{
                    ...S.doctorCard,
                    borderColor: bookDoctor === doc.id ? '#38bdf8' : 'var(--border)',
                    boxShadow: bookDoctor === doc.id ? '0 0 20px rgba(56,189,248,0.1)' : 'none',
                  }}>
                    <div style={S.docAvatar}>{doc.name.split('.')[1]?.trim().charAt(0) || 'D'}</div>
                    <h4 style={{ fontSize: '0.95rem', fontWeight: 700, margin: '0 0 0.25rem' }}>{doc.name}</h4>
                    <p style={{ fontSize: '0.8rem', color: 'var(--accent-blue)', margin: '0 0 0.25rem' }}>{doc.specialty}</p>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0 }}>{doc.city} — ⭐ {doc.rating}</p>
                  </div>
                ))}
              </div>

              <div style={S.formCard}>
                <div style={S.formGrid}>
                  <div>
                    <label style={S.label}>Date</label>
                    <input type="date" value={bookDate} onChange={e => setBookDate(e.target.value)} style={S.input} />
                  </div>
                  <div>
                    <label style={S.label}>Heure</label>
                    <input type="time" value={bookTime} onChange={e => setBookTime(e.target.value)} style={S.input} />
                  </div>
                  <div>
                    <label style={S.label}>Type</label>
                    <select value={bookType} onChange={e => setBookType(e.target.value as any)} style={S.select}>
                      <option value="PHYSICAL">🏥 Présentiel</option>
                      <option value="TELECONSULTATION">📹 Téléconsultation</option>
                    </select>
                  </div>
                  <div>
                    <label style={S.label}>Rappel</label>
                    <select value={bookReminder} onChange={e => setBookReminder(e.target.value as any)} style={S.select}>
                      <option value="whatsapp">WhatsApp</option>
                      <option value="sms">SMS</option>
                      <option value="none">Aucun rappel</option>
                    </select>
                  </div>
                </div>
                <div style={{ marginBottom: '1rem' }}>
                  <label style={S.label}>Motif de consultation</label>
                  <textarea value={bookReason} onChange={e => setBookReason(e.target.value)} style={S.textarea} rows={3} placeholder="Décrivez votre besoin, symptômes ou objectif de la consultation" />
                </div>
                <button style={S.primaryBtn} onClick={handleBook}>Confirmer la demande de RDV</button>
              </div>
            </div>
          )}

          {/* ──── MY APPOINTMENTS ──── */}
          {activeTab === 'appointments' && (
            <div>
              <h2 style={S.title}>📋 Mes Rendez-vous</h2>
              <div style={S.aptList}>
                {bookings.map(apt => (
                  <div key={apt.id} style={S.aptRow}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.3rem' }}>
                        <span style={{ ...S.dotSmall, background: statusColor(apt.status) }} />
                        <span style={{ fontWeight: 700 }}>{apt.doctor}</span>
                        <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>— {apt.specialty}</span>
                      </div>
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0 }}>
                        {apt.date} à {apt.time} — {apt.location}
                      </p>
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                      <span style={{
                        ...S.typeBadge,
                        background: apt.type === 'TELECONSULTATION' ? 'rgba(14,165,233,0.15)' : 'rgba(16,185,129,0.15)',
                        color: apt.type === 'TELECONSULTATION' ? '#38bdf8' : '#4ade80',
                      }}>
                        {apt.type === 'TELECONSULTATION' ? 'Téléconsult.' : 'Présentiel'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ──── MEDICAL RECORDS ──── */}
          {activeTab === 'records' && (
            <div>
              <h2 style={S.title}>📁 Mon Dossier Médical</h2>
              <div style={S.securityNote}>
                🔒 Vos données médicales sont chiffrées avec AES-256-GCM (Application-Level Encryption) conformément à la Loi 09-08.
                Seul votre médecin traitant peut y accéder.
              </div>
              <div style={S.recordList}>
                {MY_RECORDS.map((r, i) => (
                  <div key={i} style={S.recordCard}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                      <span style={{ fontWeight: 700, color: 'var(--accent-blue)', fontSize: '0.85rem' }}>{r.date}</span>
                      <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{r.doctor}</span>
                    </div>
                    <div style={S.recField}><span style={S.recLabel}>Diagnostic</span><p style={S.recVal}>{r.diagnosis}</p></div>
                    <div style={S.recField}><span style={S.recLabel}>Prescription</span><p style={{ ...S.recVal, color: '#38bdf8' }}>{r.prescription}</p></div>
                    <div style={S.recField}><span style={S.recLabel}>Notes</span><p style={S.recVal}>{r.notes}</p></div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ──── PRESCRIPTIONS ──── */}
          {activeTab === 'prescriptions' && (
            <div>
              <h2 style={S.title}>💊 Mes Ordonnances</h2>
              <div style={S.recordList}>
                {MY_PRESCRIPTIONS.map(rx => (
                  <div key={rx.id} style={S.recordCard}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                      <span style={{ fontWeight: 700, fontSize: '0.85rem' }}>{rx.doctor} — {rx.date}</span>
                      <span style={{
                        padding: '0.2rem 0.6rem', borderRadius: '20px', fontSize: '0.7rem', fontWeight: 700,
                        background: rx.status === 'active' ? 'rgba(16,185,129,0.15)' : 'rgba(100,116,139,0.15)',
                        color: rx.status === 'active' ? '#4ade80' : '#94a3b8',
                      }}>
                        {rx.status === 'active' ? '● Active' : '○ Expirée'}
                      </span>
                    </div>
                    <ul style={{ margin: 0, paddingLeft: '1.25rem' }}>
                      {rx.items.map((item, j) => (
                        <li key={j} style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '0.3rem', lineHeight: 1.5 }}>{item}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ──── CONSENTS ──── */}
          {activeTab === 'consent' && (
            <div>
              <h2 style={S.title}>🔒 Gestion des Consentements</h2>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', lineHeight: 1.6 }}>
                Conformément à la Loi 09-08 et aux recommandations de la CNDP, vous devez donner votre consentement
                explicite avant tout traitement de vos données médicales ou utilisation de services numériques de santé.
              </p>
              <div style={S.consentList}>
                {consents.map(c => (
                  <div key={c.type} style={S.consentCard}>
                    <div style={{ flex: 1 }}>
                      <h4 style={{ fontSize: '0.95rem', fontWeight: 700, margin: '0 0 0.3rem' }}>{c.label}</h4>
                      <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.5 }}>{c.desc}</p>
                    </div>
                    <button onClick={() => handleToggleConsent(c.type)} style={{
                      ...S.toggleBtn,
                      background: c.granted ? 'var(--gradient-success)' : 'rgba(100,116,139,0.2)',
                    }}>
                      <div style={{
                        ...S.toggleKnob,
                        transform: c.granted ? 'translateX(22px)' : 'translateX(2px)',
                      }} />
                    </button>
                  </div>
                ))}
              </div>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '1.5rem', lineHeight: 1.5 }}>
                Vos consentements sont horodatés et enregistrés dans notre registre CNDP. Vous pouvez les retirer
                à tout moment. Pour toute question, contactez notre Délégué à la Protection des Données.
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

/* ─── Styles ─────────────────────────────────────── */
const S: { [key: string]: React.CSSProperties } = {
  root: { minHeight: '100vh', display: 'flex', flexDirection: 'column' },
  toast: {
    position: 'fixed', bottom: '2rem', right: '2rem',
    padding: '0.85rem 1.5rem', borderRadius: '10px', color: '#fff',
    fontWeight: 600, fontSize: '0.85rem', zIndex: 1000, boxShadow: '0 8px 30px rgba(0,0,0,0.3)',
  },
  header: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    padding: '1rem 2rem', borderBottom: '1px solid var(--border)',
    background: 'rgba(10,14,26,0.9)', backdropFilter: 'blur(16px)',
    position: 'sticky', top: 0, zIndex: 50,
  },
  headerLeft: { display: 'flex', alignItems: 'center', gap: '1rem' },
  logoBox: {
    width: '40px', height: '40px', borderRadius: '10px',
    background: 'linear-gradient(135deg, #10b981, #059669)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontWeight: 800, fontSize: '0.9rem', color: '#fff',
  },
  headerTitle: { fontSize: '1.1rem', fontWeight: 700, margin: 0 },
  headerSub: { fontSize: '0.75rem', color: 'var(--text-muted)', margin: '0.15rem 0 0' },
  complianceBadge: {
    display: 'flex', alignItems: 'center', gap: '0.5rem',
    background: 'rgba(56,189,248,0.1)', border: '1px solid rgba(56,189,248,0.2)',
    padding: '0.4rem 0.85rem', borderRadius: '30px',
    fontSize: '0.75rem', color: '#38bdf8', fontWeight: 600,
  },
  dot: { width: '7px', height: '7px', background: '#38bdf8', borderRadius: '50%', boxShadow: '0 0 6px #38bdf8', display: 'inline-block' },
  layout: { display: 'flex', flex: 1 },
  sidebar: {
    width: '210px', borderRight: '1px solid var(--border)',
    padding: '1.5rem 0.75rem', display: 'flex', flexDirection: 'column', gap: '0.4rem',
    background: 'var(--bg-secondary)', flexShrink: 0,
  },
  sideBtn: {
    display: 'flex', alignItems: 'center', gap: '0.65rem',
    padding: '0.7rem 0.85rem', borderRadius: '10px',
    fontSize: '0.85rem', fontWeight: 600, border: '1px solid transparent',
    cursor: 'pointer', transition: 'all 0.2s', textAlign: 'left' as const, width: '100%',
  },
  main: { flex: 1, padding: '2rem', overflowY: 'auto', maxHeight: 'calc(100vh - 65px)' },
  title: { fontSize: '1.3rem', fontWeight: 800, marginBottom: '1.5rem' },
  primaryBtn: {
    background: 'var(--gradient-primary)', color: '#fff',
    padding: '0.65rem 1.5rem', borderRadius: '10px',
    fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer', border: 'none',
  },
  statsRow: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '1rem', marginBottom: '1.5rem' },
  statCard: {
    background: 'var(--bg-card)', border: '1px solid var(--border)',
    borderRadius: '14px', padding: '1.5rem', textAlign: 'center' as const,
    display: 'flex', flexDirection: 'column' as const, alignItems: 'center', gap: '0.25rem',
  },
  statIcon: { fontSize: '1.5rem' },
  statVal: { fontSize: '2rem', fontWeight: 900, color: '#38bdf8' },
  statLbl: { fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 500, textTransform: 'uppercase' as const, letterSpacing: '0.04em' },
  nextAptCard: {
    background: 'var(--bg-card)', border: '1px solid rgba(56,189,248,0.2)',
    borderRadius: '14px', padding: '1.5rem', boxShadow: '0 0 20px rgba(56,189,248,0.05)',
  },
  nextAptInfo: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '1rem' },
  infoLabel: { display: 'block', fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase' as const, letterSpacing: '0.04em', marginBottom: '0.2rem' },
  infoVal: { fontWeight: 600, fontSize: '0.85rem' },
  typeBadge: { padding: '0.2rem 0.6rem', borderRadius: '20px', fontSize: '0.7rem', fontWeight: 700 },
  doctorGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1rem', marginBottom: '1.5rem' },
  doctorCard: {
    background: 'var(--bg-card)', border: '1px solid var(--border)',
    borderRadius: '14px', padding: '1.25rem', cursor: 'pointer',
    transition: 'border-color 0.2s, box-shadow 0.2s',
  },
  docAvatar: {
    width: '42px', height: '42px', borderRadius: '50%',
    background: 'var(--gradient-secondary)', display: 'flex',
    alignItems: 'center', justifyContent: 'center',
    fontSize: '1rem', fontWeight: 800, color: '#fff', marginBottom: '0.75rem',
  },
  formCard: {
    background: 'var(--bg-card)', border: '1px solid var(--border)',
    borderRadius: '14px', padding: '1.5rem', marginBottom: '1.5rem',
  },
  formGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1rem' },
  dashboardCard: { background: 'var(--bg-card)', border: '1px solid rgba(56,189,248,0.2)', borderRadius: '14px', padding: '1.25rem', marginTop: '1rem' },
  cardTitle: { fontSize: '0.95rem', fontWeight: 700, margin: '0 0 0.4rem' },
  cardText: { fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5, margin: '0 0 0.85rem' },
  quickChecklist: { display: 'flex', flexWrap: 'wrap' as const, gap: '0.6rem' },
  checkItem: { background: 'rgba(16,185,129,0.12)', color: '#4ade80', borderRadius: '999px', padding: '0.35rem 0.7rem', fontSize: '0.78rem' },
  textarea: {
    width: '100%', padding: '0.6rem 0.85rem', borderRadius: '8px',
    border: '1px solid var(--border)', background: 'var(--bg-primary)',
    color: 'var(--text-primary)', fontSize: '0.85rem', boxSizing: 'border-box' as const,
    resize: 'vertical' as const,
  },
  label: { fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.35rem', textTransform: 'uppercase' as const, letterSpacing: '0.04em' },
  input: {
    width: '100%', padding: '0.6rem 0.85rem', borderRadius: '8px',
    border: '1px solid var(--border)', background: 'var(--bg-primary)',
    color: 'var(--text-primary)', fontSize: '0.85rem', boxSizing: 'border-box' as const,
  },
  select: {
    width: '100%', padding: '0.6rem 0.85rem', borderRadius: '8px',
    border: '1px solid var(--border)', background: 'var(--bg-primary)',
    color: 'var(--text-primary)', fontSize: '0.85rem', boxSizing: 'border-box' as const,
  },
  aptList: { display: 'flex', flexDirection: 'column' as const, gap: '0.75rem' },
  aptRow: {
    display: 'flex', alignItems: 'center', gap: '1rem',
    background: 'var(--bg-card)', border: '1px solid var(--border)',
    borderRadius: '12px', padding: '1rem 1.25rem',
  },
  dotSmall: { width: '8px', height: '8px', borderRadius: '50%', flexShrink: 0 },
  securityNote: {
    background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.15)',
    borderRadius: '10px', padding: '1rem', fontSize: '0.85rem',
    color: '#4ade80', lineHeight: 1.5, marginBottom: '1.5rem',
  },
  recordList: { display: 'flex', flexDirection: 'column' as const, gap: '1rem' },
  recordCard: {
    background: 'var(--bg-card)', border: '1px solid var(--border)',
    borderRadius: '12px', padding: '1.25rem',
  },
  recField: { marginBottom: '0.5rem' },
  recLabel: { fontSize: '0.7rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' as const, letterSpacing: '0.04em' },
  recVal: { fontSize: '0.85rem', color: 'var(--text-secondary)', margin: '0.15rem 0 0', lineHeight: 1.5 },
  consentList: { display: 'flex', flexDirection: 'column' as const, gap: '1rem' },
  consentCard: {
    display: 'flex', alignItems: 'center', gap: '1.25rem',
    background: 'var(--bg-card)', border: '1px solid var(--border)',
    borderRadius: '12px', padding: '1.25rem',
  },
  toggleBtn: {
    width: '48px', height: '26px', borderRadius: '13px',
    border: 'none', cursor: 'pointer', position: 'relative' as const,
    transition: 'background 0.3s', flexShrink: 0,
  },
  toggleKnob: {
    width: '22px', height: '22px', borderRadius: '50%',
    background: '#fff', position: 'absolute' as const, top: '2px',
    transition: 'transform 0.3s', boxShadow: '0 1px 3px rgba(0,0,0,0.3)',
  },
};
