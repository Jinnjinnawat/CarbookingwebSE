import React, { useState, useEffect } from "react";
import { Form, Button, Container, Row, Col, Card } from "react-bootstrap";
import { db } from "../firebaseConfig";
import { doc, getDoc, updateDoc } from "firebase/firestore";  // Make sure to import getDoc
import { useNavigate, useParams } from "react-router-dom";  // Import useParams to get the admin id

const EditAdminForm = () => {
  const [admin, setAdmin] = useState({
    admin_user: "",
    admin_frname: "",
    admin_lastname: "",
    email: "",
    admin_address: "",
    password: "",
    phone: "",
  });

  const navigate = useNavigate();
  const { adminId } = useParams(); // Get the admin ID from the URL params

  useEffect(() => {
    // Fetch the admin data when the component loads
    const fetchAdminData = async () => {
      const adminDocRef = doc(db, "admin", adminId);
      const adminDoc = await getDoc(adminDocRef);
      if (adminDoc.exists()) {
        setAdmin(adminDoc.data());  // Set the admin data in the state
      } else {
        console.log("No such admin!");
      }
    };

    fetchAdminData();
  }, [adminId]);

  const handleChange = (e) => {
    setAdmin({ ...admin, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const adminDocRef = doc(db, "admin", adminId);
      await updateDoc(adminDocRef, admin);
      alert("แก้ไขข้อมูลแอดมินสำเร็จ!");

      // After successfully editing, navigate to the admin table page
      navigate('/AdminTable');
    } catch (error) {
      console.error("Error updating document: ", error);
      alert("เกิดข้อผิดพลาดในการแก้ไขข้อมูล");
    }
  };

  return (
    <Container className="mt-5">
      <Row className="justify-content-md-center">
        <Col md={6}>
          <Card>
            <Card.Body>
              <Card.Title>แก้ไขข้อมูลแอดมิน</Card.Title>
              <Form onSubmit={handleSubmit}>
                {Object.keys(admin).map((key) => (
                  <Form.Group className="mb-3" controlId={key} key={key}>
                    <Form.Label>{key}</Form.Label>
                    <Form.Control
                      type="text"
                      name={key}
                      value={admin[key]}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>
                ))}

                <Button variant="primary" type="submit">บันทึกข้อมูล</Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default EditAdminForm;
