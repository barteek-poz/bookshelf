import {createClient} from "@supabase/supabase-js"
import dotenv from 'dotenv'

dotenv.config({path:'.env'})

const supabaseURL = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_KEY
console.log(supabaseURL);

const supabase = createClient(supabaseURL, supabaseKey)

export default supabase