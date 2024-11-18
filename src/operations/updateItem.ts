import { UpdateCommand, UpdateCommandInput } from "@aws-sdk/lib-dynamodb";
import { client } from "../utils/dynamoClient";
import { validateTableName, validateKey, validateItem, Key } from "../utils/validations";

export const updateItem = async (
  tableName: string,
  key: Key,
  updates: Record<string, any>
): Promise<any> => {
  // Validate inputs
  validateTableName(tableName);
  validateKey(key);
  validateItem(updates);

  // Build the UpdateExpression
  const updateExpression = Object.keys(updates)
    .map((key) => `#${key} = :${key}`)
    .join(", ");

  const params: UpdateCommandInput = {
    TableName: tableName,
    Key: key,
    UpdateExpression: `SET ${updateExpression}`,
    ExpressionAttributeNames: Object.fromEntries(
      Object.keys(updates).map((key) => [`#${key}`, key])
    ),
    ExpressionAttributeValues: Object.fromEntries(
      Object.entries(updates).map(([key, value]) => [`:${key}`, value])
    ),
    ReturnValues: "ALL_NEW", // Use the string literal directly
  };

  // Execute the UpdateCommand
  const command = new UpdateCommand(params);
  const result = await client.send(command);
  return result.Attributes;
};
