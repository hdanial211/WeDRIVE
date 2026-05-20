/**
 * WeDRIVE - Data Migration Script
 * firebase/migrate-data.js
 *
 * Migrates data from shared/dummy/data.json to Firebase Firestore.
 * Run this script ONCE to seed the database with initial data.
 *
 * Usage:
 *   node firebase/migrate-data.js
 *
 * Prerequisites:
 *   - Firebase Admin SDK: npm install firebase-admin
 *   - Service account key from Firebase Console
 */

const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

// Initialize Firebase Admin with application default credentials
// (uses gcloud auth application-default credentials)
admin.initializeApp({
  projectId: 'wedrive-ce1a4'
});

const db = admin.firestore();

// Load data.json
const dataPath = path.join(__dirname, '..', 'shared', 'dummy', 'data.json');
const data = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));

async function migrateData() {
  console.log('[WeDRIVE Migration] Starting data migration to Firestore...');
  console.log('');

  // 1. Migrate Cars
  console.log('[1/7] Migrating cars...');
  for (const car of data.car) {
    await db.collection('cars').doc('car-' + car.id).set(car);
    console.log('  - ' + car.name);
  }
  console.log('  Total: ' + data.car.length + ' cars migrated.');
  console.log('');

  // 2. Migrate Bookings
  console.log('[2/7] Migrating bookings...');
  for (const booking of data.bookings) {
    await db.collection('bookings').doc(booking.id).set(booking);
    console.log('  - ' + booking.id + ' (' + booking.customer + ')');
  }
  console.log('  Total: ' + data.bookings.length + ' bookings migrated.');
  console.log('');

  // 3. Migrate Customers
  console.log('[3/7] Migrating customers...');
  for (const customer of data.customers) {
    await db.collection('customers').doc('cust-' + customer.id).set(customer);
    console.log('  - ' + customer.name + ' (' + customer.email + ')');
  }
  console.log('  Total: ' + data.customers.length + ' customers migrated.');
  console.log('');

  // 4. Migrate Settings
  console.log('[4/7] Migrating settings...');
  await db.collection('settings').doc('main').set(data.settings);
  console.log('  Settings saved.');
  console.log('');

  // 5. Migrate Reports
  console.log('[5/7] Migrating reports...');
  await db.collection('reports').doc('main').set(data.reports);
  console.log('  Reports saved.');
  console.log('');

  // 6. Migrate Config + Admins
  console.log('[6/7] Migrating config and admins...');
  await db.collection('config').doc('main').set(data.config);
  for (const adm of data.admins) {
    await db.collection('admins').doc('admin-' + adm.id).set(adm);
    console.log('  - Admin: ' + adm.name + ' (' + adm.email + ')');
  }
  console.log('');

  // 7. Migrate Marketing
  console.log('[7/7] Migrating marketing data...');
  await db.collection('marketing').doc('main').set(data.marketing);
  console.log('  Banners: ' + data.marketing.banners.length);
  console.log('  Promo codes: ' + data.marketing.promo_codes.length);
  console.log('');

  console.log('========================================');
  console.log('[WeDRIVE Migration] COMPLETE!');
  console.log('All data has been migrated to Firestore.');
  console.log('Project: wedrive-ce1a4');
  console.log('Location: asia-southeast1 (Singapore)');
  console.log('========================================');
}

migrateData().catch(function(err) {
  console.error('[Migration Error]', err);
  process.exit(1);
});
