import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://tnlalcpofvdtaihqgoyz.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRubGFsY3BvZnZkdGFpaHFnb3l6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODA1MjA5MzEsImV4cCI6MTk5NjA5NjkzMX0.6AA5WSmZeW09BPRCDmuC12Cztliewl_q4-dEIMFzAq4';
const supabaseClient = createClient(supabaseUrl, supabaseKey);

export default supabaseClient;
