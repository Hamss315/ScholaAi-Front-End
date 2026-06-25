import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function parseUTCDate(dateStr: string | Date | undefined | null): Date {
  if (!dateStr) return new Date();
  if (dateStr instanceof Date) return dateStr;
  // If it doesn't end with Z and doesn't contain a timezone offset like +03:00 or -05:00
  if (!dateStr.endsWith("Z") && !/[+-]\d{2}:\d{2}$/.test(dateStr)) {
    return new Date(dateStr + "Z");
  }
  return new Date(dateStr);
}

export function getInitials(name?: string, firstName?: string, lastName?: string): string {
  const source = [firstName, lastName].filter(Boolean).join(" ").trim() || (name ?? "").trim();
  if (!source) return "";

  return source.slice(0, 2).toUpperCase();
}
