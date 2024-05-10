'use server'
import 'server-only'

import { cookies } from "next/headers"
import { decrypt } from './session'
import { redirect } from 'next/navigation'
import { cache } from 'react'
import { Prisma, PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const verifySession = cache(async () => {
    const cookie = cookies().get('session')?.value
    const session = await decrypt(cookie)
   
    if (!session?.userId) {
      redirect('/login')
    }
   
    return { isAuth: true, userId: session.userId }
  })
  



  export const getUser = cache(async () => {
    
  
    const session = await verifySession();
    if (!session?.isAuth) return null; // Check if session is authenticated
   
    
  
    try {
        const userId = parseInt(session.userId as string);
      const user = await prisma.accounts.findUnique({
        where: { id: userId as number}, // Use session.userId as the user ID
      });
  
      return user;
    } catch (error) {
      console.log('Failed to fetch user',error);
      return null;
    } 
  });

 
  

  