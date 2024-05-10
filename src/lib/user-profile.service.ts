// user-profile.service.ts

interface User {
    id: number;
    isAdmin: boolean; // Include this for clarity
  }

import {
    CreateUserProfileDto,
    GetUserProfileDto,
    UpdateUserProfileDto,
  } from './user-profile.dto';
  import {
    createUserProfile,
    deleteUserProfile,
    getUserProfile,
    updateUserProfile,
  } from './user-profile.dal';
import { employeeProfile } from '@prisma/client';
  
  export async function createUserProfileService(
    data: CreateUserProfileDto,
    accountId: number,
    currentUser: { isAdmin: boolean }
  ): Promise<employeeProfile> {
    if (!currentUser.isAdmin) {
      throw new Error('Unauthorized to create profiles');
    }
    return await createUserProfile(data, accountId);
  }
  
  export async function getUserProfileService(
  id: number,
  currentUser: User // Type assertion (assuming User is defined as above)
): Promise<employeeProfile | null> {
  if (currentUser.id !== id ) { // Use type assertion here
    throw new Error('Unauthorized to view this profile');
  }
  return await getUserProfile(id);
}
  
  export async function updateUserProfileService(
    id: number,
    data: UpdateUserProfileDto,
    currentUser: { id: number; isAdmin: boolean }
  ): Promise<employeeProfile | null> {
    if ((!currentUser.isAdmin )) {
      throw new Error('Unauthorized to update this profile');
    }
    return await updateUserProfile(id, data);
  }
  
  export async function deleteUserProfileService(
    id: number,
    currentUser: { isAdmin: boolean }
  ): Promise<void> {
    if (!currentUser.isAdmin) {
      throw new Error('Unauthorized to delete profiles');
    }
    await deleteUserProfile(id);
  }
  