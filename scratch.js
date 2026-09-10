const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

async function checkCars() {
  const env = fs.readFileSync('.env', 'utf-8');
  const supabaseUrl = env.match(/SUPABASE_URL=(.*)/)[1].trim();
  const supabaseKey = env.match(/SUPABASE_ANON_KEY=(.*)/)[1].trim();
  const supabase = createClient(supabaseUrl, supabaseKey);
  
  const { data, error } = await supabase.from('cars').select('id, name, has_360').limit(5);
  console.log(data);
}
checkCars();
