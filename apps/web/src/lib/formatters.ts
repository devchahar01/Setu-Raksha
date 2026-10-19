/**
 * Trilingual localization formatting utilities for Setu Raksha.
 * - Dates: DD/MM/YYYY in Asia/Kolkata (IST) timezone
 * - Digits: Latin digits (0-9) by default with support for Devanagari numerals (०-९)
 * - Units: Metric SI standard with localized abbreviations
 */

const DEVANAGARI_DIGITS = ["०", "१", "२", "३", "४", "५", "६", "७", "८", "९"];

export function toDevanagariDigits(num: number | string): string {
  return String(num).replace(/\d/g, (d) => DEVANAGARI_DIGITS[parseInt(d, 10)]);
}

export function formatNumber(
  val: number | string,
  locale: "en" | "hi" | "mr" = "en",
  useDevanagariDigits: boolean = false
): string {
  const str = String(val);
  return useDevanagariDigits ? toDevanagariDigits(str) : str;
}

export function formatDateIST(
  date: Date | string | null | undefined,
  useDevanagariDigits: boolean = false
): string {
  if (!date) return "—";
  const d = typeof date === "string" ? new Date(date) : date;
  if (isNaN(d.getTime())) return "—";

  const formatter = new Intl.DateTimeFormat("en-IN", {
    timeZone: "Asia/Kolkata",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  const formatted = formatter.format(d); // DD/MM/YYYY
  return useDevanagariDigits ? toDevanagariDigits(formatted) : formatted;
}

export function formatDateTimeIST(
  date: Date | string | null | undefined,
  useDevanagariDigits: boolean = false
): string {
  if (!date) return "—";
  const d = typeof date === "string" ? new Date(date) : date;
  if (isNaN(d.getTime())) return "—";

  const formatter = new Intl.DateTimeFormat("en-IN", {
    timeZone: "Asia/Kolkata",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  const formatted = formatter.format(d);
  return useDevanagariDigits ? toDevanagariDigits(formatted) : formatted;
}

export type UnitType = "meters" | "millimeters" | "degrees" | "tonnes" | "percent" | "mm_per_hour" | "hz";

export function formatUnit(
  val: number,
  unit: UnitType,
  locale: "en" | "hi" | "mr" = "en",
  useDevanagariDigits: boolean = false
): string {
  const numStr = val.toFixed(1);
  const displayNum = useDevanagariDigits ? toDevanagariDigits(numStr) : numStr;

  const labels: Record<UnitType, Record<"en" | "hi" | "mr", string>> = {
    meters: { en: "m", hi: "मी.", mr: "मी." },
    millimeters: { en: "mm", hi: "मिमी", mr: "मिमी" },
    degrees: { en: "°", hi: "°", mr: "°" },
    tonnes: { en: "tonnes", hi: "टन", mr: "टन" },
    percent: { en: "%", hi: "%", mr: "%" },
    mm_per_hour: { en: "mm/h", hi: "मिमी/घंटा", mr: "मिमी/तास" },
    hz: { en: "Hz", hi: "हर्ट्ज़", mr: "हर्ट्झ" },
  };

  const unitLabel = labels[unit]?.[locale] || labels[unit]?.en || "";
  return `${displayNum} ${unitLabel}`;
}
