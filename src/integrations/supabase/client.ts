// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://ucyqhfghbxqlgbsfqytw.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVjeXFoZmdoYnhxbGdic2ZxeXR3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk0NjQzOTYsImV4cCI6MjA2NTA0MDM5Nn0.Bv_TqjDFCV9FNv21SNtp78OwaTyTGCEpsFTkKqY0S8w";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);