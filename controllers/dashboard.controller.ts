import { Request, Response, NextFunction } from 'express';
import * as dashboardService from '../services/dashboard.service';

export const getDashboardStats = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await dashboardService.getDashboardData();
    res.json(data);
  } catch (error) {
    next(error);
  }
};