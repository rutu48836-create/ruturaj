import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config({ path: './.env' })


const supabaseUrl = process.env.SUPABASE_URL
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY

console.log("URL:", process.env.SUPABASE_URL)
console.log("KEY:", process.env.SUPABASE_ANON_KEY)


export const supabase = createClient(supabaseUrl, supabaseAnonKey)
