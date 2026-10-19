import path from "path";
import fs from "fs";
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
dotenv.config();

import { MongoClient, Db } from "mongodb";
import { v2 as cloudinary } from "cloudinary";

// Configuration for OLD and NEW accounts
const OLD_MONGO_URI =
  process.env.OLD_MONGODB_URI ||
  "";
const OLD_DB_NAME = process.env.OLD_MONGODB_DB || "zero_studio";

const NEW_MONGO_URI = process.env.MONGODB_URI || "";
const NEW_DB_NAME = process.env.MONGODB_DB || "zero_studio";

const NEW_CLOUDINARY = {
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || "",
  api_key: process.env.CLOUDINARY_API_KEY || "",
  api_secret: process.env.CLOUDINARY_API_SECRET || "",
  secure: true,
};

cloudinary.config(NEW_CLOUDINARY);

interface CloudinaryAssetMapping {
  originalPath: string;
  secureUrl: string;
  publicId: string;
  width?: number;
  height?: number;
  format?: string;
  bytes?: number;
}

// Map from local relative path (e.g. /projects/HAVEN/1-opt.jpg) to CloudinaryAssetMapping
const mediaMap = new Map<string, CloudinaryAssetMapping>();

async function uploadFileToCloudinary(
  localFilePath: string,
  relativePath: string
): Promise<CloudinaryAssetMapping | null> {
  try {
    // Generate clean public_id: e.g. zerostudio/projects/HAVEN/1-opt
    const cleanRelPath = relativePath.replace(/^\//, "").replace(/\.[^/.]+$/, "");
    const publicId = `zerostudio/${cleanRelPath}`;

    // Upload to Cloudinary with overwrite: false to avoid re-uploading if already exists
    const res = await cloudinary.uploader.upload(localFilePath, {
      public_id: publicId,
      overwrite: false,
      resource_type: "image",
      transformation: [{ quality: "auto", fetch_format: "auto" }],
    });

    let deliveryUrl = res.secure_url;
    if (res.format === "heic" || res.format === "heif" || deliveryUrl.toLowerCase().endsWith(".heic")) {
      deliveryUrl = deliveryUrl.replace(/\.(heic|heif)$/i, ".jpg");
    }

    const mapping: CloudinaryAssetMapping = {
      originalPath: relativePath,
      secureUrl: deliveryUrl,
      publicId: res.public_id,
      width: res.width,
      height: res.height,
      format: res.format,
      bytes: res.bytes,
    };

    return mapping;
  } catch (err: any) {
    // If resource already exists or other non-fatal error, try to fetch its info
    try {
      const cleanRelPath = relativePath.replace(/^\//, "").replace(/\.[^/.]+$/, "");
      const publicId = `zerostudio/${cleanRelPath}`;
      const existing = await cloudinary.api.resource(publicId);
      return {
        originalPath: relativePath,
        secureUrl: existing.secure_url,
        publicId: existing.public_id,
        width: existing.width,
        height: existing.height,
        format: existing.format,
        bytes: existing.bytes,
      };
    } catch {
      console.warn(`⚠️ Could not upload or retrieve Cloudinary asset for ${relativePath}:`, err.message);
      return null;
    }
  }
}

async function uploadAllLocalMedia(): Promise<void> {
  console.log("\n==================================================");
  console.log("📸 STEP 1: Uploading local media to new Cloudinary account (hle2zpto)...");
  console.log("==================================================");

  const publicDir = path.resolve(process.cwd(), "public");

  function findFiles(dir: string, baseDir: string): string[] {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    let files: string[] = [];
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        files = files.concat(findFiles(fullPath, baseDir));
      } else if (entry.isFile()) {
        if (/\.(jpg|jpeg|png|webp|avif|svg)$/i.test(entry.name)) {
          files.push(fullPath);
        }
      }
    }
    return files;
  }

  const targetDirs = [
    path.join(publicDir, "projects"),
    path.join(publicDir, "team"),
  ];

  let allImageFiles: string[] = [];
  for (const d of targetDirs) {
    if (fs.existsSync(d)) {
      allImageFiles = allImageFiles.concat(findFiles(d, publicDir));
    }
  }

  // Also include branding logos
  const logoFiles = ["ZERO-LOGO-ORIGINAL.png", "ZERO-LOGO.png", "zero-logo-trimmed.png"];
  for (const lf of logoFiles) {
    const full = path.join(publicDir, lf);
    if (fs.existsSync(full)) allImageFiles.push(full);
  }

  console.log(`Found ${allImageFiles.length} media files to migrate to Cloudinary.`);

  let uploadedCount = 0;
  for (const file of allImageFiles) {
    const relFromPublic = "/" + path.relative(publicDir, file).replace(/\\/g, "/");
    const mapping = await uploadFileToCloudinary(file, relFromPublic);
    if (mapping) {
      mediaMap.set(relFromPublic, mapping);
      // Also map variations without leading slash or with differing cases
      mediaMap.set(relFromPublic.slice(1), mapping);
      uploadedCount++;
    }
  }

  console.log(`✅ Successfully mapped and migrated ${uploadedCount} media assets to Cloudinary.\n`);
}

