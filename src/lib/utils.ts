import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatRating(rating: number): string {
  return rating.toFixed(1);
}

export function getRatingLabel(rating: number): string {
  if (rating >= 9.5) return "Exceptional";
  if (rating >= 9.0) return "Superb";
  if (rating >= 8.5) return "Fabulous";
  if (rating >= 8.0) return "Very Good";
  if (rating >= 7.0) return "Good";
  return "Okay";
}

export function formatPrice(price: number, currency = "USD"): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
  }).format(price);
}

export function madToUsd(mad: number): number {
  return Math.round((mad / 10) * 100) / 100;
}
