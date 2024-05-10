export interface CreateUserProfileDto {
    firstname: string;
    lastname: string;
    dateOfBirth?: Date; // Optional date of birth
    gender?: string;
    email?: string; // Optional email (separate from account email)
    phone?: string;
    homeAddress?: string;
    dateOfHire?: Date; // Optional date of hire
    status?: string;
    profilePicture?: string;
    role?: string;
  }
  
  export interface UpdateUserProfileDto {
    id: number; // ID of the profile to update
    firstname?: string;
    lastname?: string;
    dateOfBirth?: Date;
    gender?: string;
    email?: string;
    phone?: string;
    homeAddress?: string;
    dateOfHire?: Date;
    status?: string;
    profilePicture?: string;
    role?: string;
  }
  
  export interface GetUserProfileDto {
    id: number; // ID of the profile to retrieve
  }
  