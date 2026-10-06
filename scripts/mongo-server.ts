import { MongoMemoryServer } from "mongodb-memory-server";
import fs from "fs";
import path from "path";

const dbPath = path.join(process.cwd(), ".mongodb-data");
if (!fs.existsSync(dbPath)) {
  fs.mkdirSync(dbPath, { recursive: true });
}

async function start() {
  console.log("Starting local MongoDB instance on port 27017...");
  const mongod = await MongoMemoryServer.create({
    instance: {
      port: 27017,
      dbPath,
      storageEngine: "wiredTiger",
    },
  });

  console.log(`✅ MongoDB server active and listening on: ${mongod.getUri()}`);
  console.log(`📁 Persistent storage directory: ${dbPath}`);

  const shutdown = async () => {
    console.log("Stopping MongoDB server...");
    await mongod.stop();
    process.exit(0);
  };

  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);
}

start().catch((err) => {
  console.error("Failed to start MongoDB server:", err);
  process.exit(1);
});
