-- Bracelet activation via SECURITY DEFINER function
-- 
-- NOTE: Direct RLS-based UPDATE on children_bracelets for activation
-- was found to silently fail (0 rows affected, HTTP 204) despite:
-- - auth.uid() correctly resolving via RPC
-- - Manual JWT simulation in SQL working correctly
-- - All GRANTS being correctly in place
-- - No triggers or FORCE RLS interfering
-- Root cause not fully identified — likely a PostgREST/Supabase
-- edge case with multi-condition UPDATE policies. Switched to a
-- SECURITY DEFINER function as a reliable, secure alternative.

create or replace function activate_bracelet(
  bracelet_id uuid,
  new_child_name text
)
returns children_bracelets
language plpgsql
security definer
set search_path = public
as $$
declare
  result children_bracelets;
  current_user_id uuid;
begin
  current_user_id := auth.uid();

  if current_user_id is null then
    raise exception 'Not authenticated';
  end if;

  update children_bracelets
  set
    guardian_id = current_user_id,
    child_first_name = new_child_name,
    status = 'active',
    activated_at = now()
  where id = bracelet_id
    and status = 'unactivated'
    and guardian_id is null
  returning * into result;

  if result.id is null then
    raise exception 'Bracelet not found or already activated';
  end if;

  return result;
end;
$$;

grant execute on function activate_bracelet(uuid, text) to authenticated;
