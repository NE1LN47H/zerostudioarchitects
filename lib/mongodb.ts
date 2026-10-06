import { MongoClient, Db } from "mongodb";

const uri = process.env.MONGODB_URI || "mongodb://localhost:27017";
const dbName = process.env.MONGODB_DB || "zero_studio_test";

let client: MongoClient | null = null;
let clientPromise: Promise<MongoClient> | null = null;

declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

export async function getMongoClient(): Promise<MongoClient> {
  if (!uri) {
    throw new Error("MONGODB_URI environment variable is not defined");
  }

  if (process.env.NODE_ENV === "development") {
    // In development mode, use a global variable to preserve the MongoClient
    // across module reloads caused by HMR (Hot Module Replacement).
    if (!global._mongoClientPromise) {
      client = new MongoClient(uri, {
        serverSelectionTimeoutMS: 2000,
        connectTimeoutMS: 2000,
      });
      global._mongoClientPromise = client.connect();
    }
    clientPromise = global._mongoClientPromise;
  } else {
    // In production mode, it's best to not use a global variable.
    if (!clientPromise) {
      client = new MongoClient(uri, {
        serverSelectionTimeoutMS: 3000,
        connectTimeoutMS: 3000,
        maxPoolSize: 10,
      });
      clientPromise = client.connect();
    }
  }

  return clientPromise;
}

export async function getDb(): Promise<Db> {
  const client = await getMongoClient();
  return client.db(dbName);
}

/**
 * Ensures indexes exist on key collections for optimal query performance.
 */
export async function ensureDatabaseIndexes(db: Db): Promise<void> {
  try {
    await Promise.allSettled([
      db.collection("hero").createIndex({ order: 1 }),
      db.collection("hero").createIndex({ visible: 1 }),
      db.collection("projects").createIndex({ slug: 1 }, { unique: true }),
      db.collection("projects").createIndex({ order: 1 }),
      db.collection("projects").createIndex({ featured: 1, visible: 1 }),
      db.collection("awards").createIndex({ order: 1 }),
      db.collection("awards").createIndex({ curated: 1, visible: 1 }),
      db.collection("journal").createIndex({ slug: 1 }, { unique: true }),
      db.collection("journal").createIndex({ order: 1 }),
      db.collection("journal").createIndex({ featured: 1, visible: 1 }),
      db.collection("team").createIndex({ order: 1 }),
      db.collection("media").createIndex({ publicId: 1 }, { unique: true }),
      db.collection("admin_users").createIndex({ email: 1 }, { unique: true }),
    ]);
  } catch (err) {
    console.warn("Index creation warning (safe to ignore if already created):", err);
  }
}
