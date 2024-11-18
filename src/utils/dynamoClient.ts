import { DynamoDB } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

const dynamoDB = new DynamoDB({});
export const client = DynamoDBDocumentClient.from(dynamoDB);
