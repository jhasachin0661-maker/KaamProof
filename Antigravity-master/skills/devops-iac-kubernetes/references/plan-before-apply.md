# Plan-Before-Apply Safety Protocol

## Mandatory Safety Gate

Before executing any infrastructure change (terraform apply, helm upgrade, kubectl apply), generate and present the plan output to the human user for review.

## Protocol Steps

1. **Generate Plan / Dry-Run**:
   ```bash
   terraform plan -out=tfplan
   # or
   helm upgrade --install my-app ./charts --dry-run
   ```

2. **Present to Human**: Display the plan diff output and pause with:
   > "This plan will make the following changes. Please review the diff and confirm to proceed."

3. **Await Explicit Approval**: Record approval in `.agent/context/project-context.json` approvals block before proceeding.

4. **Destroy Safety**:
   - `terraform destroy` plans must show exact list of resources targeted and blast radius.
   - Never run destroy without a confirmed rollback/restoration strategy documented.
