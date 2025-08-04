import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const register = async (req: Request, res: Response) => {
  try {
    const { email, password, name } = req.body;

    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name
      }
    });

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!);

    res.status(201).json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Failed to register user' });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!);

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Failed to login' });
  }
};

export const getProfile = async (req: Request & { userId?: string }, res: Response) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.userId }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      id: user.id,
      email: user.email,
      name: user.name
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Failed to get profile' });
  }
};

export const updateExcitementWeights = async (req: Request & { userId?: string }, res: Response) => {
  try {
    const { weights } = req.body;
    
    // Validate weights
    const requiredCategories = ['salary', 'workLife', 'growth', 'culture', 'role', 'location', 'stability'];
    const weightValues = Object.values(weights);
    
    if (Object.keys(weights).length !== 7 || 
        !requiredCategories.every(cat => cat in weights) ||
        !weightValues.every(w => typeof w === 'number' && w >= 0 && w <= 1)) {
      return res.status(400).json({ error: 'Invalid weights format' });
    }
    
    // Ensure weights sum to 1
    const sum = weightValues.reduce((a: number, b: any) => a + Number(b), 0);
    if (Math.abs(sum - 1) > 0.01) {
      return res.status(400).json({ error: 'Weights must sum to 1' });
    }

    const user = await prisma.user.update({
      where: { id: req.userId },
      data: {
        excitementWeights: JSON.stringify(weights)
      }
    });

    res.json({ 
      message: 'Excitement weights updated successfully',
      weights: JSON.parse(user.excitementWeights || '{}')
    });
  } catch (error) {
    console.error('Update excitement weights error:', error);
    res.status(500).json({ error: 'Failed to update excitement weights' });
  }
};

export const getExcitementWeights = async (req: Request & { userId?: string }, res: Response) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.userId },
      select: { excitementWeights: true }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Return default weights if none set
    const defaultWeights = {
      salary: 0.35,
      workLife: 0.25,
      growth: 0.15,
      culture: 0.10,
      role: 0.08,
      location: 0.05,
      stability: 0.02
    };

    const weights = user.excitementWeights ? JSON.parse(user.excitementWeights) : defaultWeights;
    
    res.json({ weights });
  } catch (error) {
    console.error('Get excitement weights error:', error);
    res.status(500).json({ error: 'Failed to get excitement weights' });
  }
};