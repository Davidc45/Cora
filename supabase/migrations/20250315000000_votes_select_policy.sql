-- Allow authenticated users to read their own votes.
-- The set_vote RPC (SECURITY DEFINER) handles writes and bypasses RLS,
-- but direct SELECT queries need this policy to return rows.
create policy "Users can read own votes"
  on public.votes
  for select
  using (user_id = auth.uid());
