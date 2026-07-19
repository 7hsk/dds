"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

const FEATURES = [
  {
    icon: '📅',
    title: 'Gestion Rendez-vous',
    desc: 'Agenda intelligent, rappels WhatsApp automatiques, réduction de 45% des absences.',
    gradient: 'linear-gradient(135deg, #0ea5e9, #2563eb)',
  },
  {
    icon: '🔒',
    title: 'Dossier Patient Chiffré',
    desc: 'Chiffrement AES-256-GCM conforme CNDP. Vos données médicales en toute sécurité.',
    gradient: 'linear-gradient(135deg, #10b981, #059669)',
  },
  {
    icon: '🤖',
    title: 'Assistant IA Médical',
    desc: 'Suggestions thérapeutiques basées sur les protocoles OMS et marocains, avec sources citées.',
    gradient: 'linear-gradient(135deg, #8b5cf6, #6366f1)',
  },
  {
    icon: '📱',
    title: 'Téléconsultation Vidéo',
    desc: 'Visioconférence chiffrée intégrée au dossier patient. Conforme Loi 131-13.',
    gradient: 'linear-gradient(135deg, #f59e0b, #d97706)',
  },
  {
    icon: '💬',
    title: 'WhatsApp Business API',
    desc: 'Confirmations en darija, rappels automatiques, questionnaires pré-consultation.',
    gradient: 'linear-gradient(135deg, #22c55e, #16a34a)',
  },
  {
    icon: '📊',
    title: 'Tableau de Bord Analytics',
    desc: 'Statistiques cabinet, taux d\'absentéisme, satisfaction patients, performance.',
    gradient: 'linear-gradient(135deg, #ec4899, #db2777)',
  },
];

const STATS = [
  { value: '99.9%', label: 'Disponibilité', icon: '🟢' },
  { value: 'AES-256', label: 'Chiffrement', icon: '🔐' },
  { value: '-45%', label: 'RDV Manqués', icon: '📉' },
  { value: 'ISO 27001', label: 'Certifié', icon: '✅' },
];

