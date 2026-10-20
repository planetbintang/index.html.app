import { eq, and, desc } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, regexDocuments, regexFiles, searchHistory, InsertRegexDocument, InsertRegexFile, InsertSearchHistory } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// Regex document queries
export async function createRegexDocument(userId: number, data: Omit<InsertRegexDocument, 'userId'>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(regexDocuments).values({
    ...data,
    userId,
  });
  return result;
}

export async function getRegexDocumentsByType(userId: number, type: string) {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(regexDocuments).where(
    and(
      eq(regexDocuments.userId, userId),
      eq(regexDocuments.type, type as any)
    )
  );
}

// File management queries
export async function createRegexFile(userId: number, data: Omit<InsertRegexFile, 'userId'>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return await db.insert(regexFiles).values({
    ...data,
    userId,
  });
}

export async function getRegexFiles(userId: number) {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(regexFiles).where(
    eq(regexFiles.userId, userId)
  ).orderBy(regexFiles.createdAt);
}

export async function getRegexFilesByPath(userId: number, path: string) {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(regexFiles).where(
    and(
      eq(regexFiles.userId, userId),
      eq(regexFiles.path, path)
    )
  );
}

export async function updateRegexFile(fileId: number, data: Partial<InsertRegexFile>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return await db.update(regexFiles).set(data).where(eq(regexFiles.id, fileId));
}

export async function deleteRegexFile(fileId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return await db.delete(regexFiles).where(eq(regexFiles.id, fileId));
}

export async function moveRegexFile(fileId: number, newPath: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return await db.update(regexFiles).set({ path: newPath }).where(eq(regexFiles.id, fileId));
}

// Search history queries
export async function createSearchHistory(userId: number, data: Omit<InsertSearchHistory, 'userId'>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return await db.insert(searchHistory).values({
    ...data,
    userId,
  });
}

export async function getSearchHistory(userId: number, limit = 50) {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(searchHistory).where(
    eq(searchHistory.userId, userId)
  ).orderBy(desc(searchHistory.createdAt)).limit(limit);
}
