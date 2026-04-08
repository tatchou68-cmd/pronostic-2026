import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://sbmztelstnebenggvjez.supabase.co'
const supabaseAnonKey = 'sb_publishable_Z6rPUK3mWi8JMkPI5l0ZGA_HvL3_b0D'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)