import { BatchWriteCommand } from "@aws-sdk/lib-dynamodb";
import { client } from "../utils/dynamoClient";
import { Key } from "../utils/validations";


export const batchDelete = async (
  tableName: string,
  keys: Key[]
): Promise<void> => {
  const requests = keys.map((key) => ({ DeleteRequest: { Key: key } }));
  const params = { RequestItems: { [tableName]: requests } };

  await client.send(new BatchWriteCommand(params));
};
