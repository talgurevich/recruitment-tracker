import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middleware/auth';

const prisma = new PrismaClient();

export const createActionItem = async (req: AuthRequest, res: Response) => {
  try {
    const { processId } = req.body;
    
    const process = await prisma.recruitmentProcess.findFirst({
      where: {
        id: processId,
        userId: req.userId
      }
    });

    if (!process) {
      return res.status(404).json({ error: 'Process not found' });
    }

    const actionItem = await prisma.actionItem.create({
      data: req.body
    });

    res.status(201).json(actionItem);
  } catch (error) {
    console.error('Create action item error:', error);
    res.status(500).json({ error: 'Failed to create action item' });
  }
};

export const updateActionItem = async (req: AuthRequest, res: Response) => {
  try {
    const actionItem = await prisma.actionItem.findUnique({
      where: { id: req.params.id },
      include: {
        recruitmentProcess: true
      }
    });

    if (!actionItem || actionItem.recruitmentProcess.userId !== req.userId) {
      return res.status(404).json({ error: 'Action item not found' });
    }

    const updated = await prisma.actionItem.update({
      where: { id: req.params.id },
      data: req.body
    });

    res.json(updated);
  } catch (error) {
    console.error('Update action item error:', error);
    res.status(500).json({ error: 'Failed to update action item' });
  }
};

export const deleteActionItem = async (req: AuthRequest, res: Response) => {
  try {
    const actionItem = await prisma.actionItem.findUnique({
      where: { id: req.params.id },
      include: {
        recruitmentProcess: true
      }
    });

    if (!actionItem || actionItem.recruitmentProcess.userId !== req.userId) {
      return res.status(404).json({ error: 'Action item not found' });
    }

    await prisma.actionItem.delete({
      where: { id: req.params.id }
    });

    res.status(204).send();
  } catch (error) {
    console.error('Delete action item error:', error);
    res.status(500).json({ error: 'Failed to delete action item' });
  }
};