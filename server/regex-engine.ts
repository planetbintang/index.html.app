/**
 * Regex Indexing Engine
 * Manages 4 types of regex patterns for intelligent query processing
 */

export interface RegexPattern {
  pattern: string;
  description: string;
}

export interface RegexIndex {
  alpha: RegexPattern[];
  numeric: RegexPattern[];
  symbols: RegexPattern[];
  extensions: RegexPattern[];
}

/**
 * Default regex patterns for each document type
 * Each document contains exactly 15 lines of regex patterns
 */
export const DEFAULT_REGEX_PATTERNS: RegexIndex = {
  // Document 1: Regex A-Z and a-z
  alpha: [
    { pattern: "[A-Z]", description: "Uppercase letters A-Z" },
    { pattern: "[a-z]", description: "Lowercase letters a-z" },
    { pattern: "[A-Za-z]", description: "All letters (case-insensitive)" },
    { pattern: "\\b[A-Z][a-z]+\\b", description: "Capitalized words" },
    { pattern: "\\b[A-Z]+\\b", description: "All uppercase words" },
    { pattern: "\\b[a-z]+\\b", description: "All lowercase words" },
    { pattern: "[A-Z][a-z]*(?:[A-Z][a-z]*)*", description: "CamelCase words" },
    { pattern: "^[A-Z]", description: "Starts with uppercase" },
    { pattern: "[a-z]$", description: "Ends with lowercase" },
    { pattern: "[A-Za-z]{2,}", description: "Words with 2+ letters" },
    { pattern: "[A-Za-z]{5,}", description: "Words with 5+ letters" },
    { pattern: "^[a-z]+$", description: "Entire lowercase string" },
    { pattern: "^[A-Z]+$", description: "Entire uppercase string" },
    { pattern: "[A-Z]{2,}(?=[A-Z][a-z]|\\b|_)", description: "Acronyms" },
    { pattern: "(?<=[a-z])(?=[A-Z])", description: "CamelCase boundaries" },
  ],

  // Document 2: Regex 0-9
  numeric: [
    { pattern: "[0-9]", description: "Single digit 0-9" },
    { pattern: "\\d", description: "Digit shorthand" },
    { pattern: "[0-9]{2,}", description: "Multiple digits" },
    { pattern: "\\d{3}", description: "Exactly 3 digits" },
    { pattern: "\\d{1,3}", description: "1 to 3 digits" },
    { pattern: "^\\d+$", description: "All digits only" },
    { pattern: "\\b\\d+\\b", description: "Whole numbers" },
    { pattern: "\\d+\\.\\d+", description: "Decimal numbers" },
    { pattern: "^[0-9]+$", description: "Entire numeric string" },
    { pattern: "[0-9]{4}", description: "4-digit numbers (year)" },
    { pattern: "[0-9]{2}:[0-9]{2}", description: "Time format HH:MM" },
    { pattern: "[0-9]{1,2}/[0-9]{1,2}/[0-9]{2,4}", description: "Date format" },
    { pattern: "(?:0|[1-9]\\d?)", description: "Numbers 0-99" },
    { pattern: "[1-9][0-9]*", description: "Positive integers" },
    { pattern: "-?\\d+", description: "Integers with optional sign" },
  ],

  // Document 3: Regex symbols
  symbols: [
    { pattern: "[!@#$%^&*()_+\\-=\\[\\]{};:'\",.<>?/\\\\|`~]", description: "Common symbols" },
    { pattern: "[!?.]", description: "Punctuation marks" },
    { pattern: "[()\\[\\]{}]", description: "Brackets and braces" },
    { pattern: "[+\\-*/=]", description: "Mathematical operators" },
    { pattern: "[<>!=]", description: "Comparison operators" },
    { pattern: "[&|^~]", description: "Bitwise operators" },
    { pattern: "[;:,.]", description: "Separators" },
    { pattern: "[@#$%]", description: "Special characters" },
    { pattern: "['\\\"]", description: "Quotes" },
    { pattern: "[\\s]", description: "Whitespace" },
    { pattern: "[\\t\\n\\r]", description: "Whitespace characters" },
    { pattern: "[_-]", description: "Underscores and hyphens" },
    { pattern: "[/\\\\]", description: "Slashes" },
    { pattern: "[*+?]", description: "Regex quantifiers" },
    { pattern: "[|()]", description: "Regex alternation and grouping" },
  ],

  // Document 4: Extensions, languages, patterns, binary
  extensions: [
    { pattern: "\\b[01]{8}\\b", description: "Binary bytes (8 bits)" },
    { pattern: "\\b[01]{16}\\b", description: "Binary words (16 bits)" },
    { pattern: "\\b[01]{32}\\b", description: "Binary dwords (32 bits)" },
    { pattern: "0[bB][01]+", description: "Binary literals" },
    { pattern: "\\.(js|ts|jsx|tsx)$", description: "JavaScript/TypeScript files" },
    { pattern: "\\.(jpg|png|gif|webp|svg)$", description: "Image files" },
    { pattern: "\\.(pdf|doc|docx|txt)$", description: "Document files" },
    { pattern: "\\.(mp3|wav|flac|aac)$", description: "Audio files" },
    { pattern: "\\.(mp4|avi|mov|mkv)$", description: "Video files" },
    { pattern: "\\.(zip|rar|7z|tar|gz)$", description: "Archive files" },
    { pattern: "\\b(byte|bit|nibble|word|dword)\\b", description: "Binary units" },
    { pattern: "\\b(function|class|const|let|var)\\b", description: "Code keywords" },
    { pattern: "\\b(import|export|require|module)\\b", description: "Module keywords" },
    { pattern: "\\b(async|await|Promise|callback)\\b", description: "Async patterns" },
    { pattern: "\\b(true|false|null|undefined)\\b", description: "Boolean/Null values" },
  ],
};

