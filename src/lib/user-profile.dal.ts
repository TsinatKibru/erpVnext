// user-profile.dal.ts

import { employeeprofile, PrismaClient } from '@prisma/client';
import { CreateUserProfileDto, UpdateUserProfileDto } from './user-profile.dto';

const prisma = new PrismaClient();

export async function createUserProfile(
  data: CreateUserProfileDto,
  accountId: number
): Promise<employeeprofile> {
  return await prisma.employeeprofile.create({
    data: {
      ...data,
      accountId,
    },
  });
}

export async function getUserProfile(id: number): Promise<employeeprofile | null> {
  return await prisma.employeeprofile.findUnique({
    where: { id },
  });
}

export async function updateUserProfile(
  id: number,
  data: UpdateUserProfileDto
): Promise<employeeprofile | null> {
  return await prisma.employeeprofile.update({
    where: { id },
    data,
  });
}

export async function deleteUserProfile(id: number): Promise<void> {
  await prisma.employeeprofile.delete({
    where: { id },
  });
}

export async function getUserProfileByAccountId(accountId: number): Promise<employeeprofile | null> {
    return await prisma.employeeprofile.findUnique({
      where: { accountId },
    });
  }
