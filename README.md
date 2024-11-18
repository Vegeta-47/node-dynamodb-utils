# dynamoDBUtils

A lightweight, TypeScript-based utility package for simplifying DynamoDB operations using AWS SDK v3. This package provides essential DynamoDB functionalities, including caching, query building, and transactional operations, with input validation powered by Zod.

---

## **Features**
- **Basic CRUD Operations**:
  - `getItem`
  - `batchGet`
  - `updateItem`
  - `batchUpdate`
  - `deleteItem`
  - `batchDelete`
  - `insertItem`
  - `batchInsert`
- **Advanced Operations**:
  - `scanTable`
  - `queryTable`
  - `transactWrite`
  - `transactGet`
- **Table Management**:
  - `listTables`
  - `describeTable`
  - `createTable`
  - `deleteTable`
- **Caching**:
  - `getItemWithCache` for local ephemeral storage with TTL support.
- **Query Builder**:
  - Build dynamic and reusable query parameters for DynamoDB.

---

## **Installation**

Install the package via npm:

```bash
npm install dynamoDBUtils
```

---

## **Usage**

### **Setup**
Before using the package, ensure you have AWS credentials configured in your environment or `~/.aws/credentials`.

```typescript
import { getItem, updateItem, scanTable } from "dynamoDBUtils";
```

---

### **Basic Examples**

#### **Get an Item**
```typescript
import { getItem } from "dynamoDBUtils";

const result = await getItem("UsersTable", { userId: "123" });
console.log(result);
```

#### **Get an Item with Cache**
```typescript
import { getItemWithCache } from "dynamoDBUtils";

const result = await getItemWithCache("UsersTable", { userId: "123" }, ["name", "email"], 10); // Cache for 10 minutes
console.log(result);
```

#### **Update an Item**
```typescript
import { updateItem } from "dynamoDBUtils";

const result = await updateItem("UsersTable", { userId: "123" }, { name: "John Doe" });
console.log(result);
```

#### **Scan a Table**
```typescript
import { scanTable } from "dynamoDBUtils";

const result = await scanTable("UsersTable", { isActive: true });
console.log(result);
```

#### **Batch Get Items**
```typescript
import { batchGet } from "dynamoDBUtils";

const result = await batchGet("UsersTable", [{ userId: "123" }, { userId: "456" }]);
console.log(result);
```

---

### **Advanced Operations**

#### **Transactional Write**
```typescript
import { transactWrite } from "dynamoDBUtils";

const result = await transactWrite({
  TransactItems: [
    {
      Put: {
        TableName: "UsersTable",
        Item: { userId: "789", name: "Alice" },
      },
    },
    {
      Update: {
        TableName: "UsersTable",
        Key: { userId: "123" },
        UpdateExpression: "SET #name = :name",
        ExpressionAttributeNames: { "#name": "name" },
        ExpressionAttributeValues: { ":name": "John Updated" },
      },
    },
  ],
});
console.log(result);
```

#### **Query Table**
```typescript
import { queryTable } from "dynamoDBUtils";

const result = await queryTable({
  TableName: "UsersTable",
  KeyConditionExpression: "userId = :userId",
  ExpressionAttributeValues: { ":userId": "123" },
});
console.log(result);
```

---

### **Table Management**

#### **List Tables**
```typescript
import { listTables } from "dynamoDBUtils";

const tables = await listTables();
console.log(tables);
```

#### **Create a Table**
```typescript
import { createTable } from "dynamoDBUtils";

const result = await createTable({
  TableName: "NewTable",
  KeySchema: [
    { AttributeName: "id", KeyType: "HASH" },
  ],
  AttributeDefinitions: [
    { AttributeName: "id", AttributeType: "S" },
  ],
  ProvisionedThroughput: {
    ReadCapacityUnits: 5,
    WriteCapacityUnits: 5,
  },
});
console.log(result);
```

---

## **Query Builder**

Create reusable query objects dynamically with the `QueryBuilder` utility.

```typescript
import { QueryBuilder } from "dynamoDBUtils";

const query = new QueryBuilder("UsersTable")
  .addKeyCondition("userId", "=", "123")
  .addFilter("isActive", "=", true)
  .addProjection("name", "email")
  .setLimit(10)
  .build();

console.log(query);
```

---

## **Validation**

This package uses **Zod** to validate inputs. Incorrect inputs will throw validation errors, helping to prevent runtime issues.

---

## **Configuration**

### **Cache Directory**
For Lambda, cache is stored in `/tmp`. For other environments, ensure the process has write access to a directory for caching.

---

## **Contributing**
Feel free to submit issues and pull requests on GitHub to improve this package.

---

## **License**
This project is licensed under the MIT License.

---

## **Support**
If you encounter any issues, feel free to open a GitHub issue or reach out to the maintainers.
