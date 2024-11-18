import { GetCommand } from "@aws-sdk/lib-dynamodb";
import { client } from "../utils/dynamoClient";
import { validateTableName, validateKey, validateProjection, Key, Projection } from "../utils/validations";

export const getItem = async (
  tableName: string,
  key: Key,
  projection?: Projection
): Promise<any> => {
  validateTableName(tableName);
  validateKey(key);
  validateProjection(projection);

  const params = {
    TableName: tableName,
    Key: key,
    ProjectionExpression: projection?.join(", "),
  };

  const command = new GetCommand(params);
  const result = await client.send(command);
  return result.Item || null;
};
