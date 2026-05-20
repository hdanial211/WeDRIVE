/**
 * WeDRIVE - Create Test Users in Firebase Auth
 * firebase/create-users.js
 *
 * Creates test accounts for development.
 * Run once: node firebase/create-users.js
 */

const admin = require('firebase-admin');

if (!admin.apps.length) {
  admin.initializeApp({ projectId: 'wedrive-ce1a4' });
}

const auth = admin.auth();

var users = [
  {
    uid: 'admin001',
    email: 'admin@wedrive.my',
    password: 'admin123',
    displayName: 'Admin WeDRIVE',
    emailVerified: true
  },
  {
    uid: 'cust001',
    email: 'ahmad@gmail.com',
    password: 'test123',
    displayName: 'Ahmad Hakim',
    emailVerified: true
  },
  {
    uid: 'cust002',
    email: 'siti@gmail.com',
    password: 'test123',
    displayName: 'Siti Nurul',
    emailVerified: true
  }
];

async function createUsers() {
  console.log('[WeDRIVE] Creating test users in Firebase Auth...');
  console.log('');

  for (var u of users) {
    try {
      await auth.createUser({
        uid: u.uid,
        email: u.email,
        password: u.password,
        displayName: u.displayName,
        emailVerified: u.emailVerified
      });
      console.log('  Created: ' + u.email + ' (password: ' + u.password + ')');
    } catch (err) {
      if (err.code === 'auth/uid-already-exists' || err.code === 'auth/email-already-exists') {
        console.log('  Exists: ' + u.email + ' (skipped)');
      } else {
        console.error('  Error creating ' + u.email + ':', err.message);
      }
    }
  }

  console.log('');
  console.log('[WeDRIVE] Test users ready!');
  console.log('  Admin: admin@wedrive.my / admin123');
  console.log('  Customer: ahmad@gmail.com / test123');
  console.log('  Customer: siti@gmail.com / test123');
}

createUsers().catch(function(err) {
  console.error('[Error]', err);
  process.exit(1);
});
