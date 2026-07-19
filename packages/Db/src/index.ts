import { PrismaClient } from '@prisma/client';
import * as crypto from 'crypto';

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 12;
const TAG_LENGTH = 16;

// Retrieves the encryption master key from environment variables
const ENCRYPTION_KEY = process.env.DATABASE_ENCRYPTION_KEY || 'default-secret-key-32-chars-long!'; // Must be 32 bytes

/**
 * Encrypts cleartext data using AES-256-GCM (Application-Level Encryption)
 * compliance with Law 09-08.
 */
export function encrypt(text: string): string {
  if (!text) return '';
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(
    ALGORITHM,
    Buffer.from(ENCRYPTION_KEY.padEnd(32).substring(0, 32)),
    iv
  );
  
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  const authTag = cipher.getAuthTag().toString('hex');
  
  // Format: iv:encryptedData:authTag
  return `${iv.toString('hex')}:${encrypted}:${authTag}`;
}

/**
 * Decrypts cyphertext data using AES-256-GCM
 */
export function decrypt(encryptedText: string): string {
  if (!encryptedText) return '';
  const parts = encryptedText.split(':');
  if (parts.length !== 3) {
    // Return raw if it doesn't match the format (e.g. legacy/unencrypted data)
    return encryptedText;
  }
  
  const [ivHex, encryptedHex, tagHex] = parts;
  const iv = Buffer.from(ivHex, 'hex');
  const tag = Buffer.from(tagHex, 'hex');
  const encrypted = Buffer.from(encryptedHex, 'hex');
  
  const decipher = crypto.createDecipheriv(
    ALGORITHM,
    Buffer.from(ENCRYPTION_KEY.padEnd(32).substring(0, 32)),
    iv
  );
  
  decipher.setAuthTag(tag);
  let decrypted = decipher.update(encrypted, undefined, 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}

export const prisma = new PrismaClient();

// Add helper properties to access typed schema
export * from '@prisma/client';

export enum Role {
  DOCTOR = 'DOCTOR',
  PATIENT = 'PATIENT',
  STAFF = 'STAFF',
  ADMIN = 'ADMIN'
}

export enum ConsultationType {
  PHYSICAL = 'PHYSICAL',
  TELECONSULTATION = 'TELECONSULTATION'
}

export enum AppointmentStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  CANCELLED = 'CANCELLED',
  COMPLETED = 'COMPLETED'
}

export enum ConsentType {
  TELECONSULTATION = 'TELECONSULTATION',
  WHATSAPP_REMINDERS = 'WHATSAPP_REMINDERS',
  DATA_TREATMENT = 'DATA_TREATMENT'
}

export enum AuditAction {
  READ_RECORD = 'READ_RECORD',
  WRITE_RECORD = 'WRITE_RECORD',
  DELETE_RECORD = 'DELETE_RECORD',
  EXPORT_DATA = 'EXPORT_DATA'
}

