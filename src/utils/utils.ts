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
  const fName = (firstName ?? "").trim();
  const lName = (lastName ?? "").trim();
  if (fName || lName) {
    const firstInitial = fName ? fName.charAt(0) : "";
    const lastInitial = lName ? lName.charAt(0) : "";
    return (firstInitial + lastInitial).toUpperCase();
  }

  const cleanName = (name ?? "")
    .trim()
    .replace(/^(dr|prof|mr|mrs|ms)\.?\s+/i, "");
  if (!cleanName) return "";

  const parts = cleanName.split(/\s+/);
  if (parts.length >= 2) {
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
  }

  return cleanName.slice(0, 2).toUpperCase();
}

