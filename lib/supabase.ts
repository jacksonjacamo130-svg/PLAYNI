import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://ftcmijoklkmyrqqqlabs.supabase.co";
const supabasePublishableKey = "sb_publishable_SqM8MLVo76vprAalGIq4_w_Oyj52mn7";

export const supabase = createClient(supabaseUrl, supabasePublishableKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
});
