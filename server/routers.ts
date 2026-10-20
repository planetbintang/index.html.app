import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router, protectedProcedure } from "./_core/trpc";
import { z } from "zod";
import { invokeLLM } from "./_core/llm";
import {
  createSearchHistory,
  getSearchHistory,
  createRegexFile,
  getRegexFiles,
  updateRegexFile,
  deleteRegexFile,
  moveRegexFile as moveRegexFileDb,
} from "./db";
import { extractQueryContext, DEFAULT_REGEX_PATTERNS, serializeRegexPatterns } from "./regex-engine";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query((opts) => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  rgx: router({
    list: protectedProcedure
      .input(z.object({ path: z.string().default("/rgx") }))
      .query(async ({ ctx }) => {
        try {
          const files = await getRegexFiles(ctx.user.id);
          return files;
        } catch {
          return [];
        }
      }),

    create: protectedProcedure
      .input(
        z.object({
          name: z.string().min(1),
          path: z.string().default("/rgx"),
          content: z.string().default(""),
        })
      )
      .mutation(async ({ input, ctx }) => {
        const name = input.name.endsWith(".rgx") ? input.name : `${input.name}.rgx`;
        const fullPath = `${input.path}/${name}`;
        return await createRegexFile(ctx.user.id, {
          name,
          path: fullPath,
          type: "file",
          content: input.content,
        });
      }),

    update: protectedProcedure
      .input(
        z.object({
          id: z.number(),
          name: z.string().optional(),
          content: z.string().optional(),
          docType: z.enum(["alpha", "numeric", "symbols", "extensions"]).optional(),
        })
      )
      .mutation(async ({ input }) => {
        const { id, ...data } = input;
        return await updateRegexFile(id, data);
      }),

    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        await deleteRegexFile(input.id);
        return { success: true };
      }),

    move: protectedProcedure
      .input(z.object({ id: z.number(), newPath: z.string() }))
      .mutation(async ({ input }) => {
        await moveRegexFileDb(input.id, input.newPath);
        return { success: true };
      }),
  }),

  search: router({
    query: protectedProcedure
      .input(
        z.object({
          query: z.string().min(1, "Query cannot be empty"),
        })
      )
      .mutation(async ({ input, ctx }) => {
        const { query } = input;
        const userId = ctx.user.id;

        try {
          // Extract context from query using regex patterns
          const queryContext = extractQueryContext(query, DEFAULT_REGEX_PATTERNS);

          // Call LLM to process the query
          const llmResponse = await invokeLLM({
            messages: [
              {
                role: "system",
                content: `You are an intelligent search assistant. Analyze the user's query and provide a comprehensive, well-structured response.
Query patterns detected: ${queryContext}
Provide clear, concise answers with relevant information.`,
              },
              {
                role: "user",
                content: query,
              },
            ],
          });

          const response =
            llmResponse.choices[0]?.message?.content || "No response generated";

          // Save to search history
          await createSearchHistory(userId, {
            query,
            response:
              typeof response === "string"
                ? response
                : JSON.stringify(response),
          });

          return {
            query,
            response:
              typeof response === "string"
                ? response
                : JSON.stringify(response),
            timestamp: new Date(),
          };
        } catch (error) {
          const errorMessage =
            error instanceof Error ? error.message : "Search failed";
          throw new Error(`Search processing error: ${errorMessage}`);
        }
      }),

    history: protectedProcedure
      .input(
        z.object({
          limit: z.number().min(1).max(100).default(50),
        })
      )
      .query(async ({ input, ctx }) => {
        const { limit } = input;
        const userId = ctx.user.id;

        try {
          const history = await getSearchHistory(userId, limit);
          return history;
        } catch (error) {
          console.error("Failed to fetch search history:", error);
          return [];
        }
      }),
  }),
});

export type AppRouter = typeof appRouter;
