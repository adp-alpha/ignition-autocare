# Prisma Setup Guide

## Overview
This application uses Prisma as the ORM for database management. The setup replaces the JSON file-based storage (`adminData.json`) with a PostgreSQL database for production use, with robust Zod validation to prevent corrupted data.

## Installation
Prisma has been installed with the following packages:
- `prisma` - Prisma CLI for migrations and schema management
- `@prisma/client` - Prisma Client for database queries
- `zod` - Schema validation library (already installed)

## Architecture

### Database Layer
- **Prisma Schema** (`prisma/schema.prisma`) - Defines the database structure
- **Prisma Client** (`lib/prisma.ts`) - Singleton instance for database access
- **Database Functions** (`lib/db/admin-data.ts`) - Helper functions for CRUD operations

### Validation Layer
- **Zod Schemas** (`lib/validations/admin-data.ts`) - Comprehensive validation schemas
- All data is validated before saving to prevent corruption
- Detailed error messages for debugging

### API Layer
- **API Route** (`app/api/admin-data/route.ts`) - REST endpoints with validation
- Handles both database and JSON file operations
- Returns detailed validation errors on failure

## Configuration

### 1. Environment Variables
Update your `.env` file with your PostgreSQL connection string:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/database_name?schema=public"
```

**Note:** The `.env` file is already in `.gitignore` and will not be committed to version control.

### 2. Database Setup

After updating the DATABASE_URL, run the following commands:

```bash
# Create the database schema
npx prisma migrate dev --name init

# Seed the database with existing JSON data
npm run db:seed
```

## Usage

### Importing Prisma Client
```typescript
import { prisma } from '@/lib/prisma'

// Example query
const adminData = await prisma.adminData.findFirst()
```

### Using Helper Functions
```typescript
import { getAdminData, upsertAdminData } from '@/lib/db/admin-data'

// Get data (with fallback to JSON file)
const data = await getAdminData()

// Update data (with Zod validation)
await upsertAdminData(validatedData)
```

### Validation
All data is validated using Zod schemas before saving:

```typescript
import { adminDataSchema } from '@/lib/validations/admin-data'

// Validate data
const validatedData = adminDataSchema.parse(rawData)
// Throws ZodError if validation fails
```

## API Endpoints

### GET /api/admin-data
- Returns admin data from database (falls back to JSON file if empty)
- No authentication required (add if needed)

### POST /api/admin-data
- Saves admin data with validation
- Updates both database and JSON file (for backup)
- Returns detailed validation errors if data is invalid

**Example Error Response:**
```json
{
  "error": "Validation failed",
  "details": [
    {
      "code": "invalid_type",
      "expected": "number",
      "received": "string",
      "path": ["defaultLeadTime"],
      "message": "Expected number, received string"
    }
  ]
}
```

## Migration from JSON to Database

The system supports a hybrid approach during migration:

1. **Development:** JSON file is used as fallback
2. **Production:** Database is the primary source
3. **Seed Script:** Migrates JSON data to database

### Seed Database
```bash
npm run db:seed
```

This will:
- Read data from `data/adminData.json`
- Validate it using Zod schemas
- Insert/update data in the database

## Common Commands

```bash
# Generate Prisma Client (after schema changes)
npx prisma generate

# Create and apply migrations
npx prisma migrate dev --name your_migration_name

# Seed database from JSON file
npm run db:seed

# Open Prisma Studio (database GUI)
npx prisma studio

# Format schema file
npx prisma format

# Reset database (WARNING: deletes all data)
npx prisma migrate reset
```

## Validation Features

### Robust Data Validation
- ✅ All numeric fields validated as non-negative
- ✅ Required string fields checked for minimum length
- ✅ Complex nested objects validated recursively
- ✅ Array items validated individually
- ✅ Type safety enforced at runtime

### Error Handling
- Detailed validation errors with field paths
- Type-safe error responses
- Prevents corrupted data from entering database

## File Structure
```
my-garage-app/
├── prisma/
│   ├── schema.prisma          # Prisma schema definition
│   └── seed.ts                # Database seed script
├── lib/
│   ├── prisma.ts              # Prisma Client singleton
│   ├── db/
│   │   └── admin-data.ts      # Database helper functions
│   └── validations/
│       └── admin-data.ts      # Zod validation schemas
├── app/api/admin-data/
│   └── route.ts               # API endpoints with validation
├── data/
│   └── adminData.json         # JSON backup (dev/fallback)
├── .env                       # Environment variables (not committed)
└── node_modules/
    └── @prisma/client/        # Generated Prisma Client
```

## Production Deployment

1. Ensure `DATABASE_URL` is set in production environment
2. Run migrations: `npx prisma migrate deploy`
3. Seed database (if needed): `npm run db:seed`
4. The JSON file won't be pushed to production (add to `.gitignore` if needed)

## Troubleshooting

### "Prisma Client not generated"
```bash
npx prisma generate
```

### "Database doesn't exist"
```bash
npx prisma migrate dev --name init
```

### "Validation errors"
Check the API response for detailed error messages with field paths

### "Connection timeout"
- Verify DATABASE_URL is correct
- Check database server is running
- Verify network access to database
