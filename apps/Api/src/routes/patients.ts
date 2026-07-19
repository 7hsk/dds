import { Router, Request, Response } from 'express';
import { prisma, encrypt, decrypt, AuditAction } from '@dds/db';
import { auditAccess } from '../middleware/audit';

const router = Router();

/**
 * GET /api/patients
 * List all patients (doctor view).
 */
router.get('/', async (req: Request, res: Response) => {
  try {
    const patients = await prisma.patientProfile.findMany({
      include: {
        user: { select: { fullName: true, phone: true, email: true } },
      },
      orderBy: { user: { fullName: 'asc' } },
    });
    res.json(patients);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/patients/:id
 * Get single patient profile.
 */
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const patient = await prisma.patientProfile.findUnique({
      where: { id: req.params.id },
      include: {
        user: { select: { fullName: true, phone: true, email: true } },
        appointments: { orderBy: { dateTime: 'desc' }, take: 10 },
        consentLogs: { orderBy: { timestamp: 'desc' } },
      },
    });
    if (!patient) return res.status(404).json({ error: 'Patient not found' });
    res.json(patient);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/patients/:id/records
 * Fetch decrypted medical records for a patient. Audit-logged.
 */
router.get(
  '/:id/records',
  auditAccess(AuditAction.READ_RECORD, (req) => req.params.id),
  async (req: Request, res: Response) => {
    try {
      const records = await prisma.medicalRecord.findMany({
        where: { patientId: req.params.id },
        orderBy: { createdAt: 'desc' },
      });

      const decrypted = records.map((r) => ({
        id: r.id,
        patientId: r.patientId,
        doctorId: r.doctorId,
        symptoms: decrypt(r.symptomsEncrypted),
        diagnoses: decrypt(r.diagnosesEncrypted),
        prescriptions: decrypt(r.prescriptionsEncrypted),
        additionalNotes: r.additionalNotesEncrypted
          ? decrypt(r.additionalNotesEncrypted)
          : null,
        createdAt: r.createdAt,
        updatedAt: r.updatedAt,
      }));

      res.json(decrypted);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
);

/**
 * POST /api/patients/:id/records
 * Create a new medical record (encrypted at rest). Audit-logged.
 */
router.post(
  '/:id/records',
  auditAccess(AuditAction.WRITE_RECORD, (req) => req.params.id),
  async (req: Request, res: Response) => {
    const { doctorId, symptoms, diagnoses, prescriptions, additionalNotes } = req.body;
    try {
      const record = await prisma.medicalRecord.create({
        data: {
          patientId: req.params.id,
          doctorId,
          symptomsEncrypted: encrypt(symptoms),
          diagnosesEncrypted: encrypt(diagnoses),
          prescriptionsEncrypted: encrypt(prescriptions),
          additionalNotesEncrypted: additionalNotes
            ? encrypt(additionalNotes)
            : null,
        },
      });
      res.status(201).json({
        id: record.id,
        message: 'Record encrypted (AES-256-GCM) and stored successfully.',
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
);

/**
 * POST /api/patients/:id/consent
 * Register patient consent (CNDP compliance).
 */
router.post('/:id/consent', async (req: Request, res: Response) => {
  const { consentType, isGranted, signatureImageUri } = req.body;
  const ipAddress = req.ip || req.socket.remoteAddress || 'unknown';
  try {
    const consent = await prisma.consentLog.create({
      data: {
        patientId: req.params.id,
        consentType,
        isGranted,
        ipAddress,
        signatureImageUri,
      },
    });
    res.status(201).json(consent);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
