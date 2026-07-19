import { Request, Response, NextFunction } from 'express';
import { prisma, AuditAction } from '@dds/db';

interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    role: string;
  };
}

/**
 * Express middleware to audit accesses to sensitive patient records.
 * Complies with Moroccan CNDP data security requirements.
 */
export function auditAccess(action: AuditAction, getPatientId: (req: Request) => string | undefined) {
  return async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    // Capture metadata before processing
    const actorId = req.user?.id;
    const patientId = getPatientId(req);
    const ipAddress = req.ip || req.socket.remoteAddress || 'unknown';
    const userAgent = req.headers['user-agent'] || 'unknown';
    const justification = req.headers['x-audit-justification'] as string || 'Standard medical consultation review';

    // Execute the request first
    next();

    // After response is processed, log in the background
    if (actorId && patientId) {
      try {
        await prisma.auditLog.create({
          data: {
            actorId,
            action,
            patientId,
            ipAddress,
            userAgent,
            justification
          }
        });
      } catch (error) {
        console.error('CNDP Audit Logging failed:', error);
        // Do not crash the application, but alert internally
      }
    }
  };
}
