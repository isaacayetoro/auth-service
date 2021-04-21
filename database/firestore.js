const admin = require('firebase-admin');

admin.initializeApp({
  credential: admin.credential.applicationDefault()
});


// development environment

// var serviceAccount = require("../auth-services-311310-firebase-adminsdk-mdkj9-e9c9942b97.json");

// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount)
// });


const db = admin.firestore();

module.exports = db;