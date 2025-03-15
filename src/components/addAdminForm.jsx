import React, { useState } from "react";
import { Form, Button, Container, Row, Col, Card } from "react-bootstrap";
import { db } from "../firebaseConfig";
import { collection, addDoc } from "firebase/firestore";

const AddAdminForm = () => {
  const [admin, setAdmin] = useState({
    admin_user: "",
    admin_frname: "",
    admin_lastname: "",
    email: "",
    admin_address: "",
    password: "",
    phone: ""
  });

  const handleChange = (e) => {
    setAdmin({ ...admin, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await addDoc(collection(db, "admin"), admin);
      alert("เพิ่มข้อมูลผู้ดูแลระบบสำเร็จ!");
      setAdmin({
        admin_user: "",
        admin_frname: "",
        admin_lastname: "",
        email: "",
        admin_address: "",
        password: "",
        phone: ""
      });
    } catch (error) {
      console.error("Error adding document: ", error);
      alert("เกิดข้อผิดพลาดในการบันทึกข้อมูล");
    }
  };
  const handleAddAndRedirect = async () => {
    // Assuming you have logic for adding an admin, call the function to add admin here
    await addAdmin(); // This should be the function you use to add an admin
  
    // After adding the admin, navigate to the TableAdmin page
    navigate('/TableAdmin');
  };
  return (
    <Container className="mt-5">
      <Row className="justify-content-md-center">
        <Col md={6}>
          <Card>
            <Card.Body>
              <Card.Title>เพิ่มข้อมูลผู้ดูแลระบบ</Card.Title>
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3" controlId="admin_user">
                  <Form.Label>Username</Form.Label>
                  <Form.Control
                    type="text"
                    name="admin_user"
                    value={admin.admin_user}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="admin_frname">
                  <Form.Label>ชื่อจริง</Form.Label>
                  <Form.Control
                    type="text"
                    name="admin_frname"
                    value={admin.admin_frname}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="admin_lastname">
                  <Form.Label>นามสกุล</Form.Label>
                  <Form.Control
                    type="text"
                    name="admin_lastname"
                    value={admin.admin_lastname}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="email">
                  <Form.Label>อีเมล</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={admin.email}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="admin_address">
                  <Form.Label>ที่อยู่</Form.Label>
                  <Form.Control
                    type="text"
                    name="admin_address"
                    value={admin.admin_address}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="password">
                  <Form.Label>รหัสผ่าน</Form.Label>
                  <Form.Control
                    type="password"
                    name="password"
                    value={admin.password}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="phone">
                  <Form.Label>เบอร์โทรศัพท์</Form.Label>
                  <Form.Control
                    type="text"
                    name="phone"
                    value={admin.phone}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                <Button variant="success" onClick={handleAddAndRedirect} className="mb-3">
  เพิ่มข้อมูลแอดมิน
</Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default AddAdminForm;
