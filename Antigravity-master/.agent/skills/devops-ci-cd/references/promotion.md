# Environment Promotion Pipelines

## Strategy: Build Once, Deploy Many
Build artifacts (Docker images, static assets) in the CI phase, tag with git SHA, and deploy the identical artifact across environments.

## Environment Protection Rules
```yaml
jobs:
  deploy-staging:
    runs-on: ubuntu-latest
    environment: staging
    steps:
      - name: Deploy to Staging
        run: ./scripts/deploy.sh staging

  deploy-production:
    needs: deploy-staging
    runs-on: ubuntu-latest
    environment:
      name: production
      url: https://myapp.com
    steps:
      - name: Deploy to Production
        run: ./scripts/deploy.sh production
```

## Concurrency Control
Prevent race conditions during parallel deploys:

```yaml
concurrency:
  group: deploy-${{ github.ref }}
  cancel-in-progress: true
```
