import { BatchGetCommand } from "@aws-sdk/lib-dynamodb";
import { client } from "../utils/dynamoClient";
import { validateTableName, validateKey, Key } from "../utils/validations";


export const batchGet = async (
  tableName: string,
  keys: Key[]
): Promise<any[]> => {
  validateTableName(tableName);
  keys.forEach((key) => validateKey(key));

  const params = {
    RequestItems: {
      [tableName]: {
        Keys: keys,
      },
    },
  };

  const command = new BatchGetCommand(params);
  const result = await client.send(command);
  return result.Responses?.[tableName] || [];
};
