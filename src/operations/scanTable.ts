import { ScanCommand, ScanCommandInput } from "@aws-sdk/lib-dynamodb";
import { client } from "../utils/dynamoClient";
import { buildFilterExpression } from "../utils/validations";

// export const scanTable = async (
//   tableName: string,
//   filter?: Record<string, any>,
//   projection?: string[],
//   limit?: number
// ): Promise<any[]> => {
//   const params: Record<string, any> = { TableName: tableName };
//   if (filter) {
//     const { expression, attributeNames, attributeValues } = buildFilterExpression(filter);
//     params.FilterExpression = expression;
//     params.ExpressionAttributeNames = attributeNames;
//     params.ExpressionAttributeValues = attributeValues;
//   }
//   if (projection) {
//     params.ProjectionExpression = projection.join(", ");
//   }
//   if (limit) {
//     params.Limit = limit;
//   }
//   const command = new ScanCommand(params);
//   const result = await client.send(command);
//   return result.Items || [];
// };


// import { ScanCommand, ScanCommandInput } from "@aws-sdk/lib-dynamodb";
// import { client } from "../utils/dynamoClient";

export const scanTable = async (
  tableName: string,
  filter?: Record<string, any>,
  projection?: string[],
  limit?: number
): Promise<any[]> => {
  const params: ScanCommandInput = {
    TableName: tableName,
  };

  if (filter) {
    const { expression, attributeNames, attributeValues } = buildFilterExpression(filter);
    params.FilterExpression = expression;
    params.ExpressionAttributeNames = attributeNames;
    params.ExpressionAttributeValues = attributeValues;
  }
  if (projection) {
    params.ProjectionExpression = projection.join(", ");
  }
  if (limit) {
    params.Limit = limit;
  }

  const command = new ScanCommand(params);
  const result = await client.send(command);
  return result.Items || [];
};