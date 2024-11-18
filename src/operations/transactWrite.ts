import { TransactWriteCommand } from "@aws-sdk/lib-dynamodb";
import { client } from "../utils/dynamoClient";

export const transactWrite = async (params: any): Promise<any> => {
  const command = new TransactWriteCommand(params);
  return await client.send(command);
};
