const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin');
const userRoutes = require('./routes/userRoutes');

const app = express();
const port = process.env.PORT || 8000;

app.use(express.json());
app.use(cors());

const serviceAccount = require('./private-key/indowayfinder-firebase-adminsdk-gy79r-3607877e74.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://indowayfinder-default-rtdb.firebaseio.com',
});

const db = admin.database();
app.set('db', db);
const usersRef = db.ref("users"); // Replace "users" with the correct path to your users collection

// Set usersRef in the app
app.set('usersRef', usersRef);

// Define your routes
app.use('/api/users', userRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
