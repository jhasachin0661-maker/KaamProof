# AWS Deployment Guide

## Compute Topologies
- **ECS / Fargate**: Container deployment via ECS Task Definitions and Service updates (`aws ecs update-service`).
- **Lambda**: Serverless deployment via AWS SAM, Serverless Framework, or CDK (`aws lambda update-function-code`).
- **S3 + CloudFront**: Static website hosting with S3 sync and CloudFront distribution invalidation (`aws cloudfront create-invalidation`).
