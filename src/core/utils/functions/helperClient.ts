"use client";

import { BsFiletypePdf } from "react-icons/bs";
import { FaFile, FaFileImage, FaFileWord } from "react-icons/fa";
import { InputItem } from "../../types/generalTypes";
import { SelectOption } from "../../types/interfaces/SelectOption";

export function getStorageTheme() {
  if (typeof window !== "undefined") {
    const theme = localStorage.getItem("theme");
    if (theme) {
      return theme;
    }
  }
}
export const getLangFromPath = (): string => {
  if (typeof window === "undefined") return "ar";
  const pathParts = window.location.pathname.split("/");
  return pathParts[1] || "ar";
};

export const getLangFromPathforcbs = (): string => {
  if (typeof window === "undefined") return "ar";
  const pathParts = window.location.pathname.split("/");
  return pathParts[2] || "ar";
};

export function removeLanguageFromPath(path: string): string {
  const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH;
  const basePath = BASE_PATH ? `/${BASE_PATH}` : "";

  const regex = new RegExp(`^${basePath}/[a-zA-Z-]+(/|$)`);

  return path.replace(regex, `${basePath}/`);
}

export function getSecondLastPath(url: string): string | null {
  const parts = url.split("/").filter(Boolean);
  return parts.length > 1 ? parts[parts.length - 2] : null;
}

// Helper للتحويل من string "HH:mm:ss" إلى دقائق
export const timeStringToMinutes = (time: string) => {
  const [hours, minutes, seconds] = time.split(":").map(Number);
  return hours * 60 + minutes + seconds / 60;
};

export const getItemsSelectByLocale = (
  locale: string,
  items: unknown // ✅ نقبل أي نوع هنا
): SelectOption[] => {
  if (!Array.isArray(items)) {
    return [];
  }

  // فلترة العناصر الصالحة فقط (matchCondition Type Guard)
  const validItems = items.filter((item): item is InputItem => {
    return (
      typeof item === "object" &&
      item !== null &&
      "id" in item &&
      "nameEn" in item &&
      "nameAr" in item &&
      typeof (item as InputItem).id === "number" &&
      typeof (item as InputItem).nameEn === "string" &&
      typeof (item as InputItem).nameAr === "string"
    );
  });
  // إرجاع العناصر النشطة مع الترجمة حسب اللغة
  return validItems.map((item) => ({
    id: item.id,
    name: locale === "ar" ? item.nameAr : item.nameEn,
  }));
};

export const getSymbolCurrency = (currencyId: string) => {
  switch (currencyId) {
    case "1":
      return "$";
    case "2":
      return "SYP";
    case "3":
      return "TL";
    default:
      return "";
  }
};
export function getCurrencyNameById(id: number): string {
  switch (id) {
    case 0:
      return "All";
    case 1:
      return "dollar";
    case 2:
      return "syrian";
    case 3:
      return "turkish";
    default:
      return "-";
  }
}

export const getLocalDateString = (date: Date | null) => {
  if (!date) return null;
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};
export const getLocalTimeString = (date: Date | null) => {
  if (!date) return null;
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  if (hours === "00" && minutes === "00") {
    return null;
  }

  return `${hours}:${minutes}`;
};

export function stripTime(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}
export const getCurrencyCode = (currencyId: string | number): string => {
  switch (Number(currencyId)) {
    case 1:
      return "USD"; // US Dollar
    case 2:
      return "SYP"; // Syrian Pound
    case 3:
      return "EUR"; // Euro
    case 4:
      return "IDR"; // Indonesian Rupiah
    case 5:
      return "TRY"; // Turkish Lira
    case 6:
      return "JOD"; // Jordanian Dinar
    case 7:
      return "SAR"; // Saudi Riyal
    case 8:
      return "QAR"; // Qatari Riyal
    case 9:
      return "MYR"; // Malaysian Ringgit
    case 10:
      return "OMR"; // Omani Rial
    case 11:
      return "GBP"; // British Pound
    default:
      return "UNKNOWN";
  }
};

export const maskStringStars = (
  value: string,
  visibleDigits: number = 4
): string => {
  if (!value) return "";
  return value.length > visibleDigits
    ? value.slice(0, -visibleDigits).replace(/./g, "*") +
        value.slice(-visibleDigits)
    : value;
};

export function delay(ms: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms));
}

export const base64ToBlob = (base64: string, mimeType: string) => {
  const byteCharacters = atob(base64);
  const byteNumbers = new Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  const byteArray = new Uint8Array(byteNumbers);
  return new Blob([byteArray], { type: mimeType });
};

export const getFileIcon = (file?: File | null) => {
  if (!file) return FaFile;

  const type = file?.type;

  if (type?.startsWith("image/")) return FaFileImage;
  if (type === "application/pdf") return BsFiletypePdf;
  if (
    type === "application/msword" ||
    type ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  )
    return FaFileWord;

  return FaFile; // default icon
};

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 B";

  const KB = 1024;
  const MB = KB * 1024;
  const GB = MB * 1024;
  const TB = GB * 1024;

  if (bytes < KB) {
    return `${bytes} B`;
  } else if (bytes < MB) {
    return `${(bytes / KB).toFixed(2)} KB`;
  } else if (bytes < GB) {
    return `${(bytes / MB).toFixed(2)} MB`;
  } else if (bytes < TB) {
    return `${(bytes / GB).toFixed(2)} GB`;
  } else {
    return `${(bytes / TB).toFixed(2)} TB`;
  }
}

export const helperClient = {
  getStorageTheme,
  getLangFromPath,
  getLangFromPathforcbs,
  removeLanguageFromPath,
  getSecondLastPath,
  timeStringToMinutes,
  getItemsSelectByLocale,
  getSymbolCurrency,
  getCurrencyNameById,
  getLocalDateString,
  getLocalTimeString,
  stripTime,
  getCurrencyCode,
  maskStringStars,
  delay,
  base64ToBlob,
  getFileIcon,
  formatFileSize,
};
