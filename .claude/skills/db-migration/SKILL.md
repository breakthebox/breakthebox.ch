---
name: db-migration
description: Safely create and apply an ORM migration following the mandatory 3-step workflow. Prevents accidental schema drift.
disable-model-invocation: true
---

# Database Migration Workflow

This skill guides you through the mandatory 3-step migration workflow.

## CRITICAL RULES
- **NEVER** create SQL files manually in the migrations directory — they won't have journal entries and will be silently ignored
- **NEVER** use `db:push` — it bypasses migration tracking
- **NEVER** run DDL (ALTER TYPE, CREATE TABLE, etc.) directly on the database

## Workflow

### Step 1: Verify Schema Changes
Check that the schema file has been modified with the desired changes:
```bash
git diff src/lib/server/db/schema.ts
```
If no changes exist, inform the user they need to modify the schema first.

### Step 2: Generate Migration
```bash
npm run db:generate
```
After generation, verify:
1. A new SQL file was created
2. The journal/metadata was updated

### Step 3: Apply Migration
```bash
npm run db:migrate
```
Verify success. If "No migrations to apply", the journal entry may be missing.

### Step 4: Verify
```bash
npm run check
```

## Common Scenarios

### Adding an enum value
1. Add value to the enum definition in schema file
2. `npm run db:generate`
3. `npm run db:migrate`

### Adding a new table
1. Define table in schema file
2. `npm run db:generate`
3. `npm run db:migrate`

### Adding a column
1. Add column to existing table definition
2. `npm run db:generate`
3. `npm run db:migrate`
