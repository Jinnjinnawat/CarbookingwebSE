import React, { useEffect, useState } from "react";
import { db } from "../firebaseConfig";
import { collection, getDocs, query, where } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Badge from "react-bootstrap/Badge";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Spinner from "react-bootstrap/Spinner";

function GroupExample() {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endDate, setEndDate] = useState("");
  const [endTime, setEndTime] = useState("");
  const [totalDays, setTotalDays] = useState(0);
  const [bookedCars, setBookedCars] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (startDate && startTime && endDate && endTime) {
      fetchCars();
      fetchBookedCars(); // Fetch booked cars only when dates and times are selected
    }
  }, [startDate, startTime, endDate, endTime]); // Trigger fetch when date/time changes

  useEffect(() => {
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const diffTime = end - start;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      setTotalDays(diffDays > 0 ? diffDays : 0);
    } else {
      setTotalDays(0);
    }
  }, [startDate, endDate]);

  const fetchCars = async () => {
    setLoading(true);
    try {
      const querySnapshot = await getDocs(collection(db, "cars"));
      const carList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        status: "Available", // Default status
      }));
      setCars(carList);
    } catch (error) {
      console.error("Error fetching cars: ", error);
    }
    setLoading(false);
  };

  // Fetch booked cars from database
  const fetchBookedCars = async () => {
    try {
      const q = query(collection(db, "bookings"));
      const querySnapshot = await getDocs(q);
      const bookedList = querySnapshot.docs.map((doc) => doc.data());
      setBookedCars(bookedList);

      // Update car statuses based on bookings
      const updatedCars = cars.map((car) => {
        const isBooked = isCarBooked(car.id);
        return {
          ...car,
          status: isBooked ? "Booked" : "Available",
        };
      });
      setCars(updatedCars);
    } catch (error) {
      console.error("Error fetching booked cars: ", error);
    }
  };

  // Function to check if car is booked during the selected period
  const isCarBooked = (carId) => {
    return bookedCars.some((booking) => {
      const bookingStart = new Date(booking.startDate + "T" + booking.startTime);
      const bookingEnd = new Date(booking.endDate + "T" + booking.endTime);
      const selectedStart = new Date(startDate + "T" + startTime);
      const selectedEnd = new Date(endDate + "T" + endTime);

      // Check if the selected period overlaps with the booking
      return (
        (selectedStart >= bookingStart && selectedStart <= bookingEnd) ||
        (selectedEnd >= bookingStart && selectedEnd <= bookingEnd) ||
        (selectedStart <= bookingStart && selectedEnd >= bookingEnd)
      );
    });
  };

  const handleBookCar = (carId, carModel, licensePlate, pricePerDay) => {
    if (!startDate || !startTime || !endDate || !endTime) {
      alert("กรุณาเลือกวันและเวลาที่เริ่มเช่า และวันสุดท้ายที่เช่าให้ครบถ้วน");
      return;
    }
    navigate(`/carform/${carId}`, {
      state: {
        startDate,
        startTime,
        endDate,
        endTime,
        carModel,
        licensePlate,
        pricePerDay,
      },
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

        <Row className="mb-4">
          <Col md={12}>
            <Form.Label>จำนวนวันที่เช่า</Form.Label>
            <Form.Control type="text" value={totalDays} readOnly />
          </Col>
        </Row>
      </Form>

      {loading ? (
        <div className="text-center my-4">
          <Spinner animation="border" />
        </div>
      ) : startDate && startTime && endDate && endTime ? (
        <Row>
          {cars
            .filter((car) => car.status === "Available") // Filter out cars that are already booked
            .map((car) => {
              return (
                <Col key={car.id} md={4} className="d-flex">
                  <Card style={{ width: "100%", marginBottom: "1rem" }}>
                    <Card.Img
                      variant="top"
                      src={car.img_car || "https://via.placeholder.com/150"}
                      style={{ height: "200px", objectFit: "cover" }}
                    />
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
                      >
                        จองรถ
                      </Button>
                    </Card.Body>
                    <Card.Footer>
                      <small className="text-muted">
                        <strong>สถานะ:</strong>
                        <Badge pill bg="success" className="ms-2">
                          Available
                        </Badge>
                      </small>
                    </Card.Footer>
                  </Card>
                </Col>
              );
            })}
        </Row>
      ) : (
        <div className="text-center my-4">กรุณาเลือกวันและเวลาเพื่อดูข้อมูลรถ</div>
      )}
    </Container>
  );
}

export default GroupExample;
