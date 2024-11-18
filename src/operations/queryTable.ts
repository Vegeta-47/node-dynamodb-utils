import { QueryCommand } from "@aws-sdk/lib-dynamodb";
import { client } from "../utils/dynamoClient";

export const queryTable = async (params: any): Promise<any> => {
  const command = new QueryCommand(params);
  const result = await client.send(command);
  return result.Items || [];
};
