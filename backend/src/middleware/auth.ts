import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const { JWT_SECRET } = process.env;
const prisma = new PrismaClient();

declare global {
  namespace Express {
    interface Request {
      user?: any; // user dari Prisma
    }
  }
}

export const authenticateToken = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: 'Authorization required' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const { userId } = jwt.verify(token, JWT_SECRET!) as { userId: string };

    // Cari user di database pakai Prisma
    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};
