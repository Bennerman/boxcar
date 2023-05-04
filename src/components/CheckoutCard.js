import { Card, Col } from "react-bootstrap";
import { getDatabase, ref, onValue, push, get, update, remove } from 'firebase/database';
import { Button } from "react-bootstrap";
import { useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';

const CheckoutCard = (props) => {
  const icon = faXmark; // set the icon here

  const iconSize = '2x'; // set the icon size here
  
  const [quantity, setQuantity] = useState(props.quantity);


  const handleQuantityChange = (event) => {

    if(parseInt(event.target.value) > 0){
      setQuantity(parseInt(event.target.value));

    }
  };

  const handleAddToCart = async (props) => {


    if (props.user) {

      //USERS
      const cartRef = ref(props.db, `carts/${props.user.uid}/items`);


      const snapshot = await get(cartRef);
      const items = snapshot.val() || {};



      let key = null; // Define key variable
      Object.keys(items).forEach((itemKey) => { // Find the key for the item to be updated
        if (items[itemKey].id === props.id) {
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
        update(ref(props.db, `carts/${props.user.uid}/items`), updatedItem); // Use key variable
        console.log("User cart updated");
      } else {
        const newItem = {
          ...props,
          quantity: 1,
        };
        push(cartRef, newItem);
        console.log("User cart added");
      }
    } else {
      //GUESTS
      const cartId = localStorage.getItem('cartId');
      const cartRef = ref(props.db, `guestCarts/${cartId}/items`);

      const snapshot = await get(cartRef);
      const items = snapshot.val() || {};


      let key = null; // Define key variable
      Object.keys(items).forEach((itemKey) => { // Find the key for the item to be updated
        if (items[itemKey].id === props.id) {
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
        update(ref(props.db, `guestCarts/${cartId}/items/${key}`), updatedItem); // Use key variable
        console.log("guest cart updated");
      } else {
        const newItem = {
          ...props,
          quantity: 1,
        };
        push(cartRef, newItem);
        console.log("guest cart added");
      }
    }
  };

  const handleRemoveItem = () => {
    props.onRemoveItem(); // call onRemoveItem prop
  };

  
  return (
    <Col>
      <Card className="border-0" style={{marginTop: "5rem"}}>
        <div className="d-flex align-items-center">
          <button onClick={handleRemoveItem} style={{ background: 'none', border: 'none', padding: 0}}>
             <FontAwesomeIcon style={{marginLeft: "5rem"}} icon={icon} size={iconSize} />
          </button>
          <Card.Img variant="left" src={props.image} style={{ width: "8rem", height: "8rem", marginLeft:"5rem", marginRight: "5rem"}} />
          <Card.Title style={{marginRight: "5rem"}}>{props.name}</Card.Title>
          <input className="border-0" type="number" value={quantity} onChange={handleQuantityChange} style={{ appearance: 'none', marginRight: "5rem"}} />
          <Card.Text style={{marginRight: "5rem"}}>${props.price}</Card.Text>
        </div>
      </Card>
    </Col>
  );
};

export default CheckoutCard;