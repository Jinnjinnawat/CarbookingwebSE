import React, { useEffect, useState } from "react";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import { db } from "../firebaseConfig";
import { collection, getDocs } from "firebase/firestore";
import Badge from "react-bootstrap/Badge";
import { useNavigate } from "react-router-dom";  // นำเข้า useNavigate

function GroupExample() {
  const [cars, setCars] = useState([]);
  const navigate = useNavigate(); // สร้าง instance ของ useNavigate

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "cars"));
        const carList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setCars(carList);
      } catch (error) {
        console.error("Error fetching cars: ", error);
      }
    };

    fetchCars();
  }, []);

  const handleBookCar = (carId) => {
    // เมื่อคลิกปุ่ม จองรถ จะนำทางไปยัง '/carform' พร้อมกับพารามิเตอร์ carId
    navigate(`/carform/${carId}`);
  };

  return (
    <div className="d-flex flex-wrap">
      {cars.map((car) => (
        <Card key={car.id} style={{ width: "18rem", margin: "1rem" }}>
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
              onClick={() => handleBookCar(car.id)}  // คลิกปุ่มแล้วนำไปที่ /carform/${carId}
              style={{ height: "50px" }} // กำหนดความสูงของปุ่มให้เท่ากัน
            >
              จองรถ
            </Button>
          </Card.Body>
          <Card.Footer>
            <small className="text-muted">
              <strong>สถานะ:</strong> 
              <Badge 
                pill 
                bg={car.status === "available" ? "success" : "secondary"} 
                className="ms-2"
              >
                {car.status === "available" ? "Available" : "Not Available"}
              </Badge>
            </small>
          </Card.Footer>
        </Card>
      ))}
    </div>
  );
}

export default GroupExample;
