import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'



const supabaseUrl = process.env.SUPABASE_URL
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY

console.log('SUPABASE_URL:', process.env.SUPABASE_URL)
console.log('SUPABASE_SERVICE_KEY:', process.env.SUPABASE_SERVICE_KEY?.substring(0, 20))

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Missing Supabase env vars')
}

export const supabase = createClient(supabaseUrl, supabaseServiceKey)
