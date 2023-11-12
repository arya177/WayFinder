import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { useState } from 'react';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDz7U50G2VGlbFFxYjmkhPh9VeJyDklH8I",
  authDomain: "indowayfinder.firebaseapp.com",
  projectId: "indowayfinder",
  storageBucket: "indowayfinder.appspot.com",
  messagingSenderId: "98937567653",
  appId: "1:98937567653:web:2c3484347dda3b8807d04c"
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);

// Get the Firebase Auth instance and the GoogleAuthProvider
const auth = getAuth(firebaseApp);
const provider = new GoogleAuthProvider();

const Navbar = () => {
  const [user, setUser] = useState(null);

  const signInWithGoogle = () => {
    signInWithPopup(auth, provider)
      .then((result) => {
        // Handle successful sign-in, e.g., update user state
        const user = result.user;
        setUser(user);
      })
      .catch((error) => {
        // Handle sign-in errors
        console.error(error);
      });
  };

  // ... rest of your component code

  return (
    // Your component JSX
    <></>
  );
};

export { auth, provider, firebaseApp };
