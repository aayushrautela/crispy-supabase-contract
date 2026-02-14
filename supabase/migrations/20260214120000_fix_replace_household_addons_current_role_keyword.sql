create or replace function public.replace_household_addons(p_addons jsonb)
returns void
language plpgsql
security definer
set search_path to 'public', 'auth'
as $function$
declare
  current_user_id uuid := auth.uid();
  current_household_id uuid;
  addon_payload jsonb;
  addon_url text;
  addon_enabled boolean;
  addon_name text;
  addon_updated_at timestamptz;
  seen_urls text[] := array[]::text[];
begin
  if current_user_id is null then
    raise exception 'Authentication required';
  end if;

  if jsonb_typeof(coalesce(p_addons, '[]'::jsonb)) <> 'array' then
    raise exception 'Invalid addons payload: expected JSON array';
  end if;

  select hm.household_id
    into current_household_id
  from public.household_members hm
  where hm.user_id = current_user_id
  limit 1;

  if current_household_id is null then
    raise exception 'No household membership found for authenticated user';
  end if;

  if not public.can_manage_household_addons(current_household_id, current_user_id) then
    raise exception 'Only the primary account can modify addons';
  end if;

  for addon_payload in
    select value from jsonb_array_elements(coalesce(p_addons, '[]'::jsonb))
  loop
    if jsonb_typeof(addon_payload) <> 'object' then
      raise exception 'Invalid addons payload: each entry must be an object';
    end if;

    if not (addon_payload ? 'url') or jsonb_typeof(addon_payload -> 'url') <> 'string' then
      raise exception 'Invalid addons payload: every addon requires a string url';
    end if;

    addon_url := btrim(addon_payload ->> 'url');
    if addon_url = '' then
      raise exception 'Invalid addons payload: addon url cannot be empty';
    end if;

    addon_enabled := true;
    if addon_payload ? 'enabled' then
      if jsonb_typeof(addon_payload -> 'enabled') <> 'boolean' then
        raise exception 'Invalid addons payload: enabled must be a boolean';
      end if;
      addon_enabled := (addon_payload ->> 'enabled')::boolean;
    end if;

    addon_name := null;
    if addon_payload ? 'name' then
      if addon_payload -> 'name' = 'null'::jsonb then
        addon_name := null;
      else
        if jsonb_typeof(addon_payload -> 'name') <> 'string' then
          raise exception 'Invalid addons payload: name must be a string when provided';
        end if;
        addon_name := left(nullif(btrim(addon_payload ->> 'name'), ''), 128);
      end if;
    end if;

    addon_updated_at := timezone('utc', now());
    if addon_payload ? 'updatedAt' then
      if jsonb_typeof(addon_payload -> 'updatedAt') <> 'number' then
        raise exception 'Invalid addons payload: updatedAt must be a number when provided';
      end if;
      addon_updated_at := to_timestamp((addon_payload ->> 'updatedAt')::numeric / 1000.0);
    end if;

    insert into public.addons (household_id, url, enabled, name, created_by, updated_by, updated_at)
    values (current_household_id, addon_url, addon_enabled, addon_name, current_user_id, current_user_id, addon_updated_at)
    on conflict (household_id, url) do update
      set enabled = excluded.enabled,
          name = excluded.name,
          updated_by = current_user_id,
          updated_at = excluded.updated_at;

    if not (addon_url = any(seen_urls)) then
      seen_urls := array_append(seen_urls, addon_url);
    end if;
  end loop;

  delete from public.addons a
  where a.household_id = current_household_id
    and not (a.url = any(seen_urls));
end;
$function$;
