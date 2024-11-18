import { PutCommand, PutCommandInput } from "@aws-sdk/lib-dynamodb";
import { client } from "../utils/dynamoClient";
import { validateTableName, validateItem } from "../utils/validations";

export const putItem = async (
  tableName: string,
  item: Record<string, any>
): Promise<void> => {
  // Validate inputs
  validateTableName(tableName);
  validateItem(item);

  // Create the PutCommand input
  const params: PutCommandInput = {
    TableName: tableName,
    Item: item,
  };

  // Execute the command
  const command = new PutCommand(params);
  await client.send(command);
};
