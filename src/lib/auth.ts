import { hash } from "bcryptjs"

export async function hashPassword(password: string) {
  return await hash(password, 12)
}

export function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
} 