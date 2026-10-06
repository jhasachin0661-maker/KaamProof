# Safe Migrations & Expand/Contract Pattern

## Safe Migration Rules
1. **Never Drop Columns/Tables Directly**: In active production, splitting a column or renaming a field directly causes application downtime during rolling deployments.
2. **Expand/Contract Pattern**:
   - **Phase 1 (Expand)**: Add new column as optional or nullable.
   - **Phase 2 (Migrate)**: Dual-write data to both old and new columns in application code. Backfill existing records.
   - **Phase 3 (Contract)**: Update read paths to use new column. Remove old column in a subsequent release.
3. **Rollback Script Requirement**: Every migration script must be paired with an executable rollback SQL script.
