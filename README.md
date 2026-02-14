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

## Primary Profile

If you want a single "primary" profile per household, create this view in Supabase.

Rule: `order_index` asc, then `created_at` asc, then `id` asc; pick the first.

```sql
-- One row per household.
-- Requires Postgres 15+ for security_invoker.
create or replace view public.household_primary_profiles
with (security_invoker = true) as
select distinct on (p.household_id)
  p.*
from public.profiles p
order by p.household_id, p.order_index asc, p.created_at asc, p.id asc;

-- Optional but recommended for fast lookups.
create index if not exists profiles_household_primary_sort_idx
on public.profiles (household_id, order_index, created_at, id);
```

## Development

```bash
npm install
npm run build
npm pack --dry-run
```