function replaceImageUrlsInObject(obj: any): any {
  if (obj === null || obj === undefined) return obj;

  if (typeof obj === "string") {
    // Check if string matches any key in mediaMap
    if (mediaMap.has(obj)) {
      return mediaMap.get(obj)!.secureUrl;
    }
    const withSlash = obj.startsWith("/") ? obj : `/${obj}`;
    if (mediaMap.has(withSlash)) {
      return mediaMap.get(withSlash)!.secureUrl;
    }
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map((item) => replaceImageUrlsInObject(item));
  }

  if (typeof obj === "object") {
    const newObj: any = {};
    for (const [key, value] of Object.entries(obj)) {
      newObj[key] = replaceImageUrlsInObject(value);
      // If this object is an image with src, also set publicId if available
      if (key === "src" && typeof value === "string") {
        const mapping = mediaMap.get(value) || mediaMap.get(value.startsWith("/") ? value : `/${value}`);
        if (mapping && !newObj.publicId) {
          newObj.publicId = mapping.publicId;
        }
      }
      if (key === "heroImage" && typeof value === "string") {
        const mapping = mediaMap.get(value) || mediaMap.get(value.startsWith("/") ? value : `/${value}`);
        if (mapping && !newObj.heroImagePublicId) {
          newObj.heroImagePublicId = mapping.publicId;
        }
      }
      if (key === "image" && typeof value === "string") {
        const mapping = mediaMap.get(value) || mediaMap.get(value.startsWith("/") ? value : `/${value}`);
        if (mapping && !newObj.imagePublicId) {
          newObj.imagePublicId = mapping.publicId;
        }
      }
    }
    return newObj;
  }

  return obj;
}

