# @crispy-streaming/supabase-contract

Shared Supabase database contract types and Zod validators for Crispy clients.

## Install

```bash
npm install @crispy-streaming/supabase-contract zod
```

`zod` is a peer dependency, so install it in the consuming app.

## Usage

```ts
import {
  parseMembershipPayload,
  profileNameSchema,
  type Database,
  type TableRow,
} from '@crispy-streaming/supabase-contract';

const name = profileNameSchema.parse('  Ada  ');

const membership = parseMembershipPayload({
  household_id: '7b32659c-04e4-4694-b03f-90a55338183d',
  role: 'owner',
});

type Profile = TableRow<'profiles'>;
type Db = Database;
```

## Exports

- Database helper types from `database.types.ts`
- Zod schemas and parser helpers from `validators.ts`

## Development

```bash
npm install
npm run build
npm pack --dry-run
```
