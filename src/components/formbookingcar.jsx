import React, { useState, useEffect } from "react";
import { Form, Button, Container, Row, Col, Card } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import { db } from "../firebaseConfig";
import { collection, addDoc } from "firebase/firestore";

const CarRentalForm = () => {
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [totalCost, setTotalCost] = useState(0);
  const [pricePerDay, setPricePerDay] = useState(0);

  const location = useLocation();
  const navigate = useNavigate();

  const { 
    carId, startDate, startTime, endDate, endTime, 
    licensePlate, carModel, pricePerDay: carPricePerDay 
  } = location.state || {};

  useEffect(() => {
    if (carPricePerDay) setPricePerDay(carPricePerDay);
  }, [carPricePerDay]);

  const handleCalculateCost = () => {
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const diffTime = end - start;
      const totalDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      const cost = totalDays * pricePerDay;
      setTotalCost(cost);
    }
  };

  useEffect(() => {
    handleCalculateCost();
  }, [startDate, endDate, pricePerDay]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!name || !surname || !phone || !email) {
      alert("กรุณากรอกข้อมูลให้ครบถ้วน");
      return;
    }

    try {
      await addDoc(collection(db, "bookings"), {
        carId, 
        name,
        surname,
        phone,
        email,
        startDate,
        startTime,
        endDate,
        endTime,
        licensePlate,
        carModel,
        totalCost,
        pricePerDay,
        status: "Pending Approval", 
        createdAt: new Date(),
      });

      alert("จองรถเรียบร้อยแล้ว!");

      // Reset form
      setName("");
      setSurname("");
      setPhone("");
      setEmail("");

      // นำทางไปหน้ารายการจองหลังจากสำเร็จ
      navigate(`/bookings/${carId}`);

    } catch (error) {
      console.error("Error saving data: ", error);
      alert("เกิดข้อผิดพลาดขณะบันทึกข้อมูล กรุณาลองใหม่อีกครั้ง");
    }
  };

  return (
    <Container>
      <Row>
        <Col>
          <Card className="mt-5 p-4 shadow-sm">
            <Card.Body>
              <h4>Car Rental Booking</h4>
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>First Name</Form.Label>
                  <Form.Control type="text" value={name} onChange={(e) => setName(e.target.value)} />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Last Name</Form.Label>
                  <Form.Control type="text" value={surname} onChange={(e) => setSurname(e.target.value)} />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Phone Number</Form.Label>
                  <Form.Control type="text" value={phone} onChange={(e) => setPhone(e.target.value)} />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>License Plate</Form.Label>
                  <Form.Control type="text" value={licensePlate || "No Data"} readOnly />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Car Model</Form.Label>
                  <Form.Control type="text" value={carModel || "No Data"} readOnly />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Total Cost</Form.Label>
                  <Form.Control type="text" value={totalCost ? `${totalCost} THB` : "No Data"} readOnly />
                </Form.Group>

                <Button variant="primary" type="submit" className="w-100">Submit</Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default CarRentalForm;