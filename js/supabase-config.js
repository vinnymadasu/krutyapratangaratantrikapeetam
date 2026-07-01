// Public, client-safe Supabase config.
// Only the publishable (anon) key belongs here — it is protected by the
// Row Level Security policies defined in supabase/schema.sql, which allow
// inserts only (no reads/updates/deletes) from the browser.
// NEVER put the Supabase secret/service key in this file or any file
// served to the browser.
const SUPABASE_URL = 'https://ledchnydbjfxnwzixejl.supabase.co';
const SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_KM4y4lr1ta5sXWlf7dt8Ow_PUeShxSP';
