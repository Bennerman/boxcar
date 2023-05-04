import React from 'react';
import { getAuth, signOut } from 'firebase/auth';
import { initializeApp } from 'firebase/app';
import { useNavigate } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

const AccountScreen = () => {
  const navigate = useNavigate();

  const firebaseConfig = require('../firebaseConfig');

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);

  // Initialize Firebase Authentication and get a reference to the service
  const auth = getAuth(app);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/');
    } catch (error) {
      console.error('Error logging out', error);
    }
  };

  const handleOrderTracking = () => {
    // Navigate to the order tracking component
    navigate('/orders');
  };

  const handleSecurity = () => {
    // Navigate to the security settings component
    navigate('/security');
  };

  return (
    <Container className="mt-5" style={{justifyContent: "center"}}>
      <h1 className="mb-4">Account Screen</h1>
      <Row className="mb-4">
        <Col>
          <Button variant="primary" className="mr-3" onClick={handleOrderTracking}>Track Orders</Button>
          <Button variant="primary" className="mr-3" onClick={handleSecurity}>Security Settings</Button>
        </Col>
    </Row>
        <Row className="d-flex justify-content-end">
            <Col>
                <Button variant="danger" onClick={handleLogout}>Log Out</Button>

            </Col>
        </Row>
      
    </Container>
  );
};

export default AccountScreen;
