import React, { useEffect, useState } from "react";
import { db } from "../firebaseConfig";
import { collection, getDocs, query } from "firebase/firestore";
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
  const navigate = useNavigate();

  // Effect to fetch cars and update status
  useEffect(() => {
    if (startDate && endDate && startTime && endTime) {
      fetchCars();
    }
  }, [startDate, startTime, endDate, endTime]);

  // Effect to calculate total days between start and end date
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

  // Fetch available cars from Firestore
  // Fetch available cars from Firestore
const fetchCars = async () => {
  setLoading(true);
  try {
    const querySnapshot = await getDocs(collection(db, "cars"));
    const bookingsSnapshot = await getDocs(collection(db, "bookings")); // ดึงข้อมูลการจอง

    const bookedCars = bookingsSnapshot.docs.map((doc) => doc.data().carId); // ดึง carId จาก bookings ที่ถูกจอง

    const carList = querySnapshot.docs.map((doc) => {
      const car = doc.data();
      const isBooked = bookedCars.includes(doc.id); // ตรวจสอบว่า car ถูกจองหรือยัง
      return {
        id: doc.id,
        ...car,
        status: isBooked ? "Booked" : "Available", // ถ้าถูกจองให้ตั้งสถานะเป็น "Booked" ถ้าไม่จองเป็น "Available"
      };
    });

    setCars(carList);
  } catch (error) {
    console.error("Error fetching cars: ", error);
  }
  setLoading(false);
};

  // Fetch bookings, maintenance, and pending approval data
  const fetchBookedCars = async (carList) => {
    try {
      const [bookingsSnapshot, maintenanceSnapshot, pendingApprovalSnapshot] = await Promise.all([
        getDocs(query(collection(db, "bookings"))),
        getDocs(query(collection(db, "maintenance"))),
        getDocs(query(collection(db, "pending Approval"))),
      ]);

      const bookedList = bookingsSnapshot.docs.map((doc) => doc.data());
      const maintenanceList = maintenanceSnapshot.docs.map((doc) => doc.data());
      const pendingApprovalList = pendingApprovalSnapshot.docs.map((doc) => doc.data());

      updateCarStatus(bookedList, maintenanceList, pendingApprovalList, carList);
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
  };

  // Update car status based on booking, maintenance, and pending approval
const updateCarStatus = (bookedList, maintenanceList, pendingApprovalList) => {
  const updatedCars = cars.map((car) => {
    let status = car.status; // ใช้ status ที่ได้จากการดึงข้อมูล `fetchCars`

    // Check Maintenance Status
    const isMaintenance = maintenanceList.some((maintenance) => maintenance.carId === car.id);
    if (isMaintenance) status = "Maintenance";

    // Check Pending Approval Status
    const isPendingApproval = pendingApprovalList.some((approval) => approval.carId === car.id);
    if (isPendingApproval) status = "Pending Approval";

    return { ...car, status };
  });

  setCars(updatedCars); // Update the cars with new statuses
};


  const handleBookCar = (carId, carModel, licensePlate, pricePerDay) => {
    navigate(`/carform/${carId}`, {
      state: { startDate, startTime, endDate, endTime, carModel, licensePlate, pricePerDay },
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
                    <Button variant="primary" onClick={() => handleBookCar(car.id, car.model, car.license_plate, car.price_per_day)} className="w-100">จองรถ</Button>
                  </Card.Body>
                  <Card.Footer>
                    <small className="text-muted">
                      <strong>สถานะ:</strong>
                      <Badge pill bg={car.status === "Available" ? "success" :
                        car.status === "Booked" ? "danger" :
                        car.status === "Maintenance" ? "warning" :
                        "info"} className="ms-2">{car.status}</Badge>
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
