export type ClassValue = string | false | null | undefined;

/** Tiny classnames joiner — avoids pulling in an extra dependency. */
export function cn(...classes: ClassValue[]): string {
  return classes.filter(Boolean).join(' ');
}
