import React, { useEffect, useState } from "react";
import { Container, Card, Row, Col, Spinner, Button } from "react-bootstrap";
import { db } from '../firebaseConfig';
import { collection, query, where, getDocs } from "firebase/firestore";
import { Link } from 'react-router-dom'; // Import Link

const Profile = () => {
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCustomerData = async () => {
      try {
        const storedUser = JSON.parse(localStorage.getItem('user'));
        if (storedUser && storedUser.email) {
          const customerQuery = query(collection(db, "customers"), where("email", "==", storedUser.email));
          const customerSnapshot = await getDocs(customerQuery);

          if (!customerSnapshot.empty) {
            setCustomer(customerSnapshot.docs[0].data());
          } else {
            console.log("No customer found with that email.");
          }
        } else {
          console.log("User data not found in localStorage.");
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching customer data:", error);
        setLoading(false);
      }
    };

    fetchCustomerData();
  }, []);

  if (loading) {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ height: "100vh" }}>
        <Spinner animation="border" />
      </Container>
    );
  }

  if (!customer) {
    return <p className="text-center">No customer data available.</p>;
  }

  return (
    <Container className="mt-5">
      <Card>
        <Card.Header as="h5">Profile</Card.Header>
        <Card.Body>
          <Row>
            <Col md={6}><strong>First Name:</strong> {customer.first_name}</Col>
            <Col md={6}><strong>Last Name:</strong> {customer.last_name}</Col>
          </Row>
          <Row className="mt-3">
            <Col md={6}><strong>Email:</strong> {customer.email}</Col>
            <Col md={6}><strong>Phone:</strong> {customer.phone}</Col>
          </Row>
          <Row className="mt-3">
            <Col><strong>Address:</strong> {customer.address}</Col>
          </Row>
          <Row className="mt-3">
            <Col><strong>License No:</strong> {customer.license_no}</Col>
          </Row>
          <Row className="mt-3">
            <Col className="text-center">
              <Link to="/edit-profile">
                <Button variant="primary">แก้ไขข้อมูล</Button>
              </Link>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Profile;