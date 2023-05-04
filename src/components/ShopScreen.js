// Import the functions you need from the SDKs you need
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { initializeApp } from 'firebase/app';
import { getDatabase, ref, onValue, set } from 'firebase/database';
import { getStorage, ref as storageRef, listAll, getDownloadURL } from "firebase/storage";


import ItemList from "./ItemList";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries



const ShopScreen = () => {


    const [shirts, setShirts] = useState([]);




    const firebaseConfig = require('../firebaseConfig');
    
    
  const app = initializeApp(firebaseConfig);
  const db = getDatabase(app);
  const storage = getStorage(app);
  const imageRef = storageRef(storage, 'shirts/');
  const topsRef = ref(db, 'tops/shirts');

  /*
  Replaces image reference to storage. DOES delete all data except image so dont use this code!!!

  useEffect(() => {
    // Retrieve the shirt data from Firebase Realtime Database
    onValue(topsRef, (snapshot) => {
      const topsData = snapshot.val();
      const shirtIds = Object.keys(topsData);

      // Retrieve the shirt images from Firebase Storage
      const imagePromises = shirtIds.map(async (shirtId) => {
        const imageRef = storageRef(storage, `shirts/${shirtId}.png`);
        const imageUrl = await getDownloadURL(imageRef);
        return { id: shirtId, image: imageUrl };
      });

      Promise.all(imagePromises).then((images) => {
        // Update the image field in the Firebase Realtime Database with the URL
        const shirtUpdates = images.map((shirt) => ({
          id: shirt.id,
          updates: {
            image: shirt.image,
          },
        }));

        shirtUpdates.forEach((shirtUpdate) => {
          set(ref(db, `tops/shirts/${shirtUpdate.id}`), shirtUpdate.updates);
        });

        // Combine the shirt data with the image URLs and update the state
        const shirtData = shirtIds.map((shirtId) => ({
          ...topsData[shirtId],
          id: shirtId,
          image: images.find((shirt) => shirt.id === shirtId).image,
        }));

        setShirts(shirtData);
      });
    });
  }, []);

  */

  useEffect(() => {
    onValue(ref(db, 'tops/shirts'), (snapshot) => {
      const shirtData = snapshot.val();
      const shirtIds = Object.keys(shirtData);
      const shirtList = shirtIds.map((id) => ({
        ...shirtData[id],
        id,
      }));
      setShirts(shirtList);
    });
  }, []);

      return (
        <div>
          <ItemList items={shirts}></ItemList>
        </div>
      );



}

export default ShopScreen




