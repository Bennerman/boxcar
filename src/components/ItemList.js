import ItemCard from "./ItemCard";
import { Container, Row } from "react-bootstrap";

const ItemList = (props) => {
    return (
      <Container>
        <Row xs={1} sm={2} md={3}>
          {props.items.map((item) => (
            <ItemCard key={item.id} id={item.id} image={item.image} price={item.price} />
          ))}
        </Row>
      </Container>
    );
  };
  
  export default ItemList;