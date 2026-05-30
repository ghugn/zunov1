import prisma from '../lib/prisma.js';

interface CreateProfileInput {
  userId: string;
  residenceType: string;
  monthlyIncome: number;
  dormPaidSemester?: boolean;
  hasFoodFromFamily?: boolean;
}

interface UpdateProfileInput {
  residenceType?: string;
  monthlyIncome?: number;
  dormPaidSemester?: boolean;
  hasFoodFromFamily?: boolean;
  onboardingCompleted?: boolean;
}

export async function createProfile(input: CreateProfileInput) {
  return prisma.userProfile.create({
    data: {
      userId: input.userId,
      residenceType: input.residenceType,
      monthlyIncome: BigInt(input.monthlyIncome),
      dormPaidSemester: input.dormPaidSemester ?? false,
      hasFoodFromFamily: input.hasFoodFromFamily ?? false,
    },
  });
}

export async function getProfile(userId: string) {
  return prisma.userProfile.findUnique({
    where: { userId },
  });
}

export async function updateProfile(userId: string, input: UpdateProfileInput) {
  const data: Record<string, unknown> = {};
  if (input.residenceType !== undefined) data.residenceType = input.residenceType;
  if (input.monthlyIncome !== undefined) data.monthlyIncome = BigInt(input.monthlyIncome);
  if (input.dormPaidSemester !== undefined) data.dormPaidSemester = input.dormPaidSemester;
  if (input.hasFoodFromFamily !== undefined) data.hasFoodFromFamily = input.hasFoodFromFamily;
  if (input.onboardingCompleted !== undefined) data.onboardingCompleted = input.onboardingCompleted;

  return prisma.userProfile.update({
    where: { userId },
    data,
  });
}

export async function completeOnboarding(userId: string) {
  return prisma.userProfile.update({
    where: { userId },
    data: { onboardingCompleted: true },
  });
}
