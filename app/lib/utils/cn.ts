import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function rtlClass(rtl: boolean, rtlClass: string, ltrClass: string = ""): string {
  return rtl ? rtlClass : ltrClass;
}

export function dirAttr(rtl: boolean): "rtl" | "ltr" {
  return rtl ? "rtl" : "ltr";
}
