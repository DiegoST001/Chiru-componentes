type ClassValue = string | number | false | null | undefined;

/**
 * Conditionally merges class names into a single string
 * @param classes List of values (strings, numbers, or falsy values)
 * @returns Concatenated string of class names
 */
export function cx(...classes: ClassValue[]): string {
  return classes.filter(Boolean).join(" ");
}
