import React, { useEffect, useState } from "react";
import { db } from "../firebaseConfig";
import { collection, getDocs } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { Form, Button, Card, Badge, Container, Row, Col, Spinner } from "react-bootstrap";

function GroupExample() {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endDate, setEndDate] = useState("");
  const [endTime, setEndTime] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (startDate && endDate && startTime && endTime) {
      fetchCars();
    }
  }, [startDate, startTime, endDate, endTime]);

  const fetchCars = async () => {
    setLoading(true);
    try {
      const querySnapshot = await getDocs(collection(db, "cars"));
      const bookingsSnapshot = await getDocs(collection(db, "bookings"));

      const bookedCars = bookingsSnapshot.docs.map((doc) => {
        const data = doc.data();
        return { carId: data.carId, status: data.status };
      });

      const carList = querySnapshot.docs.map((doc) => {
        const car = doc.data();
        const booking = bookedCars.find((b) => b.carId === doc.id);
        let carStatus = "Available";

        if (booking) {
          if (booking.status === "approve") {
            carStatus = "Booked"; // 🚫 ถูกจองแล้ว
          } else if (booking.status === "Pending Approval") {
            carStatus = "Pending"; // 🟡 รอดำเนินการ
          }
        }

        return {
          id: doc.id,
          ...car,
          status: carStatus,
        };
      });

      setCars(carList);
    } catch (error) {
      console.error("Error fetching cars: ", error);
    }
    setLoading(false);
  };

  const handleBookCar = (carId, carModel, licensePlate, pricePerDay) => {
    navigate(`/carform/${carId}`, {
      state: { startDate, startTime, endDate, endTime, carModel, licensePlate, pricePerDay, carId },
    });
  };

  return (
    <Container>
      <h3 className="mb-4 text-center">เช่ารถ</h3>
      <Form>
        <Row className="mb-4">
          <Col md={6}>
            <Form.Label>วันที่เริ่มเช่า</Form.Label>
            <Form.Control type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
          </Col>
          <Col md={6}>
            <Form.Label>เวลาเริ่มเช่า</Form.Label>
            <Form.Control type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} />
          </Col>
        </Row>
        <Row className="mb-4">
          <Col md={6}>
            <Form.Label>วันที่คืนรถ</Form.Label>
            <Form.Control type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
          </Col>
          <Col md={6}>
            <Form.Label>เวลาคืนรถ</Form.Label>
            <Form.Control type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} />
          </Col>
        </Row>
      </Form>
      {loading ? (
        <div className="text-center my-4">
          <Spinner animation="border" />
        </div>
      ) : (
        <Row>
          {cars.length > 0 ? (
            cars.map((car) => (
              <Col key={car.id} md={4} className="d-flex">
                <Card style={{ width: "100%", marginBottom: "1rem" }}>
                  <Card.Img variant="top" src={car.img_car || "https://via.placeholder.com/150"} style={{ height: "200px", objectFit: "cover" }} />
                  <Card.Body>
                    <Card.Title>{car.brand} {car.model}</Card.Title>
                    <Card.Text>
                      <strong>ทะเบียน:</strong> {car.license_plate} <br />
                      <strong>ราคา:</strong> {car.price_per_day} บาท/วัน
                    </Card.Text>
                    <Button 
                      variant="primary" 
                      onClick={() => handleBookCar(car.id, car.model, car.license_plate, car.price_per_day)}
                      className="w-100"
                      disabled={car.status === "Booked" || car.status === "Pending"} // 🚫 ปิดการจองถ้า "Booked" หรือ "Pending"
                    >
                      {car.status === "Booked" ? "รถถูกจองแล้ว" : car.status === "Pending" ? "รอดำเนินการ" : "จองรถ"}
                    </Button>
                  </Card.Body>
                  <Card.Footer>
                    <small className="text-muted">
                      <strong>สถานะ:</strong>
                      <Badge pill bg={car.status === "Available" ? "success" :
                        car.status === "Booked" ? "danger" :
                        car.status === "Pending" ? "warning" : "info"} className="ms-2">
                        {car.status === "Booked" ? "ถูกจองแล้ว" : car.status === "Pending" ? "รอดำเนินการ" : "ว่าง"}
                      </Badge>
                    </small>
                  </Card.Footer>
                </Card>
              </Col>
            ))
          ) : (
            <div className="text-center w-100">
              <h5>ไม่พบรถที่สามารถจองได้ในช่วงเวลานี้</h5>
            </div>
          )}
        </Row>
      )}
    </Container>
  );
}

export default GroupExample;
