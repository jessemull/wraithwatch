#!/bin/bash

# Domain setup script for wraithwatch-demo.com
set -e

DOMAIN="wraithwatch-demo.com"
WWW_DOMAIN="www.wraithwatch-demo.com"
REGION="us-east-1"

echo "🌐 Setting up domain: $DOMAIN"

# Step 1: Create hosted zone
echo "📝 Creating Route 53 hosted zone..."
HOSTED_ZONE_ID=$(aws route53 create-hosted-zone \
  --name $DOMAIN \
  --caller-reference $(date +%s) \
  --query 'HostedZone.Id' \
  --output text | sed 's/\/hostedzone\///')

echo "✅ Hosted zone created: $HOSTED_ZONE_ID"

# Get nameservers
echo "📋 Getting nameservers..."
NAMESERVERS=$(aws route53 get-hosted-zone \
  --id $HOSTED_ZONE_ID \
  --query 'DelegationSet.NameServers' \
  --output text)

echo "🔧 Update your GoDaddy nameservers to:"
echo "$NAMESERVERS"
echo ""
echo "These are the actual AWS nameservers for your hosted zone."
echo ""
echo "1. Log into GoDaddy"
echo "2. Go to Domain Management"
echo "3. Select $DOMAIN"
echo "4. Click 'Manage'"
echo "5. Go to 'Nameservers' section"
echo "6. Select 'I'll use my own nameservers'"
echo "7. Replace with the nameservers above"
echo "8. Save changes"
echo ""

# Step 2: Request SSL certificate (includes both apex and www)
echo "🔒 Requesting SSL certificate..."
CERT_ARN=$(aws acm request-certificate \
  --domain-name $DOMAIN \
  --subject-alternative-names $WWW_DOMAIN \
  --validation-method DNS \
  --region $REGION \
  --query 'CertificateArn' \
  --output text)

echo "✅ Certificate requested: $CERT_ARN"

# Step 3: Get validation records
echo "📝 Getting validation records..."
VALIDATION_RECORDS=$(aws acm describe-certificate \
  --certificate-arn $CERT_ARN \
  --region $REGION \
  --query 'Certificate.DomainValidationOptions[0].ResourceRecord')

echo "🔧 Add these DNS records to Route 53 for validation:"
echo "$VALIDATION_RECORDS"
echo ""

echo "⏳ Wait 5-30 minutes for certificate validation..."
echo "Then run:"
echo "aws cloudformation deploy \\"
echo "  --template-file infrastructure/frontend-stack.yaml \\"
echo "  --stack-name wraithwatch-frontend \\"
echo "  --capabilities CAPABILITY_IAM \\"
echo "  --parameter-overrides \\"
echo "    DomainName=$WWW_DOMAIN \\"
echo "    CertificateArn=$CERT_ARN" 