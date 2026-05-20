/**
 * WeDRIVE - Supabase Data Migration Script
 * Migrates data from shared/dummy/data.json to Supabase PostgreSQL.
 * Run ONCE: node supabase/migrate-data.js
 */

var fs = require('fs');
var path = require('path');
var https = require('https');

var SUPABASE_URL = 'https://nigyovaqffwyinovivls.supabase.co';
var SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5pZ3lvdmFxZmZ3eWlub3ZpdmxzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NzM5NDEzMCwiZXhwIjoyMDkyOTcwMTMwfQ.hBK1Hy-91rfl5dc7WBd0gvvMI2ftes4Ac3xL5HzS7OQ';

// Load data.json
var dataPath = path.join(__dirname, '..', 'shared', 'dummy', 'data.json');
var data = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));

function supabaseInsert(table, rows) {
  return new Promise(function (resolve, reject) {
    var body = JSON.stringify(rows);
    var url = new URL(SUPABASE_URL + '/rest/v1/' + table);
    var options = {
      method: 'POST',
      hostname: url.hostname,
      path: url.pathname,
      headers: {
        'apikey': SERVICE_KEY,
        'Authorization': 'Bearer ' + SERVICE_KEY,
        'Content-Type': 'application/json',
        'Prefer': 'resolution=merge-duplicates',
        'Content-Length': Buffer.byteLength(body)
      }
    };
    var req = https.request(options, function (res) {
      var chunks = [];
      res.on('data', function (c) { chunks.push(c); });
      res.on('end', function () {
        var text = Buffer.concat(chunks).toString();
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(text);
        } else {
          reject(new Error(table + ': ' + res.statusCode + ' ' + text));
        }
      });
    });
    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

async function migrate() {
  console.log('[WeDRIVE Migration] Starting data migration to Supabase...');
  console.log('');

  // 1. Cars
  console.log('[1/7] Migrating cars...');
  var carRows = data.car.map(function (c) {
    return {
      car_id: c.id,
      name: c.name,
      type: c.type,
      brand: c.brand,
      price_per_day: c.price_per_day,
      price_per_hour: c.price_per_hour,
      year: c.year,
      seats: c.seats,
      transmission: c.transmission,
      fuel: c.fuel,
      engine: c.engine,
      color: c.color,
      plate: c.plate,
      mileage: c.mileage,
      status: c.status,
      rating: c.rating,
      reviews: c.reviews,
      features: JSON.stringify(c.features),
      image: c.image,
      gallery: JSON.stringify(c.gallery),
      specs: JSON.stringify(c.specs),
      insurance: JSON.stringify(c.insurance),
      description: c.description
    };
  });
  await supabaseInsert('cars', carRows);
  console.log('  ' + carRows.length + ' cars migrated.');

  // 2. Customers
  console.log('[2/7] Migrating customers...');
  var custRows = data.customers.map(function (c) {
    return {
      customer_id: 'cust-' + c.id,
      name: c.name,
      email: c.email,
      phone: c.phone || '',
      ic: c.ic || '',
      license: c.license || '',
      total_bookings: c.total_bookings || 0,
      total_spent: c.total_spent || 0,
      status: c.status || 'Active',
      joined: c.joined || new Date().toISOString().split('T')[0],
      last_booking: c.last_booking || '-'
    };
  });
  await supabaseInsert('customers', custRows);
  console.log('  ' + custRows.length + ' customers migrated.');

  // 3. Bookings
  console.log('[3/7] Migrating bookings...');
  var bookRows = data.bookings.map(function (b) {
    return {
      booking_id: b.id,
      car: b.car,
      car_id: b.car_id,
      customer: b.customer,
      customer_email: b.customer_email || '',
      pickup_date: b.pickup_date,
      return_date: b.return_date,
      pickup_time: b.pickup_time || '',
      return_time: b.return_time || '',
      pickup_location: b.pickup_location || '',
      return_location: b.return_location || '',
      duration: b.duration || '',
      total: b.total,
      status: b.status,
      payment_method: b.payment_method || ''
    };
  });
  await supabaseInsert('bookings', bookRows);
  console.log('  ' + bookRows.length + ' bookings migrated.');

  // 4. Admins
  console.log('[4/7] Migrating admins...');
  var adminRows = data.admins.map(function (a) {
    return {
      admin_id: 'admin-' + a.id,
      name: a.name,
      email: a.email,
      role: a.role || 'admin'
    };
  });
  await supabaseInsert('admins', adminRows);
  console.log('  ' + adminRows.length + ' admins migrated.');

  // 5. Settings
  console.log('[5/7] Migrating settings...');
  await supabaseInsert('settings', [{ key: 'main', value: JSON.stringify(data.settings) }]);
  console.log('  Settings saved.');

  // 6. Reports
  console.log('[6/7] Migrating reports...');
  await supabaseInsert('reports', [{ key: 'main', value: JSON.stringify(data.reports) }]);
  console.log('  Reports saved.');

  // 7. Marketing
  console.log('[7/7] Migrating marketing...');
  await supabaseInsert('marketing', [{ key: 'main', value: JSON.stringify(data.marketing) }]);
  console.log('  Marketing saved.');

  console.log('');
  console.log('========================================');
  console.log('[WeDRIVE Migration] COMPLETE!');
  console.log('All data migrated to Supabase PostgreSQL.');
  console.log('Project: WeDRIVE (Singapore)');
  console.log('========================================');
}

migrate().catch(function (err) {
  console.error('[Migration Error]', err.message);
  process.exit(1);
});
