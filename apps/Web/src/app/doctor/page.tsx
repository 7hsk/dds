"use client";

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';

/* ─── Mock Data ──────────────────────────────────── */
const MOCK_PATIENTS = [
  {
    id: 'p1', name: 'Mohamed El Alami', phone: '+212 661-123456', cin: 'AB123456',
    gender: 'M', birthDate: '1985-03-15', city: 'Casablanca',
    records: [
      { date: '2026-06-20', symptoms: 'Tension artérielle élevée (160/95) depuis 3 jours, céphalées légères.', diagnosis: 'HTA Grade 1', prescription: 'Ramipril 5mg/jour' },
      { date: '2026-05-10', symptoms: 'Vertiges occasionnels, fatigue.', diagnosis: 'Suivi HTA', prescription: 'Renouvellement traitement' },
    ],
  },
  {
    id: 'p2', name: 'Fatima Zahra Bennani', phone: '+212 662-987654', cin: 'CD789012',
    gender: 'F', birthDate: '1990-08-22', city: 'Rabat',
    records: [
      { date: '2026-06-15', symptoms: 'Contrôle glycémie — HbA1c à vérifier.', diagnosis: 'Diabète Type 2', prescription: 'Metformine 500mg x2/jour' },
    ],
  },
  {
    id: 'p3', name: 'Youssef Taghi', phone: '+212 663-112233', cin: 'EF345678',
    gender: 'M', birthDate: '2000-01-10', city: 'Marrakech',
    records: [
      { date: '2026-07-01', symptoms: 'Allergies saisonnières, rhinite.', diagnosis: 'Rhinite allergique', prescription: 'Cetirizine 10mg/jour' },
    ],
  },
  {
    id: 'p4', name: 'Khadija Amrani', phone: '+212 664-556677', cin: 'GH901234',
    gender: 'F', birthDate: '1978-12-05', city: 'Fès',
    records: [],
  },
];

const MOCK_APPOINTMENTS = [
  { id: 'a1', patientId: 'p1', time: '09:30', type: 'TELECONSULTATION' as const, status: 'CONFIRMED' as const, whatsappOptIn: true },
  { id: 'a2', patientId: 'p2', time: '11:00', type: 'PHYSICAL' as const, status: 'PENDING' as const, whatsappOptIn: true },
  { id: 'a3', patientId: 'p3', time: '14:00', type: 'TELECONSULTATION' as const, status: 'COMPLETED' as const, whatsappOptIn: false },
  { id: 'a4', patientId: 'p4', time: '16:30', type: 'PHYSICAL' as const, status: 'PENDING' as const, whatsappOptIn: true },
];

const WHATSAPP_LOGS = [
  { time: '08:45', type: 'SENT' as const, msg: "Rappel automatique envoyé à Mohamed El Alami (+212 661-123456)" },
  { time: '08:52', type: 'RECEIVED' as const, msg: "Patient a répondu 'N3am' — confirmation enregistrée." },
  { time: '09:00', type: 'SENT' as const, msg: "Lien téléconsultation envoyé à Mohamed El Alami." },
  { time: '10:30', type: 'SENT' as const, msg: "Rappel automatique envoyé à Fatima Zahra Bennani (+212 662-987654)" },
  { time: '10:35', type: 'RECEIVED' as const, msg: "Fatima a répondu 'Oui merci' — confirmation enregistrée." },
  { time: '13:00', type: 'SENT' as const, msg: "Rappel envoyé à Khadija Amrani (+212 664-556677)" },
];

type Tab = 'agenda' | 'patients' | 'ai' | 'whatsapp' | 'analytics';

