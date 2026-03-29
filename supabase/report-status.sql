-- Report status system (apply in Supabase SQL editor)
--
-- States: Unconfirmed | Community-Supported | Disputed
-- Rules:
-- - New reports default to Unconfirmed
-- - First threshold out of Unconfirmed is based on triggering vote:
--   - upvote that makes upvotes >= 3 -> Community-Supported
--   - downvote that makes downvotes >= 3 -> Disputed
-- - After that, status flips only when the opposite side has 3 more votes:
--   - supported -> disputed when downvotes >= upvotes + 3
--   - disputed -> supported when upvotes >= downvotes + 3

begin;

-- 1) Persist status on reports
alter table public.reports
  add column if not exists status text not null default 'Unconfirmed';

alter table public.reports
  drop constraint if exists reports_status_check;

alter table public.reports
  add constraint reports_status_check
  check (status in ('Unconfirmed', 'Community-Supported', 'Disputed'));

-- 2) Ensure the reports_with_meta view exposes status
-- NOTE: This is a template. Replace the view body with your existing definition,
--       adding `r.status` (or the reports alias you use) to the select list.
--
-- create or replace view public.reports_with_meta as
-- select
--   r.report_id,
--   r.report_title,
--   r.report_description,
--   r.report_image,
--   r.status,
--   ...
-- from public.reports r
-- ...
;

-- 3) Update set_vote RPC to also update reports.status
-- NOTE: The exact vote aggregation logic depends on your existing function.
--       Update your existing set_vote implementation to:
--         - compute upvotes/downvotes after the vote change
--         - read current reports.status
--         - apply the transition rules below
--
-- PSEUDO-CODE TO INTEGRATE INSIDE set_vote AFTER COUNTS ARE KNOWN:
--   select status into v_prev_status from public.reports where report_id = p_report_id for update;
--
--   v_new_status := v_prev_status;
--   if v_prev_status = 'Unconfirmed' then
--     if p_value = 1 and v_upvotes >= 3 then
--       v_new_status := 'Community-Supported';
--     elsif p_value = -1 and v_downvotes >= 3 then
--       v_new_status := 'Disputed';
--     end if;
--   elsif v_prev_status = 'Community-Supported' then
--     if v_downvotes >= v_upvotes + 3 then
--       v_new_status := 'Disputed';
--     end if;
--   elsif v_prev_status = 'Disputed' then
--     if v_upvotes >= v_downvotes + 3 then
--       v_new_status := 'Community-Supported';
--     end if;
--   end if;
--
--   if v_new_status is distinct from v_prev_status then
--     update public.reports set status = v_new_status where report_id = p_report_id;
--   end if;

commit;

