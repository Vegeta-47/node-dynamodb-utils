import { updateItem } from "./updateItem";
import { Key } from "../utils/validations";

export const batchUpdate = async (
  tableName: string,
  updates: { key: Key; data: Record<string, any> }[]
): Promise<any[]> => {
  return Promise.all(
    updates.map(({ key, data }) => updateItem(tableName, key, data))
  );
};
