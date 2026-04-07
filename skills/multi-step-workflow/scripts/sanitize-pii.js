#!/usr/bin/env node
/**
 * scripts/sanitize-pii.js
 * 
 * A Code-Level Enforcement tool to strip Personally Identifiable Information (PII) 
 * and sensitive secrets from strings before they are persisted into memory logs.
 * This ensures compliance with ClawHub security audits.
 * 
 * Usage:
 *   node scripts/sanitize-pii.js "Text containing sensitive data"
 */

const input = process.argv.slice(2).join(' ');

if (!input) {
  console.log("Usage: node scripts/sanitize-pii.js \"Text to sanitize\"");
  process.exit(1);
}

// Simple regex patterns for common PII and secrets
const rules = [
  { name: 'Email', regex: /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, replacement: '[REDACTED_EMAIL]' },
  { name: 'IPv4', regex: /\b(?:\d{1,3}\.){3}\d{1,3}\b/g, replacement: '[REDACTED_IP]' },
  { name: 'Token/Key', regex: /(?:Bearer |Token |key=|password=|secret=)['"]?([a-zA-Z0-9\-_]{16,})['"]?/gi, replacement: '[REDACTED_SECRET]' },
  { name: 'Phone', regex: /(?:\+\d{1,3}[- ]?)?\(?\d{3}\)?[- ]?\d{3}[- ]?\d{4}\b/g, replacement: '[REDACTED_PHONE]' }
];

let sanitized = input;

for (const rule of rules) {
  // Try to preserve the context around the secret if possible, but keep it simple 
  // by just replacing the whole match or group.
  sanitized = sanitized.replace(rule.regex, (match) => {
    // If the regex has groups, we might want to keep the prefix (like "Bearer ")
    if (match.toLowerCase().startsWith('bearer ')) return 'Bearer [REDACTED_SECRET]';
    if (match.toLowerCase().startsWith('token ')) return 'Token [REDACTED_SECRET]';
    if (match.toLowerCase().includes('key=')) return match.replace(/key=[^&\s]+/i, 'key=[REDACTED_SECRET]');
    if (match.toLowerCase().includes('password=')) return match.replace(/password=[^&\s]+/i, 'password=[REDACTED_SECRET]');
    if (match.toLowerCase().includes('secret=')) return match.replace(/secret=[^&\s]+/i, 'secret=[REDACTED_SECRET]');
    return rule.replacement;
  });
}

console.log(sanitized);
