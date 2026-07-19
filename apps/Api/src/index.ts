import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import appointmentsRouter from './routes/appointments';
import patientsRouter from './routes/patients';
import whatsappRouter from './routes/whatsapp';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001'],
  credentials: true,
}));
app.use(express.json());

// Mock auth middleware — in production, replace with JWT/session validation
app.use((req: any, _res: Response, next) => {
  req.user = {
    id: req.headers['x-user-id'] as string || 'doctor-uuid-demo',
    role: req.headers['x-user-role'] as string || 'DOCTOR',
  };
  next();
});

// ─── Health Check ────────────────────────────────────
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'OK',
    service: 'DDS Backend API',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    features: {
      encryption: 'AES-256-GCM (Application-Level)',
      auditLog: 'CNDP compliant',
      whatsapp: 'Business API webhook ready',
      teleconsultation: 'WebRTC room generation',
    },
  });
});

// ─── API Routes ──────────────────────────────────────
app.use('/api/appointments', appointmentsRouter);
app.use('/api/patients', patientsRouter);
app.use('/api/whatsapp', whatsappRouter);

// ─── 404 ─────────────────────────────────────────────
app.use((_req: Request, res: Response) => {
  res.status(404).json({ error: 'Route not found' });
});

// ─── Start ───────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n🏥  DDS Backend API running on http://localhost:${PORT}`);
  console.log(`    Health: http://localhost:${PORT}/api/health`);
  console.log(`    CNDP Audit Logging: ACTIVE`);
  console.log(`    Encryption: AES-256-GCM\n`);
});

export default app;
