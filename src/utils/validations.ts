import { z } from "zod";

export const tableNameSchema = z.string().min(1, "Table name is required.");
export const keySchema = z.record(z.string(), z.any());
export const itemSchema = z.record(z.string(), z.any());
export const projectionSchema = z.array(z.string()).optional();
export const filterSchema = z.record(z.string(), z.any()).optional();
export const limitSchema = z.number().int().positive().optional();

export type TableName = z.infer<typeof tableNameSchema>;
export type Key = Record<string, any>;
export type Item = z.infer<typeof itemSchema>;
export type Projection = z.infer<typeof projectionSchema>;
export type Filter = z.infer<typeof filterSchema>;
export type Limit = z.infer<typeof limitSchema>;

export const validateTableName = (tableName: TableName) => tableNameSchema.parse(tableName);
export const validateKey = (key: Key) => keySchema.parse(key);
export const validateItem = (item: Item) => itemSchema.parse(item);
export const validateProjection = (projection?: Projection) => projectionSchema.parse(projection);
export const validateFilter = (filter?: Filter) => filterSchema.parse(filter);
export const validateLimit = (limit?: Limit) => limitSchema.parse(limit);


export const buildFilterExpression = (filter: Record<string, any>) => {
  const keys = Object.keys(filter);
  const expression = keys.map((key) => `#${key} = :${key}`).join(" AND ");
  const attributeNames = Object.fromEntries(keys.map((key) => [`#${key}`, key]));
  const attributeValues = Object.fromEntries(
    keys.map((key) => [`:${key}`, filter[key]])
  );
  return { expression, attributeNames, attributeValues };
};
