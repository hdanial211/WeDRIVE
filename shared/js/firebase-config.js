/**
 * WeDRIVE - Firebase Configuration
 * shared/js/firebase-config.js
 *
 * Initializes Firebase SDK (Auth + Firestore) for the WeDRIVE project.
 * All pages load this file BEFORE api.js.
 *
 * Firebase SDK is loaded via CDN (compat version) for static HTML compatibility.
 */

/* global firebase */

// Firebase configuration for wedrive-ce1a4
var firebaseConfig = {
  apiKey: "AIzaSyCcmsgxoqowOsV57EOYmhnLa_z2tN_ZeiI",
  authDomain: "wedrive.website",
  projectId: "wedrive-ce1a4",
  storageBucket: "wedrive-ce1a4.firebasestorage.app",
  messagingSenderId: "24595163697",
  appId: "1:24595163697:web:a7ed476aaea43aeea48310",
  measurementId: "G-JVL86HEKTJ"
};

// Initialize Firebase (only once)
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

// Export global references
window.firebaseApp = firebase.app();
window.firebaseAuth = firebase.auth();
window.firebaseDB = firebase.firestore();

// Log initialization
console.log('[WeDRIVE] Firebase initialized - Project: wedrive-ce1a4');
