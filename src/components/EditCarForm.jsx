import React, { useState, useEffect } from "react";
import { Form, Button, Container, Row, Col, Card } from "react-bootstrap";
import { db } from "../firebaseConfig";
import { doc, getDoc, updateDoc } from "firebase/firestore";  // Make sure to import getDoc
import { useNavigate, useParams } from "react-router-dom";  // Import useParams to get the car id

const EditCarForm = () => {
  const [car, setCar] = useState({
    brand: "",
    price_per_day: "",
    license_plate: "",
    img_car: "",
    model: "",
    status: "available",
  });

  const navigate = useNavigate();
  const { carId } = useParams(); // Get the car ID from the URL params

  useEffect(() => {
    // Fetch the car data when the component loads
    const fetchCarData = async () => {
      const carDocRef = doc(db, "cars", carId);
      const carDoc = await getDoc(carDocRef);
      if (carDoc.exists()) {
        setCar(carDoc.data());  // Set the car data in the state
      } else {
        console.log("No such car!");
      }
    };

    fetchCarData();
  }, [carId]);

  const handleChange = (e) => {
    setCar({ ...car, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const carDocRef = doc(db, "cars", carId);
      await updateDoc(carDocRef, car);
      alert("แก้ไขข้อมูลรถสำเร็จ!");
      
      // After successfully editing, navigate to the table page
      navigate('/Tablecar');
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
              <Card.Title>แก้ไขข้อมูลรถ</Card.Title>
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
                    name="price_per_day"
                    value={car.price_per_day}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="license_plate">
                  <Form.Label>ทะเบียนรถ</Form.Label>
                  <Form.Control
                    type="text"
                    name="license_plate"
                    value={car.license_plate}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="img_car">
                  <Form.Label>ลิงก์รูปรถ</Form.Label>
                  <Form.Control
                    type="text"
                    name="img_car"
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

export default EditCarForm;
