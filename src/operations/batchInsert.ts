import { BatchWriteCommand, BatchWriteCommandInput } from "@aws-sdk/lib-dynamodb";
import { client } from "../utils/dynamoClient";
import { validateTableName, validateItems } from "../utils/validations";

export const batchInsert = async (
  tableName: string,
  items: Record<string, any>[]
): Promise<{ unprocessedItems: Record<string, any>[] }> => {
  // Validate inputs
  validateTableName(tableName);
  validateItems(items);

  const BATCH_SIZE = 25; // DynamoDB limit for batch write requests
  let unprocessedItems: Record<string, any>[] = [];

  // Split items into batches of 25
  const batches = [];
  for (let i = 0; i < items.length; i += BATCH_SIZE) {
    const batch = items.slice(i, i + BATCH_SIZE).map((item) => ({
      PutRequest: { Item: item },
    }));
    batches.push({ RequestItems: { [tableName]: batch } });
  }

  // Process each batch and handle retries for unprocessed items
  for (const batch of batches) {
    let retryBatch: BatchWriteCommandInput = batch;

    do {
      const command = new BatchWriteCommand(retryBatch);
      const result = await client.send(command);

      // Add unprocessed items to the retry batch
      retryBatch = {
        RequestItems: result.UnprocessedItems,
      };

      if (retryBatch.RequestItems && Object.keys(retryBatch.RequestItems).length > 0) {
        const unprocessed = retryBatch.RequestItems[tableName] || [];
        unprocessedItems = unprocessedItems.concat(
          unprocessed
            .filter((request) => request.PutRequest) // Type guard to check existence
            .map((request) => request.PutRequest!.Item) // Use non-null assertion after the guard
        );
      }
    } while (
      retryBatch.RequestItems &&
      Object.keys(retryBatch.RequestItems).length > 0
    );
  }

  return { unprocessedItems };
};
