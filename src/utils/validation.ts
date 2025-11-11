/**
 * Format phone number to US standard (XXX) XXX-XXXX
 */
export function formatPhoneNumber(value: string): string {
  // Remove all non-digit characters
  const cleaned = value.replace(/\D/g, '');
  
  // Limit to 10 digits
  const limited = cleaned.slice(0, 10);
  
  // Format based on length
  if (limited.length === 0) {
    return '';
  } else if (limited.length <= 3) {
    return `(${limited}`;
  } else if (limited.length <= 6) {
    return `(${limited.slice(0, 3)}) ${limited.slice(3)}`;
  } else {
    return `(${limited.slice(0, 3)}) ${limited.slice(3, 6)}-${limited.slice(6)}`;
  }
}

/**
 * Validate phone number - must be exactly 10 digits
 */
export function isValidPhoneNumber(value: string): boolean {
  const cleaned = value.replace(/\D/g, '');
  return cleaned.length === 10;
}

/**
 * Validate email with robust regex pattern
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
}

/**
 * Sanitize input to prevent XSS attacks
 */
export function sanitizeInput(text: string): string {
  if (typeof text !== 'string') return '';
  
  return text
    .replace(/[<>]/g, '') // Remove angle brackets
    .trim()
    .slice(0, 10000); // Limit length
}
