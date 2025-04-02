import React, { useState } from "react";
import { Form, Button, Container, Row, Col } from "react-bootstrap";
import { db } from "../firebaseConfig";
import { collection, addDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom"; // Import useNavigate

const Register = () => {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    address: "",
    license_no: "",
    phone: "",
  });

  const navigate = useNavigate(); // Initialize useNavigate

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const userData = { ...formData, status: "1" };
      const docRef = await addDoc(collection(db, "customers"), userData);
      console.log("Document written with ID: ", docRef.id);
      alert("Registered Successfully!");

      setFormData({
        first_name: "",
        last_name: "",
        email: "",
        password: "",
        address: "",
        license_no: "",
        phone: "",
      });

      navigate("/Login"); // Navigate to /Login after successful registration
    } catch (error) {
      console.error("Error adding document: ", error);
      alert("Registration Failed!");
    }
  };

  return (
    <Container className="mt-5">
      <Row className="justify-content-md-center">
        <Col md={6}>
          <h2 className="text-center">Register</h2>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="formFirstName">
              <Form.Label>ชื่อจริง</Form.Label>
              <Form.Control type="text" name="first_name" value={formData.first_name} onChange={handleChange} required />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formLastName">
              <Form.Label>นามสกุล</Form.Label>
              <Form.Control type="text" name="last_name" value={formData.last_name} onChange={handleChange} required />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formEmail">
              <Form.Label>อีเมล</Form.Label>
              <Form.Control type="email" name="email" value={formData.email} onChange={handleChange} required />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formPassword">
              <Form.Label>รหัสผ่าน</Form.Label>
              <Form.Control type="password" name="password" value={formData.password} onChange={handleChange} required />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formAddress">
              <Form.Label>ที่อยู่</Form.Label>
              <Form.Control type="text" name="address" value={formData.address} onChange={handleChange} required />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formLicenseNo">
              <Form.Label>เลขใบขับขี่</Form.Label>
              <Form.Control type="text" name="license_no" value={formData.license_no} onChange={handleChange} required />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formPhone">
              <Form.Label>เบอร์โทรศัพท์</Form.Label>
              <Form.Control type="text" name="phone" value={formData.phone} onChange={handleChange} required />
            </Form.Group>

            <Button variant="primary" type="submit" className="w-100">
              ลงทะเบียน
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default Register;