/**
 * Apply regex patterns to query text
 * Returns matched patterns and their descriptions
 */
export function analyzeQueryWithRegex(query: string, patterns: RegexIndex): {
  type: string;
  matches: string[];
  description: string;
}[] {
  const results: { type: string; matches: string[]; description: string }[] = [];

  for (const [type, patternList] of Object.entries(patterns)) {
    for (const { pattern, description } of patternList) {
      try {
        const regex = new RegExp(pattern, "g");
        const matches = query.match(regex);
        if (matches && matches.length > 0) {
          results.push({
            type,
            matches: Array.from(new Set(matches)), // Remove duplicates
            description,
          });
        }
      } catch (e) {
        console.warn(`Invalid regex pattern: ${pattern}`, e);
      }
    }
  }

  return results;
}

/**
 * Extract context from query based on regex patterns
 * Useful for building context for LLM
 */
export function extractQueryContext(
  query: string,
  patterns: RegexIndex
): string {
  const analysis = analyzeQueryWithRegex(query, patterns);

  if (analysis.length === 0) {
    return "Generic query without specific patterns detected.";
  }

  const contexts = analysis.map((item) => `${item.type}: ${item.description}`);
  return contexts.join(" | ");
}

/**
 * Serialize regex patterns to string format (15 lines per document)
 */
export function serializeRegexPatterns(patterns: RegexPattern[]): string {
  return patterns
    .slice(0, 15) // Ensure exactly 15 lines
    .map((p) => `${p.pattern}|${p.description}`)
    .join("\n");
}

/**
 * Deserialize regex patterns from string format
 */
export function deserializeRegexPatterns(content: string): RegexPattern[] {
  return content
    .split("\n")
    .filter((line) => line.trim())
    .map((line) => {
      const [pattern, description] = line.split("|");
      return { pattern: pattern.trim(), description: description?.trim() || "" };
    });
}

/**
 * Move regex file from one path to another
 */
export function moveRegexFile(
  currentPath: string,
  newPath: string,
  fileName: string
): string {
  // Ensure paths end with /
  const fromPath = currentPath.endsWith("/") ? currentPath : currentPath + "/";
  const toPath = newPath.endsWith("/") ? newPath : newPath + "/";
  return toPath + fileName;
}

/**
 * Validate binary regex pattern
 */
export function isBinaryPattern(pattern: string): boolean {
  const binaryPatterns = [
    /\b[01]{8}\b/, // 8-bit binary
    /\b[01]{16}\b/, // 16-bit binary
    /\b[01]{32}\b/, // 32-bit binary
    /0[bB][01]+/, // Binary literals
    /\b(byte|bit|nibble|word|dword)\b/, // Binary units
  ];
  return binaryPatterns.some((p) => p.test(pattern));
}
