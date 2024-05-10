// user-profile.dal.ts

import { employeeProfile, PrismaClient } from '@prisma/client';
import { CreateUserProfileDto, UpdateUserProfileDto } from './user-profile.dto';

const prisma = new PrismaClient();

export async function createUserProfile(
  data: CreateUserProfileDto,
  accountId: number
): Promise<employeeProfile> {
  return await prisma.employeeProfile.create({
    data: {
      ...data,
      accountId,
    },
  });
}

export async function getUserProfile(id: number): Promise<employeeProfile | null> {
  return await prisma.employeeProfile.findUnique({
    where: { id },
  });
}

export async function updateUserProfile(
  id: number,
  data: UpdateUserProfileDto
): Promise<employeeProfile | null> {
  return await prisma.employeeProfile.update({
    where: { id },
    data,
  });
}

export async function deleteUserProfile(id: number): Promise<void> {
  await prisma.employeeProfile.delete({
    where: { id },
  });
}

export async function getUserProfileByAccountId(accountId: number): Promise<employeeProfile | null> {
    return await prisma.employeeProfile.findUnique({
      where: { accountId },
    });
  }
