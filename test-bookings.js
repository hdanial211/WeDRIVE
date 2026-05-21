const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

async function test() {
  const data = JSON.parse(fs.readFileSync('shared/js/firebase-config.js', 'utf8').match(/window\.AppConfig = (\{[\s\S]*?\});/)[1]);
  const supabaseUrl = data.SUPABASE_URL;
  const supabaseKey = data.SUPABASE_ANON_KEY;
  const supabase = createClient(supabaseUrl, supabaseKey);

  const { data: bookings, error } = await supabase.from('bookings').select('*').limit(5);
  console.log("Bookings:", bookings);
  if (error) console.error("Error:", error);
}
test();
