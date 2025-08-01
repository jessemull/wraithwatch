import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import {
  DynamoDBDocumentClient,
  ScanCommand,
  BatchWriteCommand,
} from '@aws-sdk/lib-dynamodb';

const client = new DynamoDBClient({ region: 'us-east-1' });
const docClient = DynamoDBDocumentClient.from(client);

const TABLE_NAME =
  process.env.DYNAMODB_TABLE_NAME || 'wraithwatch-entity-changes';

interface EntityChange {
  PK: string;
  SK: string;
  entity_id: string;
  entity_type: string;
  property_name: string;
  value: string | number;
  previous_value?: string | number;
  change_type: 'increase' | 'decrease' | 'change';
  timestamp: string;
  TTL: number;
}

async function scanAllItems(): Promise<EntityChange[]> {
  const items: EntityChange[] = [];
  let lastEvaluatedKey: Record<string, string | number> | undefined;

  do {
    const scanCommand = new ScanCommand({
      TableName: TABLE_NAME,
      ExclusiveStartKey: lastEvaluatedKey,
      Limit: 1000, // Process in batches
    });

    const response = await docClient.send(scanCommand);

    if (response.Items) {
      items.push(...(response.Items as EntityChange[]));
    }

    lastEvaluatedKey = response.LastEvaluatedKey;
  } while (lastEvaluatedKey);

  return items;
}

async function deleteItems(items: EntityChange[]): Promise<void> {
  console.log(`Deleting ${items.length} items from DynamoDB...`);

  // Process in batches of 25 (DynamoDB batch delete limit)...

  const batchSize = 25;

  for (let i = 0; i < items.length; i += batchSize) {
    const batch = items.slice(i, i + batchSize);

    const deleteRequests = batch.map(item => ({
      DeleteRequest: {
        Key: {
          PK: item.PK,
          SK: item.SK,
        },
      },
    }));

    const batchWriteCommand = new BatchWriteCommand({
      RequestItems: {
        [TABLE_NAME]: deleteRequests,
      },
    });

    try {
      await docClient.send(batchWriteCommand);
      console.log(
        `Deleted batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(items.length / batchSize)}`
      );
    } catch (error) {
      console.error('Error deleting batch:', error);
      throw error;
    }
  }
}

async function main() {
  try {
    console.log('Starting deletion of time series data...');
    console.log(`Target table: ${TABLE_NAME}`);

    // Scan all items...

    console.log('Scanning table for items to delete...');
    const items = await scanAllItems();

    if (items.length === 0) {
      console.log('No items found to delete.');
      return;
    }

    console.log(`Found ${items.length} items to delete.`);

    // Confirm deletion (optional - can be made non-interactive)...

    if (process.env.NODE_ENV !== 'production') {
      const readline = await import('readline');
      const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
      });

      const answer = await new Promise<string>(resolve => {
        rl.question(
          `Are you sure you want to delete ${items.length} items? (yes/no): `,
          resolve
        );
      });

      rl.close();

      if (answer.toLowerCase() !== 'yes') {
        console.log('Deletion cancelled.');
        return;
      }
    }

    // Delete items...

    await deleteItems(items);

    console.log('Successfully deleted all time series data.');
  } catch (error) {
    console.error('Error deleting time series data:', error);
    process.exit(1);
  }
}

// ES module equivalent of require.main === module
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}
// test comment
// test comment
// test
const unusedVariable = 'this will cause a linting error';
