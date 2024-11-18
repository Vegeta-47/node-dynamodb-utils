import fs from "fs/promises";
import path from "path";
import { GetCommand, GetCommandInput } from "@aws-sdk/lib-dynamodb";
import { client } from "../utils/dynamoClient";
import { validateTableName, validateKey } from "../utils/validations";

const CACHE_DIR = "/tmp/dynamodb-cache";

const ensureCacheDir = async (): Promise<void> => {
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

const setCache = async (cacheKey: string, data: any, ttl: number): Promise<void> => {
  const cachePath = path.join(CACHE_DIR, cacheKey);
  const cacheContent = {
    data,
    ttl: Date.now() + ttl * 60 * 1000,
  };
  await fs.writeFile(cachePath, JSON.stringify(cacheContent, null, 2));
};

export const getItemWithCache = async (
  tableName: string,
  key: Record<string, any>,
  projection: string[] = [],
  ttl: number = 60
): Promise<any | null> => {
  validateTableName(tableName);
  validateKey(key);

  await ensureCacheDir();

  const cacheKey = `${tableName}-${Object.entries(key)
    .map(([k, v]) => `${k}_${v}`)
    .join("-")}`;

  const cachedData = await getCache(cacheKey);
  if (cachedData) return cachedData;

  // Use ExpressionAttributeNames for reserved keywords
  const expressionAttributeNames: Record<string, string> = {};
  projection.forEach((attr) => {
    expressionAttributeNames[`#${attr}`] = attr;
  });

  const params: GetCommandInput = {
    TableName: tableName,
    Key: key,
    ProjectionExpression: projection.map((attr) => `#${attr}`).join(", "),
    ExpressionAttributeNames:
      Object.keys(expressionAttributeNames).length > 0 ? expressionAttributeNames : undefined,
  };

  const command = new GetCommand(params);
  const result = await client.send(command);

  if (result.Item) {
    await setCache(cacheKey, result.Item, ttl);
  }

  return result.Item || null;
};
