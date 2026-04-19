import { Request, Response, Router } from 'express';
import { StreamChat } from 'stream-chat';
import { hashSync, compareSync } from 'bcrypt';
import { UserRole } from '../models/user';
import dotenv from 'dotenv';
import { sign } from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

// Load environment variables
dotenv.config();

const router = Router();
const prisma = new PrismaClient();

const SALT = process.env.SALT as string;
const streamApiKey = process.env.STREAM_API_KEY;
const streamApiSecret = process.env.STREAM_API_SECRET;

if (!streamApiKey || !streamApiSecret) {
  throw new Error(
    'STREAM_API_KEY and STREAM_API_SECRET must be defined in environment variables'
  );
}

if (!process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET must be defined in environment variables');
}

const client = StreamChat.getInstance(streamApiKey, streamApiSecret);

// Register endpoint
router.post('/register', async (req: Request, res: Response): Promise<any> => {
  const { nim, email, password } = req.body;

  if (!nim || !email || !password) {
    return res.status(400).json({
      message: 'NIM, email and password are required.',
    });
  }

  if (password.length < 6) {
    return res.status(400).json({
      message: 'Password must be at least 6 characters.',
    });
  }

  const existingUser = await prisma.user.findFirst({
    where: {
      OR: [{ email: email }, { id: nim }],
    },
  });

  if (existingUser) {
    return res.status(400).json({
      message: 'User already exists.',
    });
  }

  try {
    const hashed_password = hashSync(password, SALT);
    const user = await prisma.user.create({
      data: {
        id: nim,
        email,
        hashed_password,
        role: UserRole.Student,
      },
    });

    await client.upsertUser({
      id: nim,
      email,
      name: email,
      role: user.role,
    });

    const token = client.createToken(nim);
    const jwt = sign({ userId: user.id }, process.env.JWT_SECRET!);

    return res.json({
      token,
      jwt,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    });
  } catch (e) {
    console.error('Error during registration:', e);
    return res.status(500).json({
      message: 'An error occurred during registration.',
    });
  }
});

// Login endpoint
router.post('/login', async (req: Request, res: Response): Promise<any> => {
  const { email, password } = req.body;
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user || !compareSync(password, user.hashed_password)) {
    return res.status(400).json({
      message: 'Invalid credentials.',
    });
  }

  const token = client.createToken(user.id);
  const jwt = sign({ userId: user.id }, process.env.JWT_SECRET!);

  return res.json({
    token,
    jwt,
    user: {
      id: user.id,
      email: user.email,
      role: user.role,
    },
  });
});

// Endpoint to create a professor user
router.post(
  '/create-professor',
  async (req: Request, res: Response): Promise<any> => {
    const { nip, email, password } = req.body;

    if (!nip || !email || !password) {
      return res.status(400).json({
        message: 'NIP, email and password are required.',
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        message: 'Password must be at least 6 characters.',
      });
    }

    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email: email }, { id: nip }],
      },
    });

    if (existingUser) {
      return res.status(400).json({
        message: 'User already exists.',
      });
    }

    try {
      const hashed_password = hashSync(password, SALT);
      const user = await prisma.user.create({
        data: {
          id: nip,
          email,
          hashed_password,
          role: UserRole.Professor,
        },
      });

      await client.upsertUser({
        id: nip,
        email,
        name: email,
        role: UserRole.Professor,
      });

      return res.json({
        message: 'Professor user created successfully.',
        user,
      });
    } catch (e) {
      console.error('Error during professor creation:', e);
      return res.status(500).json({
        message: 'An error occurred while creating the professor user.',
      });
    }
  }
);

export default router;
