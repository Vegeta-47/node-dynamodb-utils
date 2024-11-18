// Exporting operations
export { getItem } from "./operations/getItem";
export { getItemWithCache } from "./operations/getItemWithCache";
export { batchGet } from "./operations/batchGet";
export { putItem } from "./operations/putItem";
export { updateItem } from "./operations/updateItem";
export { batchUpdate } from "./operations/batchUpdate";
export { deleteItem } from "./operations/deleteItem";
export { batchDelete } from "./operations/batchDelete";
export { scanTable } from "./operations/scanTable";
export { queryTable } from "./operations/queryTable";
export { transactWrite } from "./operations/transactWrite";
export { transactGet } from "./operations/transactGet";
export { listTables, describeTable, createTable, deleteTable } from "./operations/tableManagement";

// Exporting utilities
export { QueryBuilder } from "./utils/queryBuilder";
export { client } from "./utils/dynamoClient";
