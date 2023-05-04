import "../styles.css";
import "../Item.css";
import { Container, Row, Col } from "react-bootstrap";
import { getDatabase, ref, onValue, push, get, update,remove } from 'firebase/database';
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { initializeApp } from "firebase/app";

const Item = (props) => {


    const [shirts, setShirts] = useState([]);
    const [shirt, setShirt] = useState([]);
    const [isLoaded, setIsLoaded] = useState(false);

    const { id } = useParams();

    const firebaseConfig = require('../firebaseConfig');
  
  
    const app = initializeApp(firebaseConfig);
    const db = getDatabase(app);

  
  // Initialize Firebase Authentication and get a reference to the service

  

  

  useEffect(() => {
    // Retrieve the shirt data from Firebase Realtime Database
    onValue(ref(db, 'tops/shirts'), (snapshot) => {
      
      const shirtData = snapshot.val();
      const shirtIds = Object.keys(shirtData);
      const shirtList = shirtIds.map((id) => ({
        ...shirtData[id],
        id,
      }));
      setShirts(shirtList);
      console.log(shirtList);
      console.log(shirtIds);

    });
  }, [id]);

  useEffect(() => {
    setShirt(shirts.find((shirt) => shirt.id === id));
  }, [shirts, id]);


  useEffect(()=>{
    setIsLoaded(true);
  }, [shirt]);

  const handleAddToCart = async (item) => {
  
    if (props.user) {

      //USERS
      const cartRef = ref(db, `carts/${props.user.uid}/items`);

      const snapshot = await get(cartRef);
      const items = snapshot.val() || {};
  

      let key = null; // Define key variable
      Object.keys(items).forEach((itemKey) => { // Find the key for the item to be updated
        if (items[itemKey].id === item.id) {
          key = itemKey;
        }
      });

      let updatedItem = null;
      if (key) {
        updatedItem = {
          ...items[key],
          quantity: items[key].quantity + 1,
        };
      }

  
      if (updatedItem) {
        console.log(key);
        update(ref(db, `carts/${props.user.uid}/items/${key}`), updatedItem); // Use key variable
        console.log("User cart updated");
      } else {
        const newItem = {
          ...item,
          quantity: 1,
        };
        push(cartRef, newItem);
        console.log("User cart added");
      }
    } else {
      //GUESTS
      const cartId = localStorage.getItem('cartId');
      const cartRef = ref(db, `guestCarts/${cartId}/items`);
  
      const snapshot = await get(cartRef);
      const items = snapshot.val() || {};
  

      let key = null; // Define key variable
      Object.keys(items).forEach((itemKey) => { // Find the key for the item to be updated
        if (items[itemKey].id === item.id) {
          key = itemKey;
        }
      });

      let updatedItem = null;
      if (key) {
        updatedItem = {
          ...items[key],
          quantity: items[key].quantity + 1,
        };
      }

  
      if (updatedItem) {
        console.log(key);
        update(ref(db, `guestCarts/${cartId}/items/${key}`), updatedItem); // Use key variable
        console.log("guest cart updated");
      } else {
        const newItem = {
          ...item,
          quantity: 1,
        };
        push(cartRef, newItem);
        console.log("guest cart added");
      }
    }
  };

  const handleRemoveFromCart = async (item) => {
    if (props.user) {
      // USERS
      const cartRef = ref(db, `carts/${props.user.uid}/items`);
  
      const snapshot = await get(cartRef);
      const items = snapshot.val() || {};
  
      let key = null; // Define key variable
      Object.keys(items).forEach((itemKey) => { // Find the key for the item to be updated
        if (items[itemKey].id === item.id) {
          key = itemKey;
        }
      });
  
      if (key) {
        if (items[key].quantity > 1) { // If item quantity is greater than 1, decrement it
          const updatedItem = {
            ...items[key],
            quantity: items[key].quantity - 1,
          };
          update(ref(db, `carts/${props.user.uid}/items/${key}`), updatedItem);
          console.log("User cart updated");
        } else { // If item quantity is 1, remove it from the cart
          remove(ref(db, `carts/${props.user.uid}/items/${key}`));
          console.log("Item removed from user cart");
        }
      }
    } else {
      // GUESTS
      const cartId = localStorage.getItem('cartId');
      const cartRef = ref(db, `guestCarts/${cartId}/items`);
  
      const snapshot = await get(cartRef);
      const items = snapshot.val() || {};
  
      let key = null; // Define key variable
      Object.keys(items).forEach((itemKey) => { // Find the key for the item to be updated
        if (items[itemKey].id === item.id) {
          key = itemKey;
        }
      });
  
      if (key) {
        if (items[key].quantity > 1) { // If item quantity is greater than 1, decrement it
          const updatedItem = {
            ...items[key],
            quantity: items[key].quantity - 1,
          };
          update(ref(db, `guestCarts/${cartId}/items/${key}`), updatedItem);
          console.log("Guest cart updated");
        } else { // If item quantity is 1, remove it from the cart
          remove(ref(db, `guestCarts/${cartId}/items/${key}`));
          console.log("Item removed from guest cart");
        }
      }
    }
  };

  
  return (
    <div className="item">
      {isLoaded ? (
        <Container>
          <Row>
            <Col className="item-image">
              <img src={shirt?.image} alt={shirt?.id} />
            </Col>
            <Col className="item-details">
              <h3 className="item-title">{shirt?.id}</h3>
              <h3 className="item-price">${shirt?.price}</h3>
              <div className="item-buttons">
                <button className="add-to-cart-button" onClick={() => handleAddToCart(shirt)}>Add to Cart</button>
                <button className="remove-from-cart-button" onClick={()=> handleRemoveFromCart(shirt)}>Remove from Cart</button>
              </div>
            </Col>
          </Row>
        </Container>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}

export default Item;