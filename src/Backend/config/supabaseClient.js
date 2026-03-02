import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

<<<<<<< HEAD

=======
dotenv.config()
>>>>>>> 8939437 (updated code)

const supabaseUrl = process.env.SUPABASE_URL
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY



if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Missing Supabase env vars')
}

<<<<<<< HEAD
export const supabase = createClient(supabaseUrl, supabaseServiceKey)
=======
export const supabase = createClient(supabaseUrl, supabaseServiceKey)
>>>>>>> 8939437 (updated code)
