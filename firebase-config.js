// firebase-config.js
// ================================================================
//  Firebase is configured and ready.
//  Do not share this file publicly or post it to a public repo
//  without restricting the API key in Google Cloud Console
//  (recommended after launch).
// ================================================================
 
const firebaseConfig = {
  apiKey:            "AIzaSyDz9_Y0NR_FJvwdBzP3juCn63p3VdMxEgk",
  authDomain:        "dyed-for-america.firebaseapp.com",
  projectId:         "dyed-for-america",
  storageBucket:     "dyed-for-america.firebasestorage.app",
  messagingSenderId: "172662939752",
  appId:             "1:172662939752:web:8c726fdd8a20175f425bdd"
};
 
// ── Initialize ───────────────────────────────────────────────────
// This runs automatically when the page loads.
// Do not edit anything below this line.
(function () {
  try {
    if (!firebase.apps || !firebase.apps.length) {
      firebase.initializeApp(firebaseConfig);
    }
    window.db = firebase.firestore();
    if (typeof firebase.storage === "function") {
      window.storage = firebase.storage();
    }
    if (typeof firebase.auth === "function") {
      window.auth = firebase.auth();
    }
    window.firebaseReady = true;
    console.log("✅ Firebase connected.");
  } catch (e) {
    window.firebaseReady = false;
    console.warn("⚠️  Firebase not configured yet — showing built-in product data.", e.message);
  }
})();
 
