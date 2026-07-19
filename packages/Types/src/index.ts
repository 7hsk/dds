export type Role = 'DOCTOR' | 'PATIENT' | 'STAFF' | 'ADMIN';

export interface User {
  id: string;
  email: string;
  fullName: string;
  phone: string;
  role: Role;
  createdAt: Date;
  updatedAt: Date;
}

export interface DoctorProfile {
  id: string;
  userId: string;
  specialty: string;
  licenseNumber: string; // CNOM registration number
  cabinetAddress: string;
  city: string;
}

export interface PatientProfile {
  id: string;
  userId: string;
  cin: string; // Carte d'Identité Nationale
  birthDate: Date;
  gender: 'M' | 'F';
  address?: string;
}

export type ConsultationType = 'PHYSICAL' | 'TELECONSULTATION';
export type AppointmentStatus = 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';

export interface Appointment {
  id: string;
  patientId: string;
  doctorId: string;
  dateTime: Date;
  type: ConsultationType;
  status: AppointmentStatus;
  whatsappOptIn: boolean; // Indicates patient agreed to WhatsApp notifications
  telecomRoomUrl?: string; // WebRTC link
  notes?: string;
  createdAt: Date;
}

export interface MedicalRecord {
  id: string;
  patientId: string;
  doctorId: string;
  symptomsEncrypted: string;      // Encrypted ALE (Application Level Encryption)
  diagnosesEncrypted: string;     // Encrypted ALE
  prescriptionsEncrypted: string; // Encrypted ALE
  additionalNotesEncrypted?: string; // Encrypted ALE
  createdAt: Date;
  updatedAt: Date;
}

export interface ConsentLog {
  id: string;
  patientId: string;
  consentType: 'TELECONSULTATION' | 'WHATSAPP_REMINDERS' | 'DATA_TREATMENT';
  isGranted: boolean;
  timestamp: Date;
  ipAddress: string;
  signatureImageUri?: string; // Consent signature storing
}

export interface AuditLog {
  id: string;
  actorId: string; // ID of Doctor/Staff accessing
  action: 'READ_RECORD' | 'WRITE_RECORD' | 'DELETE_RECORD' | 'EXPORT_DATA';
  patientId: string;
  timestamp: Date;
  ipAddress: string;
  userAgent: string;
  justification?: string; // Specific CNDP audit requirement
}

export interface AiRecommendation {
  id: string;
  patientId: string;
  suggestedDiagnoses: string[];
  suggestedTreatments: Array<{
    name: string;
    description: string;
    dosage?: string;
    academicSources: string[]; // Academic articles or medical textbooks validating the recommendation
  }>;
  confidenceScore: number;
  timestamp: Date;
}
