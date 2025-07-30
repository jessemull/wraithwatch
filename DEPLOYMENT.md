# Wraithwatch Deployment Guide

## 🚀 Frontend Deployment (S3 + CloudFront)

### Prerequisites

- AWS CLI configured with appropriate permissions
- Domain name (optional, but recommended)

### Step 1: Deploy Infrastructure

1. **Deploy CloudFormation Stack**

   ```bash
   aws cloudformation deploy \
     --template-file infrastructure/wraithwatch-frontend-stack.yaml \
     --stack-name wraithwatch-frontend \
     --capabilities CAPABILITY_IAM \
     --parameter-overrides DomainName=wraithwatch.yourdomain.com
   ```

2. **For Custom Domain (Optional)**
   - Register your domain in Route 53
   - Request SSL certificate in ACM (us-east-1 region)
   - Update the stack with certificate ARN:
   ```bash
   aws cloudformation deploy \
     --template-file infrastructure/wraithwatch-frontend-stack.yaml \
     --stack-name wraithwatch-frontend \
     --capabilities CAPABILITY_IAM \
     --parameter-overrides \
       DomainName=wraithwatch.yourdomain.com \
       CertificateArn=arn:aws:acm:us-east-1:123456789012:certificate/your-cert-id
   ```

### Step 2: Deploy Frontend

**Option A: Manual Deployment**

```bash
# Build the frontend
cd apps/frontend
npm run build

# Deploy using the script
../scripts/deploy-frontend.sh
```

**Option B: GitHub Actions (Recommended)**

1. Add AWS credentials to GitHub Secrets:
   - `AWS_ACCESS_KEY_ID`
   - `AWS_SECRET_ACCESS_KEY`
2. Push to main branch - deployment happens automatically

### Step 3: Verify Deployment

1. **Check CloudFormation Outputs**

   ```bash
   aws cloudformation describe-stacks \
     --stack-name wraithwatch-frontend \
     --query 'Stacks[0].Outputs'
   ```

2. **Test Website URL**
   - Visit the URL from CloudFormation outputs
   - Should show the Wraithwatch dashboard

### Step 4: Update WebSocket URL

Once deployed, update the frontend to use your WebSocket server URL:

```typescript
// In apps/frontend/src/app/page.tsx
const { entities, isConnected, lastUpdate } = useWebSocket(
  'wss://your-websocket-domain.com'
);
```

## 🔧 Local Development

### Start Both Services

```bash
# Terminal 1: WebSocket Server
cd apps/realtime-api && npm run dev

# Terminal 2: Frontend
cd apps/frontend && npm run dev
```

### Test with Tunnel

```bash
# Terminal 3: Tunnel WebSocket server
npx ngrok http 3001

# Update frontend WebSocket URL to ngrok URL
```

## 📊 Monitoring

- **CloudFront Metrics**: View in AWS Console
- **S3 Access Logs**: Enable in bucket settings
- **GitHub Actions**: Check deployment status

## 🛠 Troubleshooting

### Build Issues

- Ensure Node.js 18+ is installed
- Clear npm cache: `npm cache clean --force`
- Delete node_modules and reinstall

### Deployment Issues

- Check AWS credentials and permissions
- Verify CloudFormation stack exists
- Check S3 bucket permissions

### WebSocket Issues

- Ensure WebSocket server is running
- Check CORS settings
- Verify WebSocket URL in frontend

## 🎯 Next Steps

1. **Backend Deployment**: Deploy WebSocket server to ECS
2. **Domain Setup**: Configure custom domain and SSL
3. **Monitoring**: Add CloudWatch alarms and logging
4. **CI/CD**: Enhance GitHub Actions workflow
