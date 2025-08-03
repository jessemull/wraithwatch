/* global process */

process.env.NODE_ENV = 'test';

// Prevent any real AWS connections during tests...

process.env.AWS_REGION = 'us-east-1';
process.env.DYNAMODB_TABLE_NAME = 'test-table';
