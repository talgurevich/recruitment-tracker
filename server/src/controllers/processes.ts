import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middleware/auth';

const prisma = new PrismaClient();

export const createProcess = async (req: AuthRequest, res: Response) => {
  try {
    const process = await prisma.recruitmentProcess.create({
      data: {
        ...req.body,
        userId: req.userId!
      },
      include: {
        actionItems: true
      }
    });
    res.status(201).json(process);
  } catch (error) {
    console.error('Create process error:', error);
    res.status(500).json({ error: 'Failed to create process' });
  }
};

export const getProcesses = async (req: AuthRequest, res: Response) => {
  try {
    const processes = await prisma.recruitmentProcess.findMany({
      where: { userId: req.userId },
      include: {
        actionItems: {
          orderBy: { dueDate: 'asc' }
        }
      },
      orderBy: { updatedAt: 'desc' }
    });
    res.json(processes);
  } catch (error) {
    console.error('Get processes error:', error);
    res.status(500).json({ error: 'Failed to get processes' });
  }
};

export const getProcess = async (req: AuthRequest, res: Response) => {
  try {
    const process = await prisma.recruitmentProcess.findFirst({
      where: {
        id: req.params.id,
        userId: req.userId
      },
      include: {
        actionItems: {
          orderBy: { dueDate: 'asc' }
        }
      }
    });

    if (!process) {
      return res.status(404).json({ error: 'Process not found' });
    }

    res.json(process);
  } catch (error) {
    console.error('Get process error:', error);
    res.status(500).json({ error: 'Failed to get process' });
  }
};

export const updateProcess = async (req: AuthRequest, res: Response) => {
  try {
    const existingProcess = await prisma.recruitmentProcess.findFirst({
      where: {
        id: req.params.id,
        userId: req.userId
      }
    });

    if (!existingProcess) {
      return res.status(404).json({ error: 'Process not found' });
    }

    const process = await prisma.recruitmentProcess.update({
      where: { id: req.params.id },
      data: req.body,
      include: {
        actionItems: true
      }
    });

    res.json(process);
  } catch (error) {
    console.error('Update process error:', error);
    res.status(500).json({ error: 'Failed to update process' });
  }
};

export const deleteProcess = async (req: AuthRequest, res: Response) => {
  try {
    const existingProcess = await prisma.recruitmentProcess.findFirst({
      where: {
        id: req.params.id,
        userId: req.userId
      }
    });

    if (!existingProcess) {
      return res.status(404).json({ error: 'Process not found' });
    }

    await prisma.recruitmentProcess.delete({
      where: { id: req.params.id }
    });

    res.status(204).send();
  } catch (error) {
    console.error('Delete process error:', error);
    res.status(500).json({ error: 'Failed to delete process' });
  }
};