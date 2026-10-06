# Terraform IaC Patterns

## Module Structure
```
infra/
├── main.tf
├── variables.tf
├── outputs.tf
├── providers.tf
└── modules/
    ├── vpc/
    └── eks/
```

## Remote State Backend (S3)
```hcl
terraform {
  backend "s3" {
    bucket         = "my-terraform-state"
    key            = "prod/terraform.tfstate"
    region         = "us-east-1"
    encrypt        = true
    dynamodb_table = "terraform-lock"
  }
}
```

## Core Workflow
```bash
terraform init       # Initialize providers and backend
terraform validate   # Syntax/schema validation (exit 0 required)
terraform plan -out=tfplan  # Generate plan file
# --- HUMAN REVIEWS plan output ---
terraform apply tfplan  # CRITICAL: Apply only after approval
```
