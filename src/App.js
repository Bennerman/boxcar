import React, { useState, useEffect } from 'react';
import './App.css';
import HomeScreen from './components/HomeScreen';
import Footer from './components/Footer';
import AboutScreen from './components/AboutScreen';
import NavBar from './components/Navbar';
import Cart from './components/CartScreen';
import ShopScreen from './components/ShopScreen';
import Item from './components/Item';
import WelcomeScreen from './components/WelcomeScreen';
import LoginScreen from './components/LoginScreen'; // Import LoginScreen component
import { Route, Routes } from 'react-router';
import { BrowserRouter } from 'react-router-dom';
import SignupScreen from './components/SignupScreen';
import AccountScreen from './components/AccountScreen';
import CartScreen from './components/CartScreen';
import { v4 as uuidv4 } from 'uuid';

import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';
import { getAuth } from 'firebase/auth';
import { onAuthStateChanged } from 'firebase/auth';


function App() {
  
  const firebaseConfig = {
    apiKey: "AIzaSyBLeyCXqrNdHRlfwlbTm8DH43-R3gJ4KNk",
    authDomain: "boxcar-9330e.firebaseapp.com",
    databaseURL: "https://boxcar-9330e-default-rtdb.firebaseio.com",
    projectId: "boxcar-9330e",
    storageBucket: "boxcar-9330e.appspot.com",
    messagingSenderId: "74341992676",
    appId: "1:74341992676:web:7b0eeabca795d1fe1544f1",
    measurementId: "G-TC2N6MRKPE"
  };


  const app = initializeApp(firebaseConfig);
  const db = getDatabase(app);
  const auth = getAuth(app);
  const [showWelcome, setWelcome] = useState(true);
  const [isReady, setIsReady] = useState(false);
  const [user, setUser] = useState(null);

  const handleUserCredential = (credential) => {
    setUser(credential.user);
  };
  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });
    return () => {
      unsubscribe();
    };
  }, []);


  useEffect(() => {
    // Check if there's already a cartId in local storage
    

    const cartId = localStorage.getItem('cartId');
    if (!cartId) {
      // Generate a unique ID for the guest cart
      const uuid = uuidv4();
      // Set the cartId in local storage
      localStorage.setItem('cartId', uuid);
    }
  }, []);

  useEffect(() => {
    const savedWelcome = sessionStorage.getItem("showWelcomeScreen");
    if (savedWelcome !== null) {
      setWelcome(savedWelcome === "true");
      
      if(savedWelcome === true){
        sessionStorage.setItem("showWelcomeScreen", "true");
      }
      else{
        sessionStorage.setItem("showWelcomeScreen", "false");
      }
    }
    else{
      setWelcome(true);
      console.log("in null");
      sessionStorage.setItem("showWelcomeScreen", "true");

    }


  }, []);


  const handleComplete = () => {
    setWelcome(false);
  };

  const handleLoad = () => {
    setIsReady(true);
  };

  return (
    <>
      {showWelcome ? (
        <WelcomeScreen onComplete={handleComplete} />
      ) : (
       <div className="app-container d-flex flex-column" style={{minHeight: '100vh'}}>
        
          <BrowserRouter>
            <NavBar onLoad={handleLoad} />
              <Routes>
                <Route path="/" element={<HomeScreen />} />
                <Route path="/about" element={<AboutScreen />} />
                <Route path="/shop" element={<ShopScreen />} />
                <Route path="/shop/:id" element={<Item app={app} db={db} user={user}/>} />
                <Route path="/cart" element={<CartScreen app={app} db={db}  user={user} />} />
                <Route path="/login" element={<LoginScreen onUserCredential={handleUserCredential}/>} /> 
                <Route path="/signup" element={<SignupScreen />} /> 
                <Route path="/account" element={<AccountScreen/>}/>

              </Routes>
            <Footer />
          </BrowserRouter>
        </div>
      )}
    </>
  );
}

export default App;
