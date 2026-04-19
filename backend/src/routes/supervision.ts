import { Request, Response, Router } from 'express';
import { UserRole } from '../models/user';
import { SupervisionStatus } from '../models/supervision';
import { authenticateToken } from '../middleware/auth';
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config();

const router = Router();
const prisma = new PrismaClient();

// Create supervision
router.post(
  '/',
  authenticateToken,
  async (req: Request, res: Response): Promise<any> => {
    const { professorId, dateTime, notes } = req.body;
    const user = req.user!;

    if (user.role !== UserRole.Student) {
      return res
        .status(403)
        .json({ message: 'Only student can schedule supervisions' });
    }

    // Cek professor di database
    const professor = await prisma.user.findFirst({
      where: { id: professorId, role: UserRole.Professor },
    });
    if (!professor) {
      return res.status(404).json({ message: 'Professor not found' });
    }

    const supervision = await prisma.supervision.create({
      data: {
        studentId: user.id,
        professorId,
        dateTime: new Date(dateTime),
        status: SupervisionStatus.Pending,
        notes,
      },
    });

    return res.json(supervision);
  }
);

// Get supervision
router.get(
  '/',
  authenticateToken,
  async (req: Request, res: Response): Promise<any> => {
    const user = req.user!;

    const supervisions = await prisma.supervision.findMany({
      where:
        user.role === UserRole.Student
          ? { studentId: user.id }
          : { professorId: user.id },
      include: {
        student: true,
      },
    });

    // Sertakan email dan nama student
    const supervisionWithStudentInfo = supervisions.map((supervision) => ({
      ...supervision,
      studentEmail: supervision.student?.email,
      studentName: supervision.student?.name,
    }));

    return res.json(supervisionWithStudentInfo);
  }
);

// Update supervisions status
router.patch(
  '/:id',
  authenticateToken,
  async (req: Request, res: Response): Promise<any> => {
    const { id } = req.params;
    const { status } = req.body;
    const user = req.user!;

    const supervision = await prisma.supervision.findUnique({
      where: { id },
    });
    if (!supervision) {
      return res.status(404).json({ message: 'supervision not found' });
    }

    if (
      user.role !== UserRole.Professor ||
      supervision.professorId !== user.id
    ) {
      return res.status(403).json({
        message: 'Only the assigned professor can update supervision status',
      });
    }

    if (!Object.values(SupervisionStatus).includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const updated = await prisma.supervision.update({
      where: { id },
      data: { status },
    });

    return res.json(updated);
  }
);

export default router;
