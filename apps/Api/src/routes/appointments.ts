import { Router, Request, Response } from 'express';
import { prisma } from '@dds/db';

const router = Router();

/**
 * GET /api/appointments
 * List all appointments, optionally filtered by doctorId or patientId.
 */
router.get('/', async (req: Request, res: Response) => {
  const { doctorId, patientId, status } = req.query;
  try {
    const where: any = {};
    if (doctorId) where.doctorId = doctorId;
    if (patientId) where.patientId = patientId;
    if (status) where.status = status;

    const appointments = await prisma.appointment.findMany({
      where,
      orderBy: { dateTime: 'asc' },
      include: {
        patient: { include: { user: { select: { fullName: true, phone: true } } } },
        doctor: { include: { user: { select: { fullName: true } } } },
      },
    });
    res.json(appointments);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/appointments
 * Create a new appointment.
 */
router.post('/', async (req: Request, res: Response) => {
  const { patientId, doctorId, dateTime, type, whatsappOptIn } = req.body;
  try {
    const appointment = await prisma.appointment.create({
      data: {
        patientId,
        doctorId,
        dateTime: new Date(dateTime),
        type: type || 'PHYSICAL',
        whatsappOptIn: whatsappOptIn || false,
        telecomRoomUrl:
          type === 'TELECONSULTATION'
            ? `https://telemed.dds.ma/rooms/${Math.random().toString(36).substring(7)}`
            : null,
      },
    });

    if (whatsappOptIn) {
      console.log(
        `[WhatsApp API] Queuing booking confirmation to patient ${patientId}`
      );
    }

    res.status(201).json(appointment);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * PATCH /api/appointments/:id/status
 * Update appointment status (CONFIRMED, CANCELLED, COMPLETED).
 */
router.patch('/:id/status', async (req: Request, res: Response) => {
  const { id } = req.params;
  const { status } = req.body;

  const validStatuses = ['PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED'];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ error: `Invalid status. Must be one of: ${validStatuses.join(', ')}` });
  }

  try {
    const updated = await prisma.appointment.update({
      where: { id },
      data: { status },
    });
    res.json(updated);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
