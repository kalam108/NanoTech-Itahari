import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://zovjbvddiimvxragxxni.supabase.co';
const supabaseKey = 'sb_publishable_eruSA7SXKOr6YmrDXkZQKA_e77938Pk';

export const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
