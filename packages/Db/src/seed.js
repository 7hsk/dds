const { PrismaClient } = require('@prisma/client');
const crypto = require('crypto');

const prisma = new PrismaClient();

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 12;
const ENCRYPTION_KEY = process.env.DATABASE_ENCRYPTION_KEY || 'default-secret-key-32-chars-long!';

function encrypt(text) {
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
  return `${iv.toString('hex')}:${encrypted}:${authTag}`;
}

async function main() {
  console.log('Seeding DDS Database...');

  // 1. Create Doctor
  const docUser = await prisma.user.upsert({
    where: { email: 'ahmed.benhaddou@dds.ma' },
    update: {},
    create: {
      email: 'ahmed.benhaddou@dds.ma',
      passwordHash: 'hashed_password_123',
      fullName: 'Dr. Ahmed Benhaddou',
      phone: '+212 661-123456',
      role: 'DOCTOR',
      doctorProfile: {
        create: {
          specialty: 'Médecine Générale',
          licenseNumber: 'CNOM-2026-98765',
          cabinetAddress: '15 Boulevard Zerktouni, 4ème étage',
          city: 'Casablanca',
        }
      }
    },
    include: { doctorProfile: true }
  });
  console.log('Doctor created:', docUser.fullName);

  // 2. Create Patients
  const patientsData = [
    {
      email: 'mohamed.alami@email.ma',
      name: 'Mohamed El Alami',
      phone: '+212 661-123456',
      cin: 'AB123456',
      birthDate: new Date('1985-03-15'),
      gender: 'M',
      address: 'Anfa, Casablanca',
      symptoms: 'Tension artérielle élevée (160/95) depuis 3 jours, céphalées légères.',
      diagnosis: 'Hypertension Artérielle Essentielle (Grade 1)',
      prescription: 'Ramipril 5mg 1x/jour le matin'
    },
    {
      email: 'fatima.bennani@email.ma',
      name: 'Fatima Zahra Bennani',
      phone: '+212 662-987654',
      cin: 'CD789012',
      birthDate: new Date('1990-08-22'),
      gender: 'F',
      address: 'Agdal, Rabat',
      symptoms: 'Contrôle de routine pour diabète de type 2.',
      diagnosis: 'Diabète de Type 2',
      prescription: 'Metformine 500mg 2x/jour aux repas'
    }
  ];

  for (const patient of patientsData) {
    const patUser = await prisma.user.upsert({
      where: { email: patient.email },
      update: {},
      create: {
        email: patient.email,
        passwordHash: 'hashed_password_patient',
        fullName: patient.name,
        phone: patient.phone,
        role: 'PATIENT',
        patientProfile: {
          create: {
            cin: patient.cin,
            birthDate: patient.birthDate,
            gender: patient.gender,
            address: patient.address,
            consentLogs: {
              create: [
                { consentType: 'DATA_TREATMENT', isGranted: true, ipAddress: '127.0.0.1' },
                { consentType: 'TELECONSULTATION', isGranted: true, ipAddress: '127.0.0.1' },
                { consentType: 'WHATSAPP_REMINDERS', isGranted: true, ipAddress: '127.0.0.1' }
              ]
            },
            medicalRecords: {
              create: {
                doctorId: docUser.doctorProfile.id,
                symptomsEncrypted: encrypt(patient.symptoms),
                diagnosesEncrypted: encrypt(patient.diagnosis),
                prescriptionsEncrypted: encrypt(patient.prescription)
              }
            }
          }
        }
      },
      include: { patientProfile: true }
    });
    console.log('Patient created:', patUser.fullName);

    // Create a confirmed appointment for today
    await prisma.appointment.create({
      data: {
        patientId: patUser.patientProfile.id,
        doctorId: docUser.doctorProfile.id,
        dateTime: new Date(new Date().setHours(10, 0, 0, 0)),
        type: 'TELECONSULTATION',
        status: 'CONFIRMED',
        whatsappOptIn: true,
        telecomRoomUrl: `https://telemed.dds.ma/rooms/${Math.random().toString(36).substring(7)}`
      }
    });
  }

  console.log('DDS Database Seeded Successfully! ✓');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