/* ─── Component ──────────────────────────────────── */
export default function DoctorDashboard() {
  const [activeTab, setActiveTab] = useState<Tab>('agenda');
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);
  const [appointments, setAppointments] = useState(MOCK_APPOINTMENTS);
  const [logs, setLogs] = useState(WHATSAPP_LOGS);
  const [aiJustification, setAiJustification] = useState('');
  const [aiResult, setAiResult] = useState<any>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiPatientId, setAiPatientId] = useState('p1');
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);

  // New appointment form
  const [newAptPatient, setNewAptPatient] = useState('p1');
  const [newAptTime, setNewAptTime] = useState('');
  const [newAptType, setNewAptType] = useState<'PHYSICAL' | 'TELECONSULTATION'>('PHYSICAL');
  const [showNewAptForm, setShowNewAptForm] = useState(false);

  // New record form
  const [newRecordSymptoms, setNewRecordSymptoms] = useState('');
  const [newRecordDiagnosis, setNewRecordDiagnosis] = useState('');
  const [newRecordPrescription, setNewRecordPrescription] = useState('');
  const [showNewRecordForm, setShowNewRecordForm] = useState(false);
  const [patients, setPatients] = useState(MOCK_PATIENTS);

  const showToast = useCallback((msg: string, type: 'success' | 'error' = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  }, []);

  const getPatient = (id: string) => patients.find((p) => p.id === id);

  /* ─── Handlers ─────────────────────────────────── */
  const handleConfirmAppointment = (aptId: string) => {
    setAppointments((prev) => prev.map((a) => a.id === aptId ? { ...a, status: 'CONFIRMED' as const } : a));
    const apt = appointments.find((a) => a.id === aptId);
    if (apt?.whatsappOptIn) {
      const patient = getPatient(apt.patientId);
      setLogs((prev) => [...prev, {
        time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
        type: 'SENT' as const,
        msg: `Confirmation envoyée à ${patient?.name} (${patient?.phone})`,
      }]);
    }
    showToast('Rendez-vous confirmé & notification envoyée ✓');
  };

  const handleCancelAppointment = (aptId: string) => {
    setAppointments((prev) => prev.map((a) => a.id === aptId ? { ...a, status: 'CANCELLED' as const } : a));
    showToast('Rendez-vous annulé', 'error');
  };

  const handleAddAppointment = () => {
    if (!newAptTime) { showToast('Veuillez saisir une heure', 'error'); return; }
    const newApt = {
      id: `a${Date.now()}`,
      patientId: newAptPatient,
      time: newAptTime,
      type: newAptType,
      status: 'PENDING' as const,
      whatsappOptIn: true,
    };
    setAppointments((prev) => [...prev, newApt]);
    setShowNewAptForm(false);
    setNewAptTime('');
    showToast('Nouveau rendez-vous ajouté ✓');
  };

  const handleAddRecord = () => {
    if (!selectedPatientId || !newRecordSymptoms) { showToast('Remplissez les symptômes', 'error'); return; }
    setPatients((prev) => prev.map((p) => {
      if (p.id !== selectedPatientId) return p;
      return {
        ...p,
        records: [
          { date: new Date().toISOString().split('T')[0], symptoms: newRecordSymptoms, diagnosis: newRecordDiagnosis, prescription: newRecordPrescription },
          ...p.records,
        ],
      };
    }));
    setShowNewRecordForm(false);
    setNewRecordSymptoms(''); setNewRecordDiagnosis(''); setNewRecordPrescription('');
    showToast('Dossier médical mis à jour (chiffré ALE) ✓');
  };

  const handleAiAnalysis = async () => {
    if (!aiJustification.trim()) { showToast('Justification médicale obligatoire (CNDP)', 'error'); return; }
    setAiLoading(true);
    setAiResult(null);

    // Simulate API call to AI service
    await new Promise((r) => setTimeout(r, 1500));

    const patient = getPatient(aiPatientId);
    const lastRecord = patient?.records[0];
    const symptoms = lastRecord?.symptoms?.toLowerCase() || '';

    let result: any;
    if (symptoms.includes('tension') || symptoms.includes('hta') || symptoms.includes('céphalée')) {
      result = {
        diagnoses: ['Hypertension Artérielle Essentielle (Grade 1)'],
        treatments: [{
          name: 'Monothérapie IEC — Ramipril',
          description: 'Initier un inhibiteur de l\'enzyme de conversion en première intention. Surveiller la créatininémie et la kaliémie à J14.',
          dosage: 'Ramipril 5mg 1x/jour le matin',
          sources: ['Guide Marocain de Prise en Charge de l\'HTA (Min. Santé, 2022)', 'OMS — Pharmacological Treatment of Hypertension (2021)'],
        }],
        confidence: 0.92,
      };
    } else if (symptoms.includes('glyc') || symptoms.includes('diabète') || symptoms.includes('hba1c')) {
      result = {
        diagnoses: ['Diabète de Type 2'],
        treatments: [{
          name: 'Metformine + Régime alimentaire',
          description: 'Traitement oral de première ligne si fonction rénale préservée (DFG > 45 ml/min). Accompagner d\'un régime hypo-glucidique.',
          dosage: 'Metformine 500mg 2x/jour aux repas',
          sources: ['Recommandations Nationales Diabète — Maroc (2020)', 'ADA/EASD Consensus Report on Type 2 Diabetes (2022)'],
        }],
        confidence: 0.88,
      };
    } else if (symptoms.includes('allergi') || symptoms.includes('rhinite')) {
      result = {
        diagnoses: ['Rhinite Allergique Saisonnière'],
        treatments: [{
          name: 'Anti-histaminique H1 — Cétirizine',
          description: 'Anti-histaminique non sédatif de 2ème génération. Peut être complété par un spray nasal corticoïde si persistance.',
          dosage: 'Cétirizine 10mg 1x/jour',
          sources: ['ARIA Guidelines Update (2023)', 'Protocole ORL — CHU Ibn Sina Rabat'],
        }],
        confidence: 0.85,
      };
    } else {
      result = {
        diagnoses: ['Présentation clinique indéterminée'],
        treatments: [{
          name: 'Évaluation clinique approfondie recommandée',
          description: 'Les symptômes ne correspondent pas aux protocoles référencés localement. Un examen physique et des bilans standards sont requis.',
          dosage: '-',
          sources: ['Guide de Médecine Générale — Association Médicale Marocaine (Vol. 3)'],
        }],
        confidence: 0.40,
      };
    }

    setAiResult(result);
    setAiLoading(false);

    // Audit log
    console.log(`[CNDP AUDIT] AI triggered | Patient: ${patient?.name} | Actor: DR-001 | Justification: ${aiJustification}`);
  };

  const selectedPatient = selectedPatientId ? getPatient(selectedPatientId) : null;

  /* ─── Render helpers ───────────────────────────── */
  const statusColor = (s: string) => {
    if (s === 'CONFIRMED') return '#10b981';
    if (s === 'PENDING') return '#fbbf24';
    if (s === 'COMPLETED') return '#64748b';
    if (s === 'CANCELLED') return '#ef4444';
    return '#94a3b8';
  };

  const statusLabel = (s: string) => {
    if (s === 'CONFIRMED') return 'Confirmé';
    if (s === 'PENDING') return 'En attente';
    if (s === 'COMPLETED') return 'Terminé';
    if (s === 'CANCELLED') return 'Annulé';
    return s;
  };

  const tabData: { key: Tab; label: string; icon: string }[] = [
    { key: 'agenda', label: 'Agenda', icon: '📅' },
    { key: 'patients', label: 'Patients', icon: '🏥' },
    { key: 'ai', label: 'Assistant IA', icon: '🤖' },
    { key: 'whatsapp', label: 'WhatsApp', icon: '💬' },
    { key: 'analytics', label: 'Analytics', icon: '📊' },
  ];

  /* ─── UI ───────────────────────────────────────── */
  return (
    <div style={S.root}>
      {/* Toast */}
      {toast && (
        <div className="animate-fade" style={{ ...S.toast, background: toast.type === 'success' ? 'linear-gradient(135deg, #10b981, #059669)' : 'linear-gradient(135deg, #ef4444, #dc2626)' }}>
          {toast.msg}
        </div>
      )}

      {/* Top bar */}
      <header style={S.header}>
        <div style={S.headerLeft}>
          <Link href="/" style={{ textDecoration: 'none', color: 'inherit' }}>
            <div style={S.logoBox}>DDS</div>
          </Link>
          <div>
            <h1 style={S.headerTitle}>Espace Médecin</h1>
            <p style={S.headerSub}>Dr. Ahmed Benhaddou — Médecine Générale, Casablanca</p>
          </div>
        </div>
        <div style={S.complianceBadge}>
          <span style={S.complianceDot} />
          CNDP Audit Actif
        </div>
      </header>

      <div style={S.layout}>
        {/* Sidebar */}
        <nav style={S.sidebar}>
          {tabData.map((t) => (
            <button
              key={t.key}
              onClick={() => setActiveTab(t.key)}
              style={{
                ...S.sidebarBtn,
                background: activeTab === t.key ? 'rgba(56, 189, 248, 0.1)' : 'transparent',
                borderColor: activeTab === t.key ? 'rgba(56, 189, 248, 0.3)' : 'transparent',
                color: activeTab === t.key ? '#38bdf8' : '#94a3b8',
              }}
            >
              <span style={{ fontSize: '1.1rem' }}>{t.icon}</span>
              <span>{t.label}</span>
            </button>
          ))}
        </nav>

        {/* Main content */}
        <main style={S.main} className="animate-fade">

          {/* ──── AGENDA TAB ──── */}
          {activeTab === 'agenda' && (
            <div>
              <div style={S.tabHeader}>
                <h2 style={S.tabTitle}>Agenda du jour — {new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</h2>
                <button style={S.primaryBtn} onClick={() => setShowNewAptForm(!showNewAptForm)}>
                  {showNewAptForm ? '✕ Fermer' : '＋ Nouveau RDV'}
                </button>
              </div>

              {showNewAptForm && (
                <div className="animate-slide-down" style={S.formCard}>
                  <h3 style={S.formTitle}>Nouveau Rendez-vous</h3>
                  <div style={S.formGrid}>
                    <div>
                      <label style={S.label}>Patient</label>
                      <select value={newAptPatient} onChange={(e) => setNewAptPatient(e.target.value)} style={S.select}>
                        {patients.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
                      </select>
                    </div>
                    <div>
                      <label style={S.label}>Heure</label>
                      <input type="time" value={newAptTime} onChange={(e) => setNewAptTime(e.target.value)} style={S.input} />
                    </div>
                    <div>
                      <label style={S.label}>Type</label>
                      <select value={newAptType} onChange={(e) => setNewAptType(e.target.value as any)} style={S.select}>
                        <option value="PHYSICAL">Présentiel</option>
                        <option value="TELECONSULTATION">Téléconsultation</option>
                      </select>
                    </div>
                  </div>
                  <button style={S.primaryBtn} onClick={handleAddAppointment}>Confirmer le RDV</button>
                </div>
              )}

              <div style={S.cardGrid}>
                {appointments
                  .sort((a, b) => a.time.localeCompare(b.time))
                  .map((apt) => {
                    const patient = getPatient(apt.patientId);
                    return (
                      <div key={apt.id} style={S.aptCard}>
                        <div style={S.aptTop}>
                          <span style={S.aptTime}>{apt.time}</span>
                          <span style={{ ...S.badge, background: apt.type === 'TELECONSULTATION' ? 'rgba(14, 165, 233, 0.15)' : 'rgba(16, 185, 129, 0.15)', color: apt.type === 'TELECONSULTATION' ? '#38bdf8' : '#4ade80' }}>
                            {apt.type === 'TELECONSULTATION' ? '📹 Téléconsultation' : '🏥 Présentiel'}
                          </span>
                        </div>
                        <h3 style={S.aptName}>{patient?.name || 'Inconnu'}</h3>
                        <p style={S.aptMeta}>{patient?.phone} — {patient?.city}</p>
                        <div style={S.aptBottom}>
                          <span style={{ ...S.statusDot, background: statusColor(apt.status) }} />
                          <span style={{ color: statusColor(apt.status), fontWeight: 600, fontSize: '0.8rem' }}>{statusLabel(apt.status)}</span>
                          {apt.whatsappOptIn && <span style={S.whatsappTag}>WhatsApp ✓</span>}
                        </div>
                        {apt.status === 'PENDING' && (
                          <div style={S.aptActions}>
                            <button style={S.confirmBtn} onClick={() => handleConfirmAppointment(apt.id)}>✓ Confirmer</button>
                            <button style={S.cancelBtn} onClick={() => handleCancelAppointment(apt.id)}>✕ Annuler</button>
                          </div>
                        )}
                        {apt.status === 'CONFIRMED' && apt.type === 'TELECONSULTATION' && (
                          <button style={{ ...S.primaryBtn, marginTop: '0.75rem', width: '100%' }}>
                            📹 Lancer Téléconsultation
                          </button>
                        )}
                      </div>
                    );
                  })}
              </div>
            </div>
          )}

          {/* ──── PATIENTS TAB ──── */}
          {activeTab === 'patients' && (
            <div>
              <h2 style={S.tabTitle}>Dossiers Patients (Chiffrés ALE)</h2>
              <div style={S.patientsLayout}>
                {/* Patient list */}
                <div style={S.patientList}>
                  {patients.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => { setSelectedPatientId(p.id); setShowNewRecordForm(false); }}
                      style={{
                        ...S.patientItem,
                        borderColor: selectedPatientId === p.id ? '#38bdf8' : 'var(--border)',
                        background: selectedPatientId === p.id ? 'rgba(56, 189, 248, 0.05)' : 'var(--bg-card)',
                      }}
                    >
                      <div style={S.avatarCircle}>{p.name.split(' ').map(n => n[0]).join('').slice(0, 2)}</div>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{p.name}</div>
                        <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>{p.city} — {p.records.length} consultation(s)</div>
                      </div>
                    </button>
                  ))}
                </div>

                {/* Patient detail */}
                <div style={S.patientDetail}>
                  {selectedPatient ? (
                    <div className="animate-fade">
                      <div style={S.patientHeader}>
                        <div style={S.patientAvatarLg}>{selectedPatient.name.split(' ').map(n => n[0]).join('').slice(0, 2)}</div>
                        <div>
                          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, margin: 0 }}>{selectedPatient.name}</h3>
                          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: '0.25rem 0 0' }}>{selectedPatient.city} | CIN: {selectedPatient.cin}</p>
                        </div>
                      </div>

                      <div style={S.infoGrid}>
                        <div style={S.infoItem}><span style={S.infoLabel}>Téléphone</span><span style={S.infoValue}>{selectedPatient.phone}</span></div>
                        <div style={S.infoItem}><span style={S.infoLabel}>Sexe</span><span style={S.infoValue}>{selectedPatient.gender === 'M' ? 'Masculin' : 'Féminin'}</span></div>
                        <div style={S.infoItem}><span style={S.infoLabel}>Date de Naissance</span><span style={S.infoValue}>{selectedPatient.birthDate}</span></div>
                        <div style={S.infoItem}><span style={S.infoLabel}>Sécurité</span><span style={{ ...S.infoValue, color: '#10b981' }}>🔒 Chiffré AES-256-GCM</span></div>
                      </div>

                      <div style={S.recordsHeader}>
                        <h4 style={S.subHeading}>Historique Médical</h4>
                        <button style={S.smallBtn} onClick={() => setShowNewRecordForm(!showNewRecordForm)}>
                          {showNewRecordForm ? '✕ Fermer' : '＋ Ajouter'}
                        </button>
                      </div>

                      {showNewRecordForm && (
                        <div className="animate-slide-down" style={S.formCard}>
                          <div style={S.formStack}>
                            <div><label style={S.label}>Symptômes</label><textarea value={newRecordSymptoms} onChange={(e) => setNewRecordSymptoms(e.target.value)} style={S.textarea} placeholder="Décrire les symptômes..." rows={3} /></div>
                            <div><label style={S.label}>Diagnostic</label><input value={newRecordDiagnosis} onChange={(e) => setNewRecordDiagnosis(e.target.value)} style={S.input} placeholder="Ex: HTA Grade 1" /></div>
                            <div><label style={S.label}>Prescription</label><input value={newRecordPrescription} onChange={(e) => setNewRecordPrescription(e.target.value)} style={S.input} placeholder="Ex: Ramipril 5mg/jour" /></div>
                          </div>
                          <button style={S.primaryBtn} onClick={handleAddRecord}>💾 Sauvegarder (Chiffré)</button>
                        </div>
                      )}

                      {selectedPatient.records.length === 0 ? (
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', padding: '2rem 0', textAlign: 'center' }}>Aucun dossier médical enregistré.</p>
                      ) : (
                        <div style={S.recordsList}>
                          {selectedPatient.records.map((r, i) => (
                            <div key={i} style={S.recordCard}>
                              <div style={S.recordDate}>{r.date}</div>
                              <div style={S.recordField}><span style={S.recordLabel}>Symptômes</span><p style={S.recordText}>{r.symptoms}</p></div>
                              <div style={S.recordField}><span style={S.recordLabel}>Diagnostic</span><p style={S.recordText}>{r.diagnosis}</p></div>
                              <div style={S.recordField}><span style={S.recordLabel}>Prescription</span><p style={{ ...S.recordText, color: '#38bdf8' }}>{r.prescription}</p></div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '300px', color: 'var(--text-muted)' }}>
                      ← Sélectionnez un patient
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ──── AI TAB ──── */}
          {activeTab === 'ai' && (
            <div>
              <h2 style={S.tabTitle}>🤖 Assistant IA Médical — Protocoles Marocains & OMS</h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                L'IA analyse les symptômes du patient et suggère des diagnostics et traitements basés sur des
                protocoles validés scientifiquement. Chaque recommandation cite ses sources académiques.
              </p>

              <div style={S.formCard}>
                <div style={S.formGrid}>
                  <div>
                    <label style={S.label}>Patient à analyser</label>
                    <select value={aiPatientId} onChange={(e) => { setAiPatientId(e.target.value); setAiResult(null); }} style={S.select}>
                      {patients.filter(p => p.records.length > 0).map((p) => <option key={p.id} value={p.id}>{p.name} — {p.records[0]?.diagnosis || 'N/A'}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={S.label}>Justification Médicale (obligatoire CNDP)</label>
                    <input value={aiJustification} onChange={(e) => setAiJustification(e.target.value)} style={S.input} placeholder="Ex: Révision du protocole thérapeutique avant ordonnance" />
                  </div>
                </div>
                <button style={{ ...S.primaryBtn, marginTop: '1rem', background: 'linear-gradient(135deg, #8b5cf6, #6366f1)' }} onClick={handleAiAnalysis} disabled={aiLoading}>
                  {aiLoading ? '⏳ Analyse en cours...' : '🔬 Lancer l\'analyse IA'}
                </button>
              </div>

              {aiResult && (
                <div className="animate-fade" style={{ ...S.formCard, marginTop: '1.5rem', border: '1px solid rgba(139, 92, 246, 0.3)' }}>
                  <div style={S.aiHeader}>
                    <div>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Diagnostic Suggéré</span>
                      <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: '0.25rem 0 0', color: '#f8fafc' }}>{aiResult.diagnoses.join(', ')}</h3>
                    </div>
                    <div style={{
                      ...S.confidenceBadge,
                      background: aiResult.confidence >= 0.8 ? 'rgba(16, 185, 129, 0.15)' : 'rgba(251, 191, 36, 0.15)',
                      color: aiResult.confidence >= 0.8 ? '#4ade80' : '#fbbf24',
                    }}>
                      Confiance: {Math.round(aiResult.confidence * 100)}%
                    </div>
                  </div>

                  {aiResult.treatments.map((tx: any, i: number) => (
                    <div key={i} style={S.treatmentBlock}>
                      <h4 style={{ fontSize: '1rem', fontWeight: 700, margin: '0 0 0.5rem', color: '#e2e8f0' }}>💊 {tx.name}</h4>
                      <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6, margin: '0 0 0.5rem' }}>{tx.description}</p>
                      <p style={{ fontSize: '0.85rem', color: '#38bdf8', margin: '0 0 0.75rem' }}>Posologie: <code style={{ background: 'rgba(56, 189, 248, 0.1)', padding: '0.15rem 0.4rem', borderRadius: '4px' }}>{tx.dosage}</code></p>
                      <div style={S.sourcesBox}>
                        <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#a78bfa', textTransform: 'uppercase', letterSpacing: '0.05em' }}>📚 Sources Académiques Validées</span>
                        <ul style={S.sourceList}>
                          {tx.sources.map((s: string, j: number) => <li key={j}>{s}</li>)}
                        </ul>
                      </div>
                    </div>
                  ))}

                  <p style={{ fontSize: '0.75rem', color: '#f43f5e', fontStyle: 'italic', margin: '0.5rem 0 0' }}>
                    ⚠️ Avis consultatif uniquement. La décision thérapeutique finale appartient au médecin traitant, conformément à la Loi 131-13 et aux obligations de l'Ordre des Médecins (CNOM).
                  </p>
                </div>
              )}
            </div>
          )}

          {/* ──── WHATSAPP TAB ──── */}
          {activeTab === 'whatsapp' && (
            <div>
              <h2 style={S.tabTitle}>💬 WhatsApp Business API — Notifications</h2>
              <div style={S.statsRow}>
                <div style={S.statCard}><span style={S.statVal}>94%</span><span style={S.statLbl}>Taux Réponse</span></div>
                <div style={S.statCard}><span style={{ ...S.statVal, color: '#4ade80' }}>-45%</span><span style={S.statLbl}>RDV Manqués</span></div>
                <div style={S.statCard}><span style={{ ...S.statVal, color: '#fbbf24' }}>{logs.length}</span><span style={S.statLbl}>Messages Aujourd'hui</span></div>
                <div style={S.statCard}><span style={{ ...S.statVal, color: '#a78bfa' }}>E2E</span><span style={S.statLbl}>Chiffrement</span></div>
              </div>
              <div style={S.logContainer}>
                <h3 style={S.subHeading}>Journal des Notifications</h3>
                <div style={S.logBox}>
                  {logs.map((log, i) => (
                    <div key={i} style={S.logLine}>
                      <span style={{ color: 'var(--text-muted)', marginRight: '0.75rem', fontWeight: 600 }}>[{log.time}]</span>
                      <span style={{
                        ...S.logTypeBadge,
                        background: log.type === 'SENT' ? 'rgba(56, 189, 248, 0.15)' : 'rgba(74, 222, 128, 0.15)',
                        color: log.type === 'SENT' ? '#38bdf8' : '#4ade80',
                      }}>{log.type === 'SENT' ? '↑ ENVOYÉ' : '↓ REÇU'}</span>
                      <span>{log.msg}</span>
                    </div>
                  ))}
                </div>
              </div>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '1rem', lineHeight: 1.5 }}>
                🔒 Les messages WhatsApp sont chiffrés de bout en bout et ne contiennent aucun dossier médical complet.
                Seuls les identifiants minimaux (nom, heure) sont transmis, conformément aux recommandations de la CNDP.
              </p>
            </div>
          )}

          {/* ──── ANALYTICS TAB ──── */}
          {activeTab === 'analytics' && (
            <div>
              <h2 style={S.tabTitle}>📊 Tableau de Bord — Statistiques Cabinet</h2>
              <div style={S.statsRow}>
                <div style={S.statCard}><span style={S.statVal}>{patients.length}</span><span style={S.statLbl}>Patients Total</span></div>
                <div style={S.statCard}><span style={{ ...S.statVal, color: '#4ade80' }}>{appointments.filter(a => a.status === 'CONFIRMED').length}</span><span style={S.statLbl}>RDV Confirmés</span></div>
                <div style={S.statCard}><span style={{ ...S.statVal, color: '#fbbf24' }}>{appointments.filter(a => a.status === 'PENDING').length}</span><span style={S.statLbl}>En Attente</span></div>
                <div style={S.statCard}><span style={{ ...S.statVal, color: '#f43f5e' }}>{appointments.filter(a => a.status === 'CANCELLED').length}</span><span style={S.statLbl}>Annulés</span></div>
              </div>

              <div style={{ ...S.formCard, marginTop: '1.5rem' }}>
                <h3 style={S.subHeading}>Répartition des Consultations</h3>
                <div style={{ display: 'flex', gap: '2rem', marginTop: '1rem', flexWrap: 'wrap' as const }}>
                  <div style={S.chartBar}>
                    <div style={{ ...S.bar, height: `${(appointments.filter(a => a.type === 'PHYSICAL').length / appointments.length) * 200}px`, background: 'var(--gradient-success)' }} />
                    <span style={S.barLabel}>Présentiel ({appointments.filter(a => a.type === 'PHYSICAL').length})</span>
                  </div>
                  <div style={S.chartBar}>
                    <div style={{ ...S.bar, height: `${(appointments.filter(a => a.type === 'TELECONSULTATION').length / appointments.length) * 200}px`, background: 'var(--gradient-primary)' }} />
                    <span style={S.barLabel}>Téléconsultation ({appointments.filter(a => a.type === 'TELECONSULTATION').length})</span>
                  </div>
                </div>
              </div>

              <div style={{ ...S.formCard, marginTop: '1.5rem' }}>
                <h3 style={S.subHeading}>Engagement WhatsApp</h3>
                <div style={{ display: 'flex', gap: '2rem', marginTop: '1rem', flexWrap: 'wrap' as const }}>
                  <div style={S.chartBar}>
                    <div style={{ ...S.bar, height: '160px', background: 'linear-gradient(135deg, #22c55e, #16a34a)' }} />
                    <span style={S.barLabel}>Opt-In ({appointments.filter(a => a.whatsappOptIn).length})</span>
                  </div>
                  <div style={S.chartBar}>
                    <div style={{ ...S.bar, height: '40px', background: 'linear-gradient(135deg, #64748b, #475569)' }} />
                    <span style={S.barLabel}>Opt-Out ({appointments.filter(a => !a.whatsappOptIn).length})</span>
                  </div>
                </div>
              </div>
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
    fontWeight: 600, fontSize: '0.85rem', zIndex: 1000,
    boxShadow: '0 8px 30px rgba(0,0,0,0.3)',
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
    background: 'linear-gradient(135deg, #0ea5e9, #2563eb)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontWeight: 800, fontSize: '0.9rem', color: '#fff',
    boxShadow: '0 0 12px rgba(14,165,233,0.3)',
  },
  headerTitle: { fontSize: '1.1rem', fontWeight: 700, margin: 0 },
  headerSub: { fontSize: '0.75rem', color: 'var(--text-muted)', margin: '0.15rem 0 0' },
  complianceBadge: {
    display: 'flex', alignItems: 'center', gap: '0.5rem',
    background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)',
    padding: '0.4rem 0.85rem', borderRadius: '30px',
    fontSize: '0.75rem', color: '#34d399', fontWeight: 600,
  },
  complianceDot: { width: '7px', height: '7px', background: '#10b981', borderRadius: '50%', boxShadow: '0 0 6px #10b981', display: 'inline-block' },
  layout: { display: 'flex', flex: 1 },
  sidebar: {
    width: '200px', borderRight: '1px solid var(--border)',
    padding: '1.5rem 0.75rem', display: 'flex', flexDirection: 'column', gap: '0.4rem',
    background: 'var(--bg-secondary)', flexShrink: 0,
  },
  sidebarBtn: {
    display: 'flex', alignItems: 'center', gap: '0.65rem',
    padding: '0.7rem 0.85rem', borderRadius: '10px',
    fontSize: '0.85rem', fontWeight: 600,
    border: '1px solid transparent', cursor: 'pointer',
    transition: 'all 0.2s',
    textAlign: 'left' as const, width: '100%',
  },
  main: { flex: 1, padding: '2rem', overflowY: 'auto', maxHeight: 'calc(100vh - 65px)' },
  tabHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap' as const, gap: '1rem' },
  tabTitle: { fontSize: '1.3rem', fontWeight: 800, margin: 0 },
  primaryBtn: {
    background: 'var(--gradient-primary)', color: '#fff',
    padding: '0.6rem 1.25rem', borderRadius: '10px',
    fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer',
    border: 'none', transition: 'opacity 0.2s',
  },
  smallBtn: {
    background: 'rgba(56,189,248,0.1)', color: '#38bdf8',
    padding: '0.4rem 0.85rem', borderRadius: '8px',
    fontWeight: 600, fontSize: '0.8rem', cursor: 'pointer',
    border: '1px solid rgba(56,189,248,0.2)', transition: 'all 0.2s',
  },
  formCard: {
    background: 'var(--bg-card)', border: '1px solid var(--border)',
    borderRadius: '14px', padding: '1.5rem', marginBottom: '1.5rem',
  },
  formTitle: { fontSize: '1rem', fontWeight: 700, marginBottom: '1rem' },
  formGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginBottom: '1rem' },
  formStack: { display: 'flex', flexDirection: 'column' as const, gap: '1rem', marginBottom: '1rem' },
  label: { fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.35rem', textTransform: 'uppercase' as const, letterSpacing: '0.04em' },
  input: {
    width: '100%', padding: '0.6rem 0.85rem', borderRadius: '8px',
    border: '1px solid var(--border)', background: 'var(--bg-primary)',
    color: 'var(--text-primary)', fontSize: '0.85rem',
    boxSizing: 'border-box' as const,
  },
  textarea: {
    width: '100%', padding: '0.6rem 0.85rem', borderRadius: '8px',
    border: '1px solid var(--border)', background: 'var(--bg-primary)',
    color: 'var(--text-primary)', fontSize: '0.85rem', resize: 'vertical' as const,
    boxSizing: 'border-box' as const,
  },
  select: {
    width: '100%', padding: '0.6rem 0.85rem', borderRadius: '8px',
    border: '1px solid var(--border)', background: 'var(--bg-primary)',
    color: 'var(--text-primary)', fontSize: '0.85rem',
    boxSizing: 'border-box' as const,
  },
  cardGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.25rem' },
  aptCard: {
    background: 'var(--bg-card)', border: '1px solid var(--border)',
    borderRadius: '14px', padding: '1.25rem',
    transition: 'border-color 0.2s, box-shadow 0.2s',
  },
  aptTop: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' },
  aptTime: { fontSize: '1.35rem', fontWeight: 800, color: '#e2e8f0' },
  badge: { padding: '0.25rem 0.65rem', borderRadius: '20px', fontSize: '0.7rem', fontWeight: 700 },
  aptName: { fontSize: '1rem', fontWeight: 700, margin: '0 0 0.3rem' },
  aptMeta: { fontSize: '0.8rem', color: 'var(--text-muted)', margin: '0 0 0.75rem' },
  aptBottom: { display: 'flex', alignItems: 'center', gap: '0.5rem' },
  statusDot: { width: '8px', height: '8px', borderRadius: '50%', flexShrink: 0 },
  whatsappTag: { marginLeft: 'auto', fontSize: '0.7rem', color: '#22c55e', fontWeight: 600 },
  aptActions: { display: 'flex', gap: '0.5rem', marginTop: '0.75rem' },
  confirmBtn: {
    flex: 1, padding: '0.5rem', borderRadius: '8px', fontWeight: 600, fontSize: '0.8rem',
    background: 'rgba(16,185,129,0.15)', color: '#4ade80', border: '1px solid rgba(16,185,129,0.3)',
    cursor: 'pointer',
  },
  cancelBtn: {
    flex: 1, padding: '0.5rem', borderRadius: '8px', fontWeight: 600, fontSize: '0.8rem',
    background: 'rgba(239,68,68,0.1)', color: '#f87171', border: '1px solid rgba(239,68,68,0.2)',
    cursor: 'pointer',
  },
  patientsLayout: { display: 'flex', gap: '1.5rem', marginTop: '1rem' },
  patientList: { width: '280px', display: 'flex', flexDirection: 'column' as const, gap: '0.5rem', flexShrink: 0 },
  patientItem: {
    display: 'flex', alignItems: 'center', gap: '0.75rem',
    padding: '0.85rem', borderRadius: '12px', cursor: 'pointer',
    border: '1px solid var(--border)', transition: 'all 0.2s',
    textAlign: 'left' as const, width: '100%', color: 'inherit',
  },
  avatarCircle: {
    width: '38px', height: '38px', borderRadius: '50%',
    background: 'var(--gradient-primary)', display: 'flex',
    alignItems: 'center', justifyContent: 'center',
    fontSize: '0.75rem', fontWeight: 800, color: '#fff', flexShrink: 0,
  },
  patientDetail: { flex: 1, minWidth: 0 },
  patientHeader: { display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' },
  patientAvatarLg: {
    width: '52px', height: '52px', borderRadius: '50%',
    background: 'var(--gradient-primary)', display: 'flex',
    alignItems: 'center', justifyContent: 'center',
    fontSize: '1rem', fontWeight: 800, color: '#fff', flexShrink: 0,
  },
  infoGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginBottom: '1.5rem' },
  infoItem: {
    background: 'var(--bg-card)', padding: '0.85rem 1rem', borderRadius: '10px',
    border: '1px solid var(--border)',
  },
  infoLabel: { display: 'block', fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase' as const, letterSpacing: '0.04em', marginBottom: '0.25rem' },
  infoValue: { fontWeight: 600, fontSize: '0.85rem' },
  recordsHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' },
  subHeading: { fontSize: '0.95rem', fontWeight: 700, margin: 0 },
  recordsList: { display: 'flex', flexDirection: 'column' as const, gap: '1rem' },
  recordCard: {
    background: 'var(--bg-card)', border: '1px solid var(--border)',
    borderRadius: '12px', padding: '1.25rem',
  },
  recordDate: { fontSize: '0.75rem', fontWeight: 700, color: 'var(--accent-blue)', marginBottom: '0.75rem' },
  recordField: { marginBottom: '0.5rem' },
  recordLabel: { fontSize: '0.7rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' as const, letterSpacing: '0.04em' },
  recordText: { fontSize: '0.85rem', color: 'var(--text-secondary)', margin: '0.2rem 0 0', lineHeight: 1.5 },
  aiHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem', gap: '1rem', flexWrap: 'wrap' as const },
  confidenceBadge: { padding: '0.35rem 0.75rem', borderRadius: '8px', fontWeight: 700, fontSize: '0.8rem' },
  treatmentBlock: {
    background: 'var(--bg-primary)', padding: '1.25rem', borderRadius: '10px',
    marginBottom: '0.75rem', border: '1px solid var(--border)',
  },
  sourcesBox: {
    background: 'rgba(139,92,246,0.06)', padding: '0.85rem',
    borderRadius: '8px', border: '1px solid rgba(139,92,246,0.15)',
  },
  sourceList: { margin: '0.4rem 0 0', paddingLeft: '1.2rem', fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.5 },
  statsRow: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '1rem', marginBottom: '1.5rem' },
  statCard: {
    background: 'var(--bg-card)', border: '1px solid var(--border)',
    borderRadius: '14px', padding: '1.5rem',
    textAlign: 'center' as const,
  },
  statVal: { display: 'block', fontSize: '2rem', fontWeight: 900, color: '#38bdf8' },
  statLbl: { fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 500, textTransform: 'uppercase' as const, letterSpacing: '0.04em' },
  logContainer: { marginTop: '1.5rem' },
  logBox: {
    background: '#000', borderRadius: '12px', padding: '1.25rem',
    fontFamily: "'JetBrains Mono', 'Fira Code', monospace", fontSize: '0.8rem',
    maxHeight: '400px', overflowY: 'auto' as const,
    display: 'flex', flexDirection: 'column' as const, gap: '0.65rem',
    border: '1px solid #1e293b',
  },
  logLine: { display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' as const, lineHeight: 1.5 },
  logTypeBadge: { padding: '0.15rem 0.45rem', borderRadius: '4px', fontWeight: 700, fontSize: '0.65rem' },
  chartBar: { display: 'flex', flexDirection: 'column' as const, alignItems: 'center', gap: '0.5rem', justifyContent: 'flex-end', minHeight: '230px' },
  bar: { width: '80px', borderRadius: '8px 8px 0 0', transition: 'height 0.5s ease' },
  barLabel: { fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600, textAlign: 'center' as const },
};
