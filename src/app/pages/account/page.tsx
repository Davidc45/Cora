import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import NotificationToggle from '@/app/components/notification-toggle';
import VerifiedToast from '@/app/components/verified-toast';

/**
 * Account page (authenticated).
 *
 * - Requires an authenticated Supabase user; otherwise redirects to login.
 * - Looks up the user's profile to display a friendly greeting.
 * - Embeds the `NotificationToggle` to manage browser push notifications.
 */
export default async function Account() {
  const supabase = await createClient();
  const { data: { user }, } = await supabase.auth.getUser();
  if (!user) redirect('/pages/login');

  const { data: profile } = await supabase
    .from('profiles')
    .select('username')
    .eq('id', user.id)
    .single();

  const username =
    profile?.username ??
    (user.user_metadata as { username?: string } | null)?.username ??
    user.email?.split('@')[0] ??
    'there';

  return (
    <div className="account-container">
      <VerifiedToast />
      <h1>Welcome, {username}!!!</h1>
      <NotificationToggle />
    </div>
  );
}