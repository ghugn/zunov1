import type { Response } from 'express';
import type { AuthRequest } from '../middleware/auth.js';
import * as profileService from '../services/profile.service.js';
import { serializeBigInt } from '../lib/serialize.js';

export async function getProfile(req: AuthRequest, res: Response) {
  try {
    const profile = await profileService.getProfile(req.userId!);
    if (!profile) {
      res.status(404).json({ error: 'Profile not found' });
      return;
    }
    res.json(serializeBigInt(profile));
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
}

export async function createProfile(req: AuthRequest, res: Response) {
  try {
    const { residenceType, monthlyIncome, dormPaidSemester, hasFoodFromFamily } = req.body;
    if (!residenceType || monthlyIncome === undefined || monthlyIncome === null) {
      res.status(400).json({ error: 'residenceType, monthlyIncome required' });
      return;
    }
    const profile = await profileService.createProfile({
      userId: req.userId!,
      residenceType,
      monthlyIncome,
      dormPaidSemester,
      hasFoodFromFamily,
    });
    res.status(201).json(serializeBigInt(profile));
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
}

export async function updateProfile(req: AuthRequest, res: Response) {
  try {
    const profile = await profileService.updateProfile(req.userId!, req.body);
    res.json(serializeBigInt(profile));
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
}

export async function completeOnboarding(req: AuthRequest, res: Response) {
  try {
    const profile = await profileService.completeOnboarding(req.userId!);
    res.json(serializeBigInt(profile));
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
}
