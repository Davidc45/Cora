-- set_vote: SECURITY DEFINER RPC so the vote upsert runs with owner privileges
-- and avoids "permission denied for table users" from RLS/FK on votes.
-- Requires: unique on votes(report_id, user_id) and recompute_report_vote_totals(bigint) exist.

create or replace function public.set_vote(p_report_id bigint, p_value integer)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user_id uuid;
begin
  v_user_id := auth.uid();
  if v_user_id is null then
    raise exception 'not authenticated';
  end if;
  if p_value not in (0, 1, -1) then
    raise exception 'invalid vote value';
  end if;
  if p_value = 0 then
    delete from public.votes
    where report_id = p_report_id and user_id = v_user_id;
  else
    insert into public.votes (report_id, user_id, vote)
    values (p_report_id, v_user_id, p_value)
    on conflict (report_id, user_id) do update set vote = excluded.vote;
  end if;
  perform public.recompute_report_vote_totals(p_report_id);
end;
$$;
