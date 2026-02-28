import { createClient } from '@supabase/supabase-js';

let supabaseClient = null;

/**
 * Get Supabase client instance
 * Uses service role key for server-side operations
 */
export function getSupabase() {
  if (!supabaseClient) {
    // Server-side uses service role key for full access
    const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Supabase credentials not configured. Required: SUPABASE_URL or VITE_SUPABASE_URL');
    }

    supabaseClient = createClient(supabaseUrl, supabaseKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });
  }
  return supabaseClient;
}

/**
 * Helper to execute raw SQL queries via Supabase
 * Uses the postgres connection for complex queries
 */
export async function executeQuery(sql, params = []) {
  const supabase = getSupabase();
  
  // Use rpc to execute raw SQL
  const { data, error } = await supabase.rpc('exec_sql', { 
    query: sql, 
    params: JSON.stringify(params) 
  });

  if (error) throw error;
  return { rows: data || [] };
}

/**
 * Get data from a table with optional filters
 */
export async function getFromTable(table, options = {}) {
  const supabase = getSupabase();
  
  let query = supabase.from(table).select(options.select || '*');
  
  if (options.filter) {
    for (const [column, value] of Object.entries(options.filter)) {
      query = query.eq(column, value);
    }
  }
  
  if (options.order) {
    query = query.order(options.order.column, { ascending: options.order.ascending ?? true });
  }
  
  if (options.limit) {
    query = query.limit(options.limit);
  }
  
  const { data, error } = await query;
  if (error) throw error;
  return data;
}

/**
 * Insert data into a table
 */
export async function insertIntoTable(table, data) {
  const supabase = getSupabase();
  
  const { data: result, error } = await supabase
    .from(table)
    .insert(data)
    .select();

  if (error) throw error;
  return result;
}

/**
 * Update data in a table
 */
export async function updateTable(table, id, data) {
  const supabase = getSupabase();
  
  const { data: result, error } = await supabase
    .from(table)
    .update(data)
    .eq('id', id)
    .select();

  if (error) throw error;
  return result;
}

/**
 * Delete from a table
 */
export async function deleteFromTable(table, id) {
  const supabase = getSupabase();
  
  const { error } = await supabase
    .from(table)
    .delete()
    .eq('id', id);

  if (error) throw error;
  return true;
}
