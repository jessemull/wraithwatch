# WraithWatch Lambda@Edge

This Lambda@Edge function handles domain redirects and URL normalization for the WraithWatch frontend application.

## Features

- **Domain Redirect**: Redirects `wraithwatch-demo.com` to `www.wraithwatch-demo.com`
- **URL Normalization**: Adds `.html` extension to URLs without file extensions
- **Query String Preservation**: Maintains query parameters during redirects
- **Protocol Preservation**: Respects the original protocol (HTTP/HTTPS)

## Architecture

The Lambda@Edge function is deployed to CloudFront and runs at the edge locations, providing:

- **Low Latency**: Redirects happen at the edge, not origin
- **Global Distribution**: Works across all CloudFront edge locations
- **Cost Effective**: Minimal compute costs for redirect logic

## Deployment

### Prerequisites

1. AWS CLI configured with appropriate permissions
2. S3 bucket for Lambda deployment artifacts
3. CloudFormation stacks for IAM roles and S3 bucket

### Manual Deployment

```bash
cd apps/lambda-at-edge

# Install dependencies
npm install

# Build and package
npm run build
npm run package

# Deploy via GitHub Actions
# Use the "Deploy Lambda@Edge" workflow with environment selection
```

### CloudFormation Stacks

The deployment creates/updates these CloudFormation stacks:

1. **S3 Bucket Stack**: `wraithwatch-lambda-at-edge-s3.yaml`
   - Creates S3 bucket for Lambda deployment artifacts
   - Exports bucket name for other stacks

2. **IAM Role Stack**: `wraithwatch-lambda-at-edge-role.yaml`
   - Creates IAM role for Lambda execution
   - Grants permissions for S3 access and CloudWatch logs

3. **Lambda Function Stack**: `template.yaml`
   - Creates Lambda function with the handler code
   - Creates Lambda version for deployment tracking

## Testing

```bash
# Run unit tests
npm test

# Run tests with coverage
npm run test:coverage

# Open coverage report
npm run coverage:open
```

## Integration with CloudFront

To use this Lambda@Edge function with CloudFront:

1. Deploy the Lambda function
2. Associate the Lambda function with your CloudFront distribution
3. Configure it as a "Viewer Request" event
4. Update your CloudFront distribution

## Configuration

The function is configured via environment variables:

- `NODE_ENV`: Set to `dev` or `prod` for environment-specific behavior

## Monitoring

- **CloudWatch Logs**: Lambda execution logs are available in CloudWatch
- **CloudFront Logs**: Request/response logs can be enabled for debugging
- **Metrics**: CloudWatch metrics for Lambda execution and errors

## Security

- **IAM Roles**: Least privilege access to S3 and CloudWatch
- **No Secrets**: Function doesn't handle sensitive data
- **Edge Security**: Runs in AWS edge locations with security controls

## Troubleshooting

### Common Issues

1. **Redirect Loop**: Ensure CloudFront distribution is configured correctly
2. **404 Errors**: Check that S3 bucket contains the expected files
3. **Permission Errors**: Verify IAM role has necessary permissions

### Debugging

1. Check CloudWatch logs for Lambda execution errors
2. Enable CloudFront access logs for request analysis
3. Test redirects manually with curl or browser

## Development

### Local Development

```bash
# Install dependencies
npm install

# Run linting
npm run lint

# Run tests
npm test

# Build for deployment
npm run build
```

### Code Structure

```
apps/lambda-at-edge/
├── src/
│   ├── index.ts          # Main Lambda handler
│   └── index.test.ts     # Unit tests
├── cloudformation/        # CloudFormation templates
├── .github/workflows/     # GitHub Actions workflows
└── package.json          # Dependencies and scripts
```

## License

This project is part of the WraithWatch application suite. 