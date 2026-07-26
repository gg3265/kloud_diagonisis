import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getWhatsAppLink() {
  const phoneNumber = "919699977171";
  const message = "Hello Kloud Diagnostics, I would like to inquire about booking a test / home blood collection. Please guide me with the details.";
  return `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
}
