import { TransactGetCommand } from "@aws-sdk/lib-dynamodb";
import { client } from "../utils/dynamoClient";

export const transactGet = async (params: any): Promise<any> => {
  const command = new TransactGetCommand(params);
  const result = await client.send(command);
  return result.Responses || [];
};
