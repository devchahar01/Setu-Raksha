/**
 * Setu Rakshak Haptics & Tactile Feedback Utility
 * Provides native vibration feedback on touch devices and subtle micro-feedback.
 */

export type HapticType =
  | "tap"
  | "toggle"
  | "select"
  | "selection"
  | "light"
  | "medium"
  | "heavy"
  | "success"
  | "warning"
  | "error";

export function triggerHaptic(type: HapticType = "tap"): void {
  if (typeof window === "undefined" || !("navigator" in window)) return;

  try {
    if ("vibrate" in navigator && typeof navigator.vibrate === "function") {
      switch (type) {
        case "tap":
        case "light":
          navigator.vibrate(8);
          break;
        case "select":
        case "selection":
          navigator.vibrate(12);
          break;
        case "toggle":
        case "medium":
          navigator.vibrate([10, 20, 10]);
          break;
        case "heavy":
          navigator.vibrate(35);
          break;
        case "success":
          navigator.vibrate([15, 40, 20]);
          break;
        case "warning":
          navigator.vibrate([25, 50, 25]);
          break;
        case "error":
          navigator.vibrate([40, 30, 40, 30, 50]);
          break;
        default:
          navigator.vibrate(8);
      }
    }
  } catch {
    // Graceful fallback for non-supported or restricted environments
  }
}