export default function LandingPage() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
      {/* Navigation */}
      <nav style={styles.nav}>
        <div style={styles.navInner}>
          <div style={styles.logoArea}>
            <div style={styles.logoIcon}>DDS</div>
            <div>
              <span style={styles.logoText}>Doctor Digital System</span>
              <span style={styles.logoSub}>Morocco E-Health</span>
            </div>
          </div>
          <div style={styles.navLinks}>
            <a href="#features" style={styles.navLink}>Fonctionnalités</a>
            <a href="#compliance" style={styles.navLink}>Conformité</a>
            <Link href="/doctor" style={styles.navBtn}>
              Espace Médecin →
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section style={styles.hero}>
        <div style={{
          ...styles.heroContent,
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
          transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
        }}>
          <div style={styles.badge}>
            <span style={styles.badgeDot} />
            Conforme CNDP & Loi 09-08
          </div>
          <h1 style={styles.heroTitle}>
            La plateforme médicale
            <br />
            <span style={styles.heroGradient}>intelligente du Maroc</span>
          </h1>
          <p style={styles.heroDesc}>
            Gérez vos consultations, dossiers patients et téléconsultations avec un assistant IA
            qui cite ses sources. Chiffrement de bout en bout, conforme aux lois marocaines.
          </p>
          <div style={styles.heroCTA}>
            <Link href="/doctor" style={styles.ctaPrimary}>
              Accéder au Dashboard Médecin
            </Link>
            <Link href="/patient" style={styles.ctaSecondary}>
              Espace Patient
            </Link>
          </div>
        </div>

        {/* Animated background particles */}
        <div style={styles.heroDecor}>
          <div style={{ ...styles.orb, top: '10%', left: '10%', width: '300px', height: '300px', background: 'radial-gradient(circle, rgba(56, 189, 248, 0.08) 0%, transparent 70%)' }} />
          <div style={{ ...styles.orb, bottom: '10%', right: '10%', width: '400px', height: '400px', background: 'radial-gradient(circle, rgba(139, 92, 246, 0.06) 0%, transparent 70%)' }} />
          <div style={{ ...styles.orb, top: '50%', left: '50%', width: '250px', height: '250px', background: 'radial-gradient(circle, rgba(16, 185, 129, 0.05) 0%, transparent 70%)', transform: 'translate(-50%, -50%)' }} />
        </div>
      </section>

      {/* Stats bar */}
      <section style={styles.statsBar}>
        {STATS.map((stat, i) => (
          <div key={i} style={styles.statItem}>
            <span style={{ fontSize: '1.5rem' }}>{stat.icon}</span>
            <span style={styles.statValue}>{stat.value}</span>
            <span style={styles.statLabel}>{stat.label}</span>
          </div>
        ))}
      </section>

      {/* Features Grid */}
      <section id="features" style={styles.featuresSection}>
        <h2 style={styles.sectionTitle}>Tout ce qu'il faut pour votre cabinet</h2>
        <p style={styles.sectionDesc}>
          Une suite complète d'outils médicaux numériques, conçue spécifiquement pour le contexte marocain.
        </p>
        <div style={styles.featuresGrid}>
          {FEATURES.map((feature, i) => (
            <div
              key={i}
              style={{
                ...styles.featureCard,
                animationDelay: `${i * 0.1}s`,
              }}
              className="animate-fade"
            >
              <div style={{ ...styles.featureIconBox, background: feature.gradient }}>
                <span style={{ fontSize: '1.5rem' }}>{feature.icon}</span>
              </div>
              <h3 style={styles.featureTitle}>{feature.title}</h3>
              <p style={styles.featureDesc}>{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Compliance Section */}
      <section id="compliance" style={styles.complianceSection}>
        <div style={styles.complianceInner}>
          <div style={styles.complianceText}>
            <h2 style={styles.sectionTitle}>100% Conforme au cadre légal marocain</h2>
            <div style={styles.lawList}>
              {[
                { law: 'Loi 09-08', desc: 'Protection des données personnelles — chiffrement AES-256-GCM, consentement explicite, journalisation CNDP.' },
                { law: 'Loi 131-13', desc: 'Télémédecine — enregistrement des actes, consentement patient, intégration au dossier médical.' },
                { law: 'Décret 2-18-378', desc: 'Téléconsultation, téléexpertise, télésurveillance — toutes les formes d\'actes sont supportées.' },
                { law: 'Décret 2-20-675', desc: 'Autorisation préalable CNDP pour le traitement des données médicales numériques.' },
                { law: 'CNOM', desc: 'L\'IA ne suggère que des protocoles validés scientifiquement, avec sources académiques citées.' },
              ].map((item, i) => (
                <div key={i} style={styles.lawItem}>
                  <div style={styles.lawBadge}>{item.law}</div>
                  <p style={styles.lawDesc}>{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={styles.footer}>
        <div style={styles.footerInner}>
          <div>
            <div style={{ ...styles.logoArea, marginBottom: '0.5rem' }}>
              <div style={styles.logoIcon}>DDS</div>
              <span style={styles.logoText}>Doctor Digital System</span>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
              Plateforme E-Santé conforme au cadre légal marocain.
            </p>
          </div>
          <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
            © 2026 DDS Morocco. Tous droits réservés.
          </div>
        </div>
      </footer>
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  nav: {
    position: 'sticky', top: 0, zIndex: 100,
    background: 'rgba(10, 14, 26, 0.85)', backdropFilter: 'blur(20px)',
    borderBottom: '1px solid var(--border)',
  },
  navInner: {
    maxWidth: '1280px', margin: '0 auto', padding: '1rem 2rem',
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
  },
  logoArea: { display: 'flex', alignItems: 'center', gap: '0.75rem' },
  logoIcon: {
    width: '40px', height: '40px', borderRadius: '10px',
    background: 'linear-gradient(135deg, #0ea5e9, #2563eb)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontWeight: 800, fontSize: '0.95rem', color: '#fff',
    boxShadow: '0 0 15px rgba(14, 165, 233, 0.4)',
  },
  logoText: { fontWeight: 700, fontSize: '1.05rem', display: 'block', letterSpacing: '-0.02em' },
  logoSub: { fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block' },
  navLinks: { display: 'flex', alignItems: 'center', gap: '1.5rem' },
  navLink: {
    color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: 500,
    transition: 'color 0.2s',
  },
  navBtn: {
    background: 'var(--gradient-primary)', color: '#fff',
    padding: '0.55rem 1.25rem', borderRadius: '8px',
    fontWeight: 600, fontSize: '0.85rem',
  },
  hero: {
    position: 'relative', padding: '8rem 2rem 4rem',
    display: 'flex', justifyContent: 'center', overflow: 'hidden',
  },
  heroContent: { maxWidth: '800px', textAlign: 'center' as const, position: 'relative', zIndex: 2 },
  badge: {
    display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
    background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.2)',
    padding: '0.4rem 1rem', borderRadius: '30px',
    fontSize: '0.8rem', color: '#34d399', fontWeight: 600, marginBottom: '2rem',
  },
  badgeDot: {
    width: '7px', height: '7px', background: '#10b981',
    borderRadius: '50%', boxShadow: '0 0 8px #10b981', display: 'inline-block',
  },
  heroTitle: { fontSize: '3.5rem', fontWeight: 900, lineHeight: 1.1, letterSpacing: '-0.03em', marginBottom: '1.5rem' },
  heroGradient: {
    background: 'linear-gradient(135deg, #38bdf8, #818cf8, #a78bfa)',
    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
  },
  heroDesc: {
    fontSize: '1.15rem', color: 'var(--text-secondary)', lineHeight: 1.7,
    maxWidth: '600px', margin: '0 auto 2.5rem',
  },
  heroCTA: { display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' as const },
  ctaPrimary: {
    background: 'var(--gradient-primary)', color: '#fff',
    padding: '0.85rem 2rem', borderRadius: '12px',
    fontWeight: 700, fontSize: '1rem',
    boxShadow: '0 4px 25px rgba(14, 165, 233, 0.3)',
    transition: 'transform 0.2s, box-shadow 0.2s',
  },
  ctaSecondary: {
    background: 'transparent', color: 'var(--text-primary)',
    padding: '0.85rem 2rem', borderRadius: '12px',
    fontWeight: 600, fontSize: '1rem',
    border: '1px solid var(--border)',
    transition: 'border-color 0.2s',
  },
  heroDecor: { position: 'absolute' as const, inset: 0, pointerEvents: 'none' as const },
  orb: { position: 'absolute' as const, borderRadius: '50%', filter: 'blur(40px)' },
  statsBar: {
    display: 'flex', justifyContent: 'center', gap: '3rem',
    padding: '2.5rem 2rem',
    background: 'var(--bg-secondary)',
    borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)',
    flexWrap: 'wrap' as const,
  },
  statItem: {
    display: 'flex', flexDirection: 'column' as const, alignItems: 'center', gap: '0.25rem',
    minWidth: '120px',
  },
  statValue: { fontSize: '1.35rem', fontWeight: 800, color: 'var(--accent-blue)' },
  statLabel: { fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 500, textTransform: 'uppercase' as const, letterSpacing: '0.05em' },
  featuresSection: {
    padding: '5rem 2rem', maxWidth: '1200px', margin: '0 auto',
    textAlign: 'center' as const,
  },
  sectionTitle: { fontSize: '2rem', fontWeight: 800, marginBottom: '0.75rem', letterSpacing: '-0.02em' },
  sectionDesc: { color: 'var(--text-secondary)', fontSize: '1.05rem', maxWidth: '600px', margin: '0 auto 3rem' },
  featuresGrid: {
    display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
    gap: '1.5rem', textAlign: 'left' as const,
  },
  featureCard: {
    background: 'var(--bg-card)', border: '1px solid var(--border)',
    borderRadius: '16px', padding: '1.75rem',
    transition: 'border-color 0.3s, transform 0.3s, box-shadow 0.3s',
  },
  featureIconBox: {
    width: '48px', height: '48px', borderRadius: '12px',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    marginBottom: '1rem',
  },
  featureTitle: { fontSize: '1.05rem', fontWeight: 700, marginBottom: '0.5rem' },
  featureDesc: { fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6 },
  complianceSection: {
    padding: '5rem 2rem',
    background: 'var(--bg-secondary)', borderTop: '1px solid var(--border)',
  },
  complianceInner: { maxWidth: '900px', margin: '0 auto' },
  complianceText: {},
  lawList: { display: 'flex', flexDirection: 'column' as const, gap: '1.25rem', marginTop: '2rem' },
  lawItem: {
    display: 'flex', alignItems: 'flex-start', gap: '1rem',
    background: 'var(--bg-card)', border: '1px solid var(--border)',
    borderRadius: '12px', padding: '1.25rem',
  },
  lawBadge: {
    background: 'rgba(56, 189, 248, 0.1)', color: 'var(--accent-blue)',
    padding: '0.3rem 0.75rem', borderRadius: '6px', fontWeight: 700,
    fontSize: '0.8rem', whiteSpace: 'nowrap' as const,
    border: '1px solid rgba(56, 189, 248, 0.2)',
    flexShrink: 0,
  },
  lawDesc: { fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 },
  footer: {
    padding: '2.5rem 2rem', borderTop: '1px solid var(--border)',
    background: 'var(--bg-primary)',
  },
  footerInner: {
    maxWidth: '1200px', margin: '0 auto',
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    flexWrap: 'wrap' as const, gap: '1rem',
  },
};
