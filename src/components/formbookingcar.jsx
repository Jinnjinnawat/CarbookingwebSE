import React, { useState, useEffect } from "react";
import { Form, Button, Container, Row, Col, Card } from "react-bootstrap";

const CarRentalForm = () => {
  const [rentalDate, setRentalDate] = useState("");
  const [rentalTime, setRentalTime] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [returnTime, setReturnTime] = useState("");
  const [totalDuration, setTotalDuration] = useState("");

  useEffect(() => {
    if (rentalDate && rentalTime && returnDate && returnTime) {
      const start = new Date(`${rentalDate}T${rentalTime}`);
      const end = new Date(`${returnDate}T${returnTime}`);
      const diff = end - start;
      if (diff > 0) {
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        setTotalDuration(`${days} วัน ${hours} ชั่วโมง`);
      } else {
        setTotalDuration("ข้อมูลวันที่หรือเวลาไม่ถูกต้อง");
      }
    } else {
      setTotalDuration("");
    }
  }, [rentalDate, rentalTime, returnDate, returnTime]);

  const handleTimeChange = (setter) => (e) => {
    const time = e.target.value;
    const [hours, minutes] = time.split(":").map(Number);
    if (minutes % 30 !== 0) {
      alert("กรุณาเลือกเวลาที่เป็นช่วงครึ่งชั่วโมง เช่น 09:00 หรือ 09:30");
    } else {
      setter(time);
    }
  };

  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col md={6}>
          <Card className="shadow-lg p-4">
            <Card.Title className="text-center mb-4">แบบฟอร์มเช่ารถ</Card.Title>
            <Form>
              <Form.Group className="mb-3" controlId="name">
                <Form.Label>ชื่อ-นามสกุล</Form.Label>
                <Form.Control type="text" placeholder="กรอกชื่อของคุณ" required />
              </Form.Group>
              
              <Form.Group className="mb-3" controlId="phone">
                <Form.Label>เบอร์โทร</Form.Label>
                <Form.Control type="tel" placeholder="กรอกเบอร์โทร" required />
              </Form.Group>
              
              <Form.Group className="mb-3" controlId="email">
                <Form.Label>อีเมล</Form.Label>
                <Form.Control type="email" placeholder="กรอกอีเมล" required />
              </Form.Group>
              
              <Form.Group className="mb-3" controlId="carType">
                <Form.Label>เลือกรถที่ต้องการเช่า</Form.Label>
                <Form.Select>
                  <option>-- กรุณาเลือก --</option>
                  <option>Honda City</option>
                  <option>Toyota Altis</option>
                  <option>Ford Ranger</option>
                </Form.Select>
              </Form.Group>
              
              <Form.Group className="mb-3" controlId="rentalDate">
                <Form.Label>วันที่เริ่มเช่า</Form.Label>
                <Form.Control type="date" value={rentalDate} onChange={(e) => setRentalDate(e.target.value)} required />
              </Form.Group>
              
              <Form.Group className="mb-3" controlId="rentalTime">
                <Form.Label>เวลาที่ต้องการเช่า</Form.Label>
                <Form.Control type="time" value={rentalTime} onChange={handleTimeChange(setRentalTime)} required />
              </Form.Group>
              
              <Form.Group className="mb-3" controlId="returnDate">
                <Form.Label>วันที่คืนรถ</Form.Label>
                <Form.Control type="date" value={returnDate} onChange={(e) => setReturnDate(e.target.value)} required />
              </Form.Group>
              
              <Form.Group className="mb-3" controlId="returnTime">
                <Form.Label>เวลาที่คืนรถ</Form.Label>
                <Form.Control type="time" value={returnTime} onChange={handleTimeChange(setReturnTime)} required />
              </Form.Group>
              
              <Form.Group className="mb-3">
                <Form.Label>ระยะเวลาการเช่า</Form.Label>
                <Form.Control type="text" value={totalDuration} readOnly />
              </Form.Group>
              
              <Button variant="primary" type="submit" className="w-100">
                ส่งข้อมูล
              </Button>
            </Form>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default CarRentalForm;
