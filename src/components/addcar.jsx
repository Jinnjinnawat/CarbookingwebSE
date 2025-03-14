import React, { useState } from "react";
import { Form, Button, Container, Row, Col, Card } from "react-bootstrap";
import { db } from "../firebaseConfig";
import { collection, addDoc } from "firebase/firestore";

const AddCarForm = () => {
  const [car, setCar] = useState({
    brand: "",
    price_per_day: "",  // ✅ เปลี่ยนให้ตรงกับ name ใน Form
    license_plate: "",
    img_car: "",
    model: "",
    status: "available",
  });

  const handleChange = (e) => {
    setCar({ ...car, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await addDoc(collection(db, "cars"), car);
      alert("เพิ่มข้อมูลรถสำเร็จ!");
      setCar({
        brand: "",
        price_per_day: "",
        license_plate: "",
        img_car: "",
        model: "",
        status: "available",
      });
    } catch (error) {
      console.error("Error adding document: ", error);
      alert("เกิดข้อผิดพลาดในการบันทึกข้อมูล");
    }
  };

  return (
    <Container className="mt-5">
      <Row className="justify-content-md-center">
        <Col md={6}>
          <Card>
            <Card.Body>
              <Card.Title>เพิ่มข้อมูลรถ</Card.Title>
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3" controlId="brand">
                  <Form.Label>แบนด์</Form.Label>
                  <Form.Control
                    type="text"
                    name="brand"
                    value={car.brand}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="price_per_day">
                  <Form.Label>ราคาต่อวัน</Form.Label>
                  <Form.Control
                    type="number"
                    name="price_per_day"  // ✅ เปลี่ยนให้ตรงกับ useState
                    value={car.price_per_day}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="license_plate">
                  <Form.Label>ทะเบียนรถ</Form.Label>
                  <Form.Control
                    type="text"
                    name="license_plate"  // ✅ เปลี่ยนให้ตรงกับ useState
                    value={car.license_plate}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="img_car">
                  <Form.Label>ลิงก์รูปรถ</Form.Label>
                  <Form.Control
                    type="text"
                    name="img_car"  // ✅ เปลี่ยนให้ตรงกับ useState
                    value={car.img_car}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="model">
                  <Form.Label>รุ่น</Form.Label>
                  <Form.Control
                    type="text"
                    name="model"
                    value={car.model}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="status">
                  <Form.Label>สถานะ</Form.Label>
                  <Form.Select name="status" value={car.status} onChange={handleChange}>
                    <option value="available">ว่าง</option>
                    <option value="rented">ถูกเช่า</option>
                    <option value="maintenance">ซ่อมบำรุง</option>
                  </Form.Select>
                </Form.Group>

                <Button variant="primary" type="submit">บันทึกข้อมูล</Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default AddCarForm;