import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface EmergencyContact {
  id: string;
  name: string;
  phone: string;
  relation: string;
}

export interface Place {
  id: number;
  lat: number;
  lon: number;
  name: string;
  type: string;
  address?: string;
}

export interface RouteData {
  coordinates: [number, number][];
  distance: number;
  duration: number;
}
