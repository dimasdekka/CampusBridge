import dotenv from 'dotenv';
dotenv.config();

import { PrismaClient } from '@prisma/client';
import { hashSync } from 'bcrypt';
import { StreamChat } from 'stream-chat';

const prisma = new PrismaClient();
const SALT = '$2b$10$.MftzcPPsR5TUTYRYWGyQu';

const streamApiKey = process.env.STREAM_API_KEY!;
const streamApiSecret = process.env.STREAM_API_SECRET!;
const client = StreamChat.getInstance(streamApiKey, streamApiSecret);

async function seedUsers() {
  const users = [
    {
      id: '221091750080',
      email: 'dhimasdekananta@unpam.com',
      hashed_password: hashSync('password123', SALT),
      role: 'student',
      name: 'Dhimas Dekananta',
      department: 'System Informatics',
    },
    {
      id: '221091750088',
      email: 'dinakharisma@unpam.com',
      hashed_password: hashSync('password123', SALT),
      role: 'student',
      name: 'Dina Kharisma',
      department: 'System Informatics',
    },
    {
      id: '221091750092',
      email: 'wahyukhoirul@unpam.com',
      hashed_password: hashSync('password123', SALT),
      role: 'student',
      name: 'Wahyu Khoirul Rizal',
      department: 'System Informatics',
    },
    {
      id: '0000001',
      email: 'rimasyaayujaeningsih@unpam.com',
      hashed_password: hashSync('password123', SALT),
      role: 'professor',
      name: 'RIMASYA AYU JAENINGSIH',
      department: 'System Informatics',
    },
  ];

  await prisma.user.createMany({ data: users });

  // Upsert ke GetStream.io
  for (const user of users) {
    await client.upsertUser({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    });
  }
  console.log('Seed users selesai!');
}

async function seedSupervisions() {
  const supervisions = [
    {
      id: '9j5ljw1dh',
      studentId: '221091750080',
      professorId: '0000001',
      dateTime: new Date('2025-03-11T13:15:29.364Z'),
      status: 'Pending',
      notes: 'Bimbingan 1',
    },
    {
      id: '9j51ga1dh',
      studentId: '221091750080',
      professorId: '0000001',
      dateTime: new Date('2025-03-18T13:15:29.364Z'),
      status: 'Pending',
      notes: 'Bimbingan 2',
    },
  ];

  await prisma.supervision.createMany({ data: supervisions });
  console.log('Seed supervision selesai!');
}

async function main() {
  await prisma.supervision.deleteMany();
  await prisma.user.deleteMany();
  await seedUsers();
  await seedSupervisions();
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
