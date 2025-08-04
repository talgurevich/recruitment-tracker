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

export const updateExcitementRating = async (req: AuthRequest, res: Response) => {
  try {
    const { scores, notes } = req.body;
    
    // Validate scores
    const requiredCategories = ['salary', 'workLife', 'growth', 'culture', 'role', 'location', 'stability'];
    
    if (!scores || 
        Object.keys(scores).length !== 7 || 
        !requiredCategories.every(cat => cat in scores) ||
        !Object.values(scores).every(s => typeof s === 'number' && s >= 1 && s <= 5)) {
      return res.status(400).json({ error: 'Invalid excitement scores format' });
    }

    // Get user's weights
    const user = await prisma.user.findUnique({
      where: { id: req.userId },
      select: { excitementWeights: true }
    });

    const defaultWeights = {
      salary: 0.35,
      workLife: 0.25,
      growth: 0.15,
      culture: 0.10,
      role: 0.08,
      location: 0.05,
      stability: 0.02
    };

    const weights = user?.excitementWeights ? JSON.parse(user.excitementWeights) : defaultWeights;

    // Calculate weighted score
    let overallScore = 0;
    for (const [category, score] of Object.entries(scores)) {
      overallScore += (score as number) * weights[category];
    }

    const excitementRating = {
      scores,
      notes: notes || {},
      overallScore: Math.round(overallScore * 100) / 100, // Round to 2 decimal places
      ratedAt: new Date().toISOString()
    };

    const process = await prisma.recruitmentProcess.update({
      where: { id: req.params.id },
      data: {
        excitementRating: JSON.stringify(excitementRating)
      }
    });

    res.json({ 
      message: 'Excitement rating updated successfully',
      excitementRating 
    });
  } catch (error) {
    console.error('Update excitement rating error:', error);
    res.status(500).json({ error: 'Failed to update excitement rating' });
  }
};