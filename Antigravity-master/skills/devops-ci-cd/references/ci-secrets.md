# CI Secrets & OIDC Security

## 1. OIDC Federated Auth (Keyless Deployment)
Prefer AWS OIDC / GCP Workload Identity over storing long-lived IAM access keys:

```yaml
permissions:
  id-token: write
  contents: read

steps:
  - name: Configure AWS Credentials
    uses: aws-actions/configure-aws-credentials@e3dd7a392bf5911503796f34a05656c1b70d222c # v4.0.2
    with:
      role-to-assume: arn:aws:iam::123456789012:role/my-github-ci-role
      aws-region: us-east-1
```

## 2. Secrets Hygiene
- Access secrets via `${{ secrets.MY_SECRET }}` only in required steps.
- Never output secrets to log output or pass them in URL query parameters.
- Mask secrets if generated dynamically (`echo "::add-mask::$TOKEN"`).