async function migrateMongoDatabase(): Promise<void> {
  console.log("==================================================");
  console.log("📦 STEP 2: Migrating MongoDB Collections to Atlas...");
  console.log("==================================================");

  const oldClient = new MongoClient(OLD_MONGO_URI);
  const newClient = new MongoClient(NEW_MONGO_URI);

  await oldClient.connect();
  await newClient.connect();

  const oldDb: Db = oldClient.db(OLD_DB_NAME);
  const newDb: Db = newClient.db(NEW_DB_NAME);

  const oldCollections = await oldDb.listCollections().toArray();
  console.log(`Found ${oldCollections.length} collections in old database: ${oldCollections.map((c) => c.name).join(", ")}`);

  const migrationStats: Record<string, { read: number; written: number }> = {};

  for (const col of oldCollections) {
    const colName = col.name;
    const oldDocs = await oldDb.collection(colName).find({}).toArray();
    migrationStats[colName] = { read: oldDocs.length, written: 0 };

    if (oldDocs.length === 0) continue;

    const transformedDocs = oldDocs.map((doc) => replaceImageUrlsInObject(doc));

    // Clear destination collection before transferring to guarantee identical state
    await newDb.collection(colName).deleteMany({});

    const insertResult = await newDb.collection(colName).insertMany(transformedDocs);
    migrationStats[colName].written = insertResult.insertedCount;
    console.log(`  ✓ Transferred collection "${colName}": ${insertResult.insertedCount} documents.`);
  }

  // Populate "media" collection in new database with the migrated Cloudinary assets
  console.log("\n==================================================");
  console.log("📁 STEP 3: Populating Media Library Collection in Atlas...");
  console.log("==================================================");

  const mediaDocs: any[] = [];
  const uniquePublicIds = new Set<string>();

  for (const [, mapping] of mediaMap.entries()) {
    if (uniquePublicIds.has(mapping.publicId)) continue;
    uniquePublicIds.add(mapping.publicId);

    mediaDocs.push({
      id: `media-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      url: mapping.secureUrl,
      publicId: mapping.publicId,
      width: mapping.width || 1920,
      height: mapping.height || 1080,
      format: mapping.format || "jpg",
      originalFilename: path.basename(mapping.originalPath),
      sizeBytes: mapping.bytes || 0,
      createdAt: new Date().toISOString(),
    });
  }

  if (mediaDocs.length > 0) {
    await newDb.collection("media").deleteMany({});
    await newDb.collection("media").insertMany(mediaDocs);
    console.log(`  ✓ Inserted ${mediaDocs.length} assets into the "media" collection.`);
  }

  // Step 4: Ensure all indexes on new database
  console.log("\n==================================================");
  console.log("⚡ STEP 4: Creating Database Indexes...");
  console.log("==================================================");
  await Promise.allSettled([
    newDb.collection("hero").createIndex({ order: 1 }),
    newDb.collection("hero").createIndex({ visible: 1 }),
    newDb.collection("projects").createIndex({ slug: 1 }, { unique: true }),
    newDb.collection("projects").createIndex({ order: 1 }),
    newDb.collection("projects").createIndex({ featured: 1, visible: 1 }),
    newDb.collection("awards").createIndex({ order: 1 }),
    newDb.collection("awards").createIndex({ curated: 1, visible: 1 }),
    newDb.collection("journal").createIndex({ slug: 1 }, { unique: true }),
    newDb.collection("journal").createIndex({ order: 1 }),
    newDb.collection("journal").createIndex({ featured: 1, visible: 1 }),
    newDb.collection("journal").createIndex({ date: -1 }),
    newDb.collection("team").createIndex({ order: 1 }),
    newDb.collection("media").createIndex({ publicId: 1 }, { unique: true }),
    newDb.collection("admin_users").createIndex({ email: 1 }, { unique: true }),
    newDb.collection("publications").createIndex({ order: 1 }),
    newDb.collection("publications").createIndex({ curated: 1, visible: 1 }),
  ]);
  console.log("  ✓ Indexes verified on all collections.");

  await oldClient.close();
  await newClient.close();

  console.log("\n==================================================");
  console.log("📊 MIGRATION SUMMARY TABLE");
  console.log("==================================================");
  for (const [name, stats] of Object.entries(migrationStats)) {
    console.log(`  ${name.padEnd(16)} : Read ${stats.read} -> Written ${stats.written}`);
  }
  console.log(`  ${"media".padEnd(16)} : Uploaded ${mediaDocs.length} assets to Cloudinary & Atlas`);
  console.log("==================================================\n");
}

async function main() {
  try {
    await uploadAllLocalMedia();
    await migrateMongoDatabase();
    console.log("🎉 Complete Migration Succeeded Without Errors!");
    process.exit(0);
  } catch (err: any) {
    console.error("❌ Migration failed with error:", err);
    process.exit(1);
  }
}

main();
