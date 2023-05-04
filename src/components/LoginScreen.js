import React, { useState } from 'react';
import '../LoginScreen.css';
import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";


import { useNavigate } from 'react-router';


const LoginScreen = (props) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();


  const firebaseConfig = require('../firebaseConfig');

  // Initialize Firebase
    const app = initializeApp(firebaseConfig);


// Initialize Firebase Authentication and get a reference to the service
    const auth = getAuth(app);


    const handleSubmit = async (event) => {
        event.preventDefault();
      
        try {
          const userCredential = await signInWithEmailAndPassword(auth, email, password);
          props.onUserCredential(userCredential);
          // The signed-in user info is available in userCredential.user
          navigate('/');
        } catch (error) {
          console.log(error);
        }
      };

  const handleSignupClick = () => {
    navigate("/signup")
  }

  return (
    <div className="login-container">
      <h1 className="login-title">Login</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-field">
          <label htmlFor="email">Email:</label>
          <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div className="form-field">
          <label htmlFor="password">Password:</label>
          <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <button type="submit" className="submit-button">Submit</button>
        <button type="button" onClick={handleSignupClick}>Sign up</button>

      </form>
    </div>
  );
};

export default LoginScreen;
