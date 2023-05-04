import { useEffect, useState } from "react";
import { getAuth } from "firebase/auth";
import { ref, onValue, set, get, remove } from "firebase/database";
import CheckoutCard from "./CheckoutCard";
import { Row } from "react-bootstrap";
import { useAuthState } from "react-firebase-hooks/auth";
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { onAuthStateChanged } from "firebase/auth";

const CartScreen = (props) => {
  const firebaseConfig = require('../firebaseConfig');


  const app = initializeApp(firebaseConfig);
  const db = getDatabase(app);
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [myUser, setMyUser] = useState(null); // set initial value to null
  const [user, loadingAuth] = useAuthState(getAuth(app));


  useEffect(() => {
    if (!loadingAuth) {
      console.log(user);
      if (user) {

        // Listen for changes in the user's cart data
        const cartRef = ref(db, `carts/${props.user.uid}/items`);
        onValue(cartRef, (snapshot) => {

          const cartData = snapshot.val();

          console.log(cartData);
          if (cartData) {
            // Convert the cart data to an array of items and set state
            const itemIds = Object.keys(cartData);
            const itemList = itemIds.map((id) => ({
              id: id,
              ...cartData[id],
            }));
            setCartItems(itemList);
          }
        });


      } else {
        // Guest cart functionality
        const cartId = localStorage.getItem("cartId");
        if (cartId) {
          const cartRef = ref(db, `guestCarts/${cartId}/items`);

          onValue(cartRef, (snapshot) => {
            const cartData = snapshot.val();

            if (cartData) {
              const itemIds = Object.keys(cartData);
              const itemList = itemIds.map((id) => ({
                id: id,
                ...cartData[id],
              }));
              setCartItems(itemList);
            }
          });
        } 
      }

      setLoading(false);

    }
  }, [loadingAuth, user]);

  const handleRemoveFromCart = async (itemId) => {

    if (props.user) {
      // USERS
      const cartRef = ref(props.db, `carts/${props.user.uid}/items`);
      console.log("in user");
      const snapshot = await get(cartRef);
      const items = snapshot.val() || {};

      let key = null; // Define key variable
      Object.keys(items).forEach((itemKey) => { // Find the key for the item to be updated
        if (items[itemKey].id === itemId) {
          key = itemKey;
        }
      });

      if (key) {
        remove(ref(props.db, `carts/${props.user.uid}/items/${key}`));
        console.log("Item removed from user cart");
      }
    } else {
      // GUESTS
      const cartId = localStorage.getItem('cartId');
      const cartRef = ref(props.db, `guestCarts/${cartId}/items`);

      const snapshot = await get(cartRef);
      const items = snapshot.val() || {};

      let key = null; // Define key variable
      Object.keys(items).forEach((itemKey) => { // Find the key for the item to be updated
        if (items[itemKey].id === itemId) {
          key = itemKey;
        }
      });

      if (key) {
        remove(ref(props.db, `guestCarts/${cartId}/items/${key}`));
        console.log("Item removed from guest cart");
      }
    }
    const updatedCartItems = cartItems.filter(item => item.id !== itemId);
    setCartItems(updatedCartItems);
  };





  if (loading) {
    return <p>Loading cart items...</p>;
  }

  if (cartItems.length === 0) {
    return <p>Your cart is empty</p>;
  }

  return (
    <div>
      <Row>
        {cartItems.map((item) => (
          <CheckoutCard
            key={item.name}
            id={item.id}
            user={props.user}
            db={db}
            name={item.name}
            image={item.image}
            price={item.price}
            quantity={item.quantity}
            onRemoveItem={() => handleRemoveFromCart(item.id)}
          />
        ))}
      </Row>
    </div>
  );
};

export default CartScreen;
