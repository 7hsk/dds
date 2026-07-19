import { Request, Response, NextFunction } from 'express';
import { prisma, ConsentType } from '@dds/db';

interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    role: string;
  };
}

/**
 * Middleware to verify that a patient has consented to a specific digital health operation.
 * Complies with Moroccan Law 131-13 (Telemedicine consent) and Law 09-08 (CNDP).
 */
export function requireConsent(consentType: ConsentType, getPatientId: (req: Request) => string | undefined) {
  return async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const patientId = getPatientId(req);

    if (!patientId) {
      return res.status(400).json({ error: 'Patient ID is required to verify consent status' });
    }

    try {
      const activeConsent = await prisma.consentLog.findFirst({
        where: {
          patientId,
          consentType,
          isGranted: true
        },
        orderBy: {
          timestamp: 'desc'
        }
      });

      if (!activeConsent) {
        return res.status(403).json({
          error: `Explicit consent for ${consentType} is not registered for this patient. This is required under Moroccan Law 131-13.`
        });
      }

      next();
    } catch (error) {
      console.error('Consent verification failed:', error);
      return res.status(500).json({ error: 'Internal system error verifying patient consent' });
    }
  };
}
