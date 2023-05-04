import { Link } from "react-router-dom";
import { Col } from "react-bootstrap";
import "../ItemCard.css";

const ItemCard = (props) => {
    console.log("itemCardID: " + props.id);

    
  return (
    <Col xs={12} sm={6} md={4} className="mb-4">
      <Link to={`/shop/${props.id}`}>
        <div className="item-card">
          <img src={props.image} alt="" className="item-card-image img-fluid" />
          <h2 className="item-card-price">{props.price}</h2>
        </div>
      </Link>
    </Col>
  );
};

export default ItemCard;