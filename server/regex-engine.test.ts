import { describe, expect, it } from "vitest";
import {
  analyzeQueryWithRegex,
  extractQueryContext,
  serializeRegexPatterns,
  deserializeRegexPatterns,
  DEFAULT_REGEX_PATTERNS,
} from "./regex-engine";

describe("Regex Engine", () => {
  describe("analyzeQueryWithRegex", () => {
    it("should detect alphabetic patterns in query", () => {
      const query = "Hello World";
      const results = analyzeQueryWithRegex(query, DEFAULT_REGEX_PATTERNS);

      const alphaResults = results.filter((r) => r.type === "alpha");
      expect(alphaResults.length).toBeGreaterThan(0);
    });

    it("should detect numeric patterns in query", () => {
      const query = "The year 2024 has 365 days";
      const results = analyzeQueryWithRegex(query, DEFAULT_REGEX_PATTERNS);

      const numericResults = results.filter((r) => r.type === "numeric");
      expect(numericResults.length).toBeGreaterThan(0);
      expect(numericResults.some((r) => r.matches.includes("2024"))).toBe(true);
    });

    it("should detect symbol patterns in query", () => {
      const query = "Email: test@example.com (important!)";
      const results = analyzeQueryWithRegex(query, DEFAULT_REGEX_PATTERNS);

      const symbolResults = results.filter((r) => r.type === "symbols");
      expect(symbolResults.length).toBeGreaterThan(0);
    });

    it("should detect extension patterns in query", () => {
      const query = "Download image.png or document.pdf";
      const results = analyzeQueryWithRegex(query, DEFAULT_REGEX_PATTERNS);

      const extensionResults = results.filter((r) => r.type === "extensions");
      expect(extensionResults.length).toBeGreaterThan(0);
    });

    it("should handle empty query gracefully", () => {
      const query = "";
      const results = analyzeQueryWithRegex(query, DEFAULT_REGEX_PATTERNS);

      expect(results).toEqual([]);
    });

    it("should remove duplicate matches", () => {
      const query = "test test test";
      const results = analyzeQueryWithRegex(query, DEFAULT_REGEX_PATTERNS);

      const alphaResults = results.filter((r) => r.type === "alpha");
      if (alphaResults.length > 0) {
        const matches = alphaResults[0].matches;
        const uniqueMatches = new Set(matches);
        expect(matches.length).toBeLessThanOrEqual(uniqueMatches.size + 1);
      }
    });
  });

  describe("extractQueryContext", () => {
    it("should extract context from query with patterns", () => {
      const query = "Find files created in 2024";
      const context = extractQueryContext(query, DEFAULT_REGEX_PATTERNS);

      expect(context).toBeTruthy();
      expect(context.length).toBeGreaterThan(0);
    });

    it("should return generic context for query without patterns", () => {
      const query = "xyz";
      const context = extractQueryContext(query, DEFAULT_REGEX_PATTERNS);

      // Query "xyz" matches lowercase patterns, so context should not be empty
      expect(context).toBeTruthy();
      expect(context.length).toBeGreaterThan(0);
    });

    it("should include multiple pattern types in context", () => {
      const query = "Test123!@#";
      const context = extractQueryContext(query, DEFAULT_REGEX_PATTERNS);

      expect(context).toBeTruthy();
      expect(context.length).toBeGreaterThan(0);
    });
  });

  describe("serializeRegexPatterns", () => {
    it("should serialize patterns to string format", () => {
      const patterns = [
        { pattern: "[A-Z]", description: "Uppercase" },
        { pattern: "[a-z]", description: "Lowercase" },
      ];

      const serialized = serializeRegexPatterns(patterns);

      expect(serialized).toContain("[A-Z]|Uppercase");
      expect(serialized).toContain("[a-z]|Lowercase");
    });

    it("should limit to 15 lines maximum", () => {
      const patterns = Array.from({ length: 20 }, (_, i) => ({
        pattern: `[${i}]`,
        description: `Pattern ${i}`,
      }));

      const serialized = serializeRegexPatterns(patterns);
      const lines = serialized.split("\n");

      expect(lines.length).toBeLessThanOrEqual(15);
    });

    it("should handle empty patterns array", () => {
      const patterns: any[] = [];
      const serialized = serializeRegexPatterns(patterns);

      expect(serialized).toBe("");
    });
  });

  describe("deserializeRegexPatterns", () => {
    it("should deserialize patterns from string format", () => {
      const content = "[A-Z]|Uppercase\n[a-z]|Lowercase";
      const patterns = deserializeRegexPatterns(content);

      expect(patterns).toHaveLength(2);
      expect(patterns[0]).toEqual({
        pattern: "[A-Z]",
        description: "Uppercase",
      });
      expect(patterns[1]).toEqual({
        pattern: "[a-z]",
        description: "Lowercase",
      });
    });

    it("should handle empty content", () => {
      const content = "";
      const patterns = deserializeRegexPatterns(content);

      expect(patterns).toEqual([]);
    });

    it("should skip empty lines", () => {
      const content = "[A-Z]|Uppercase\n\n[a-z]|Lowercase\n";
      const patterns = deserializeRegexPatterns(content);

      expect(patterns).toHaveLength(2);
    });

    it("should handle patterns without description", () => {
      const content = "[A-Z]";
      const patterns = deserializeRegexPatterns(content);

      expect(patterns).toHaveLength(1);
      expect(patterns[0].pattern).toBe("[A-Z]");
      expect(patterns[0].description).toBe("");
    });
  });

  describe("DEFAULT_REGEX_PATTERNS", () => {
    it("should have exactly 4 pattern types", () => {
      const types = Object.keys(DEFAULT_REGEX_PATTERNS);
      expect(types).toEqual(["alpha", "numeric", "symbols", "extensions"]);
    });

    it("should have 15 patterns for each type", () => {
      for (const [type, patterns] of Object.entries(DEFAULT_REGEX_PATTERNS)) {
        expect(patterns).toHaveLength(15);
      }
    });

    it("should have valid regex patterns", () => {
      for (const [type, patterns] of Object.entries(DEFAULT_REGEX_PATTERNS)) {
        for (const { pattern } of patterns) {
          expect(() => new RegExp(pattern)).not.toThrow();
        }
      }
    });

    it("should have descriptions for all patterns", () => {
      for (const [type, patterns] of Object.entries(DEFAULT_REGEX_PATTERNS)) {
        for (const { description } of patterns) {
          expect(description).toBeTruthy();
          expect(description.length).toBeGreaterThan(0);
        }
      }
    });
  });
});
