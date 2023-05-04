import React, { useState } from 'react';
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, set } from 'firebase/database';
import { useNavigate } from 'react-router';
import { getAuth, createUserWithEmailAndPassword , updateProfile, sendEmailVerification} from "firebase/auth";
import "../SignupScreen.css";

const SignupScreen = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const firebaseConfig = require('../firebaseConfig');
  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);

  const navigation = useNavigate();

  const createCart = (userId) => {
    const db = getDatabase(app);
    const cartRef = ref(db, `carts/${userId}`);
    const newCart = {
      items: [],
      total: 0
    };
    set(cartRef, newCart);
  };


    const handleSignup = async (event) => {
        event.preventDefault();
      
        try {
          const { email, password, displayName } = event.target.elements;
      
          // Create user with email and password
          const userCredential = await createUserWithEmailAndPassword(auth, email.value, password.value);
      
          // Set user's display name
          await updateProfile(userCredential.user, { displayName: firstName });

          createCart(userCredential.user.uid);
      
          // User created successfully
          sendEmailVerification(auth.currentUser)
            .then(() => {
                console.log("Verification Email Sent")              // ...
            });
          console.log("User created successfully");
          navigation('/');
      
        } catch (error) {
          // Handle errors here
          console.error(error);
        }
      };



  return (
    <div className="signup-screen">
      <h1>Sign Up</h1>
      <form onSubmit={handleSignup}>
        <div className="form-group">
          <label htmlFor="firstName">First Name:</label>
          <input type="text" id="firstName" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
        </div>
        <div className="form-group">
          <label htmlFor="lastName">Last Name:</label>
          <input type="text" id="lastName" value={lastName} onChange={(e) => setLastName(e.target.value)} />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <div className="form-group">
          <label htmlFor="confirmPassword">Confirm Password:</label>
          <input type="password" id="confirmPassword" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
        </div>
        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
};

export default SignupScreen;


