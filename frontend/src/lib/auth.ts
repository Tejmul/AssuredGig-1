// This file provides authentication utilities for the frontend
import { getSession } from 'next-auth/react';
import { NextAuthOptions } from 'next-auth';
import bcrypt from 'bcryptjs';

// Function to check if the user is authenticated
export async function isAuthenticated() {
  const session = await getSession();
  return !!session;
}

// Function to get the current user
export async function getCurrentUser() {
  const session = await getSession();
  return session?.user;
}

// Function to check if the user has a specific role
export async function hasRole(role: string) {
  const session = await getSession();
  return session?.user?.role === role;
}

// Function to get the user's role
export async function getUserRole() {
  const session = await getSession();
  return session?.user?.role;
}

// Function to get the user's ID
export async function getUserId() {
  const session = await getSession();
  return session?.user?.id;
}

// Function to get the user's name
export async function getUserName() {
  const session = await getSession();
  return session?.user?.name;
}

// Function to get the user's email
export async function getUserEmail() {
  const session = await getSession();
  return session?.user?.email;
}

// Function to get the user's image
export async function getUserImage() {
  const session = await getSession();
  return session?.user?.image;
}

// Function to get the user's initials
export function getInitials(name: string) {
  if (!name) return '';
  return name
    .split(' ')
    .map(part => part[0])
    .join('')
    .toUpperCase();
}

// Function to hash a password
export async function hashPassword(password: string) {
  return bcrypt.hash(password, 10);
}

// Function to compare a password with a hash
export async function comparePassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}

// Note: authOptions is now defined in auth.config.ts 