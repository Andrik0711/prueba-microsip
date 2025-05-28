// src/utils/productUtils.ts

// Limpia el prefijo 'val::' y decodifica caracteres mal codificados
export function cleanAndDecode(str: string): string {
  if (!str) return '';
  const cleaned = str.startsWith('val::') ? str.slice(5) : str;
  try {
    return decodeURIComponent(escape(cleaned));
  } catch {
    return cleaned;
  }
}

export function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
