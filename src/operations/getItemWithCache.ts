import fs from "fs/promises";
import path from "path";
import { GetCommand } from "@aws-sdk/lib-dynamodb";
import { client } from "../utils/dynamoClient";
import {
  validateTableName,
  validateKey,
  validateProjection,
  Key,
  Projection,
} from "../utils/validations";

const CACHE_DIR = "/tmp/dynamodb-cache";

const ensureCacheDir = async () => {
  try {
    await fs.mkdir(CACHE_DIR, { recursive: true });
  } catch {
    // Ignore if already exists
  }
};

const getCache = async (cacheKey: string): Promise<any | null> => {
  try {
    const cachePath = path.join(CACHE_DIR, cacheKey);
    const cacheContent = JSON.parse(await fs.readFile(cachePath, "utf-8"));
    if (cacheContent.ttl > Date.now()) {
      return cacheContent.data;
    }
    await fs.unlink(cachePath);
  } catch {
    // Ignore errors
  }
  return null;
};

const setCache = async (cacheKey: string, data: any, ttl: number) => {
  const cachePath = path.join(CACHE_DIR, cacheKey);
  const cacheContent = {
    data,
    ttl: Date.now() + ttl * 60 * 1000,
  };
  await fs.writeFile(cachePath, JSON.stringify(cacheContent, null, 2));
};

export const getItemWithCache = async (
  tableName: string,
  key: Key,
  projection?: Projection,
  ttl: number = 60
): Promise<any> => {
  validateTableName(tableName);
  validateKey(key);
  validateProjection(projection);

  await ensureCacheDir();

  const cacheKey = `${tableName}-${Object.entries(key)
    .map(([k, v]) => `${k}_${v}`)
    .join("-")}`;

  const cachedData = await getCache(cacheKey);
  if (cachedData) return cachedData;

  const params = {
    TableName: tableName,
    Key: key,
    ProjectionExpression: projection?.join(", "),
  };

  const command = new GetCommand(params);
  const result = await client.send(command);

  if (result.Item) {
    await setCache(cacheKey, result.Item, ttl);
  }

  return result.Item || null;
};
