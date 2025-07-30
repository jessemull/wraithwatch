#!/bin/bash

# Deploy script for Wraithwatch frontend
set -e

echo "🚀 Starting frontend deployment..."

# Build the frontend
echo "📦 Building Next.js app..."
cd apps/frontend
npm run build

# Check if build was successful
if [ ! -d "out" ]; then
    echo "❌ Build failed - 'out' directory not found"
    exit 1
fi

echo "✅ Build completed successfully"

# Get the S3 bucket name from CloudFormation outputs
echo "🔍 Getting S3 bucket name..."
BUCKET_NAME=$(aws cloudformation describe-stacks \
    --stack-name wraithwatch-frontend \
    --query 'Stacks[0].Outputs[?OutputKey==`WebsiteBucketName`].OutputValue' \
    --output text)

if [ "$BUCKET_NAME" == "None" ] || [ -z "$BUCKET_NAME" ]; then
    echo "❌ Could not find S3 bucket. Make sure the CloudFormation stack is deployed."
    exit 1
fi

echo "📦 Uploading to S3 bucket: $BUCKET_NAME"

# Sync the build output to S3
aws s3 sync out/ s3://$BUCKET_NAME/ --delete

echo "✅ Frontend deployed successfully!"
echo "🌐 Website URL: https://$BUCKET_NAME.s3-website-$(aws configure get region).amazonaws.com"

# If CloudFront distribution exists, invalidate cache
DISTRIBUTION_ID=$(aws cloudformation describe-stacks \
    --stack-name wraithwatch-frontend \
    --query 'Stacks[0].Outputs[?OutputKey==`CloudFrontDistributionId`].OutputValue' \
    --output text)

if [ "$DISTRIBUTION_ID" != "None" ] && [ ! -z "$DISTRIBUTION_ID" ]; then
    echo "🔄 Invalidating CloudFront cache..."
    aws cloudfront create-invalidation \
        --distribution-id $DISTRIBUTION_ID \
        --paths "/*"
    echo "✅ Cache invalidation initiated"
fi 