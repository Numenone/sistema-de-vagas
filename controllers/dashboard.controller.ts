import { Request, Response, NextFunction } from 'express';
import * as dashboardService from '../services/dashboard.service.js';

export const getDashboardStats = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const stats = await dashboardService.getOverallStats();
    res.json(stats);
  } catch (error) {
    next(error);
  }
};