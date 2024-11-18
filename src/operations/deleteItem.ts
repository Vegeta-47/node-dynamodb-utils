// import { DeleteCommand } from "@aws-sdk/lib-dynamodb";
import { DeleteCommand, DeleteCommandInput } from "@aws-sdk/lib-dynamodb";

import { client } from "../utils/dynamoClient";
import { validateTableName, validateKey, Key } from "../utils/validations";

export const deleteItem = async (tableName: string, key: Key): Promise<any> => {
  validateTableName(tableName);
  validateKey(key);

  const params: DeleteCommandInput = {
    TableName: tableName,
    Key: key,
    ReturnValues: "ALL_OLD",

  };

  // const params = {
  //   TableName: tableName,
  //   Key: key,
  //   ReturnValues: "ALL_OLD",
  // };

  const command = new DeleteCommand(params);
  const result = await client.send(command);
  return result.Attributes;
};
