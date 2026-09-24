/**
 * Sanitize generated JavaScript code before execution.
 * Prevents code injection from tampered localStorage drafts.
 */
const DANGEROUS_PATTERNS = [
  /\beval\s*\(/i,
  /\bFunction\s*\(/i,
  /\bAsyncFunction\b/i,
  /\bfetch\s*\(/i,
  /\bXMLHttpRequest\b/i,
  /\bdocument\b/i,
  /\bwindow\b/i,
  /\bglobalThis\b/i,
  /\bprocess\b/i,
  /\blocalStorage\b/i,
  /\bsessionStorage\b/i,
  /\bindexedDB\b/i,
  /\bopenDatabase\b/i,
  /\bimport\s*[\(\{]/i,
  /\brequire\s*\(/i,
  /\blocation\b/i,
  /\bnavigator\b/i,
  /\bpostMessage\b/i,
  /\bWorker\b/i,
  /\bSharedWorker\b/i,
  /\bServiceWorker\b/i,
  /\bWebSocket\b/i,
  /\bEventSource\b/i,
  /\bconstructor\b/i,
  /\b__proto__\b/i,
  /\bprototype\b/i,
  /\bcookie\b/i,
  /\binnerHTML\b/i,
  /\bouterHTML\b/i,
  /\balert\s*\(/i,
  /\bconfirm\s*\(/i,
  /\bprompt\s*\(/i,
  /\bopener\b/i,
  /\bparent\b/i,
  /\btop\b/i,
];

export function sanitizeCode(code: string): string | null {
  if (!code || typeof code !== 'string') return null;

  for (const pattern of DANGEROUS_PATTERNS) {
    if (pattern.test(code)) {
      console.warn('[Security] Blocked dangerous code pattern:', pattern.source);
      return null;
    }
  }

  return code;
}
