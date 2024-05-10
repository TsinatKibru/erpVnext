'use server'
import * as bcrypt from 'bcryptjs';
import { compareSync } from 'bcryptjs'; 
import { Prisma, PrismaClient } from "@prisma/client";
// import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { useRouter } from 'next/router';



import { FormState, SigninFormSchema, SignupFormSchema } from "@/lib/definitions"
import { createSession, deleteSession } from '@/lib/session';
import { redirect } from 'next/navigation';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { NextRequest } from 'next/server';
import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';

const prisma = new PrismaClient();


export async function signup(state: FormState, formData: FormData) {
    
  // Validate form fields
  const validatedFields = SignupFormSchema.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    password: formData.get('password'),
    repassword: formData.get('repassword'),
  })

  
  // If any form fields are invalid, return early
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    }
  }

  const { name, email, password } = validatedFields.data

  const hashedPassword = await bcrypt.hash(password, 10)


  try {
    // 3. Insert the user into the database using Prisma
    const createdUser = await prisma.accounts.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    await createSession(createdUser.id.toString())
    console.log('/profile');
   
    // 4. Create user session (replace with your session management logic)
    // This depends on your chosen session management approach (e.g., cookies, tokens)

    // 5. Construct a successful response
    return {
      success: true,
      redirectUrl: '/profile',
      message: "Account created successfully,Welcome!",
      username: createdUser.name,
      email: createdUser.email,
      // Optionally, include user data like createdUser.id
    };
  } catch (error) {
   
    console.error("Error creating user:", error);
    
   

    // Handle potential errors like duplicate email
    if (error instanceof PrismaClientKnownRequestError && error.code == "P2002") { // Assuming Prisma error code for unique constraint violation
      return {
        message: "A user with this email already exists.",
      };
    }

    // Handle other errors generically
    return {
      message: "An error occurred while creating your account.",
    };
  } 

 
  // Call the provider or db to create a user...
}

export async function signin(state: FormState, formData: FormData) {
  

  const validatedFields = SigninFormSchema.safeParse({
   
    email: formData.get('email'),
    password: formData.get('password'),
    
  })

 
 
  // If any form fields are invalid, return early
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    }
  }

  const {  email, password } = validatedFields.data

  // const email = formData.get('email') as string;
  // const password = formData.get('password')  as string;
 
 
  // const { email, password } = {formData};

  // Basic validation (can be extended)
  

  try {
    // Find user by email
    const user = await prisma.accounts.findUnique({
      where: { email },
    });

    if (!user) {
      return {
        message: "Invalid email or password",
      };
      // return {
      //   errors: [{ field: 'email', message: 'Invalid email or password' }],
      // };
    }

    // Compare password hashes
    const passwordMatches = await bcrypt.compare(password, user.password);


    if (!passwordMatches) {
      return {
        message: "Invalid email or password",
      };
      // return {
      //   errors: [{ field: 'password', message: 'Invalid email or password' }],
      // };
    }

    // Successful login: Create session
    await createSession(user.id.toString());

    return {
      success: true,
      redirectUrl: '/', // Replace with your desired redirect URL
      message: "Welcome back!",
      username: user.name,
      email: user.email,
    };
  } catch (error) {
    console.error("Error signing in:", error);
    return {
      message: "An error occurred while signing in. Please try again.",
    };
  }
}

//src/app/actions/auth

export async function logout() {
  await deleteSession()
    redirect('/auth/signin')
  }


  // protect  server actions using
  // const session = await verifySession()
  // const userRole = session?.user?.role
 
  // // Return early if user is not authorized to perform the action
  // if (userRole !== 'admin') {
  //   return null
  // }