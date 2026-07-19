import { Router, Request, Response } from 'express';

const router = Router();

/**
 * POST /api/whatsapp/webhook
 * Listens for delivery reports and patient replies from WhatsApp Business API.
 * Supports Darija/Arabic/French trigger words for appointment confirmations.
 */
router.post('/webhook', async (req: Request, res: Response) => {
  const { from, body, messageId, timestamp } = req.body;

  console.log(`[WhatsApp Webhook] Message from ${from}: "${body}"`);

  // Confirmation keywords in multiple languages/dialects
  const confirmKeywords = ['n3am', 'oui', 'نعم', 'ok', 'ewa', 'yes', 'wah', 'wakha'];
  const cancelKeywords = ['la', 'non', 'لا', 'no', 'annuler', 'cancel'];

  const normalizedBody = (body || '').toLowerCase().trim();

  if (confirmKeywords.some((kw) => normalizedBody.includes(kw))) {
    console.log(`[WhatsApp] Patient ${from} CONFIRMED appointment`);
    // In production: update appointment status in DB
    res.json({ action: 'CONFIRMED', from });
    return;
  }

  if (cancelKeywords.some((kw) => normalizedBody.includes(kw))) {
    console.log(`[WhatsApp] Patient ${from} CANCELLED appointment`);
    res.json({ action: 'CANCELLED', from });
    return;
  }

  // Unknown message — acknowledge receipt
  console.log(`[WhatsApp] Unrecognized reply from ${from}, forwarding to doctor inbox.`);
  res.json({ action: 'FORWARDED_TO_INBOX', from });
});

/**
 * GET /api/whatsapp/webhook
 * WhatsApp verification endpoint (used during webhook registration).
 */
router.get('/webhook', (req: Request, res: Response) => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  const VERIFY_TOKEN = process.env.WHATSAPP_VERIFY_TOKEN || 'dds-verify-token-2026';

  if (mode === 'subscribe' && token === VERIFY_TOKEN) {
    console.log('[WhatsApp] Webhook verified successfully');
    res.status(200).send(challenge);
  } else {
    res.sendStatus(403);
  }
});

export default router;
