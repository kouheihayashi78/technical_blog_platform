'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

/**
 * Register a new user and create their profile
 * @param email - User's email address
 * @param password - User's password
 * @param displayName - Optional display name for the user
 * @returns Object containing either user data or error message
 */
export async function signUp(email: string, password: string, displayName?: string) {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        display_name: displayName,
      },
    },
  })

  if (error) {
    return { error: error.message }
  }

  // Ensure profile exists for this user
  if (data.user) {
    await ensureProfileExists(data.user.id, data.user.email || '')
  }

  revalidatePath('/', 'layout')
  return { data }
}

/**
 * Sign in an existing user and ensure their profile exists
 * @param email - User's email address
 * @param password - User's password
 * @returns Object containing either user data or error message (redirects to /posts on success)
 */
export async function signIn(email: string, password: string) {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return { error: error.message }
  }

  // Ensure profile exists for this user
  if (data.user) {
    await ensureProfileExists(data.user.id, data.user.email || '')
  }

  revalidatePath('/', 'layout')
  redirect('/posts')
}

/**
 * Sign out the current user and redirect to login page
 */
export async function signOut() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  revalidatePath('/', 'layout')
  redirect('/login')
}

/**
 * Get the currently authenticated user
 * @returns User object or null if not authenticated
 */
export async function getUser() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

/**
 * Get the profile for the currently authenticated user
 * Ensures the profile exists before returning it
 * @returns Profile object or null if user is not authenticated
 */
export async function getProfile() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return null

  // Ensure profile exists
  await ensureProfileExists(user.id, user.email || '')

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .maybeSingle()

  return profile
}

/**
 * Helper function to ensure a profile exists for a user
 * Creates a new profile if one doesn't exist
 * @param userId - The user's ID
 * @param email - The user's email address
 */
async function ensureProfileExists(userId: string, email: string) {
  const supabase = await createClient()

  const { data: existingProfile } = await supabase
    .from('profiles')
    .select('id')
    .eq('id', userId)
    .maybeSingle()

  // If profile doesn't exist, create it
  if (!existingProfile) {
    const displayName = email.split('@')[0]
    await supabase
      .from('profiles')
      .insert({
        id: userId,
        username: email,
        display_name: displayName,
      })
  }
}
