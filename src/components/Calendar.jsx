import React, { useState, useEffect } from "react";
import { Container, Table, Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { db } from '../firebaseConfig'; // นำเข้า db จาก firebaseConfig
import { collection, getDocs } from 'firebase/firestore';

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [rentals, setRentals] = useState([]);  // สถานะการเช่า
  const daysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();

  useEffect(() => {
    const fetchRentals = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'bookings'));
        const rentalList = [];
        querySnapshot.forEach((doc) => {
          rentalList.push({ id: doc.id, ...doc.data() });
        });
        setRentals(rentalList);
      } catch (error) {
        console.error('Error fetching rentals:', error);
      }
    };

    fetchRentals();
  }, []);

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const days = daysInMonth(year, month);
  const startDay = firstDayOfMonth(year, month);

  const daysArray = Array.from({ length: days }, (_, i) => i + 1);
  const emptyDays = Array(startDay).fill(null);
  const calendarDays = [...emptyDays, ...daysArray];

  // ฟังก์ชันตรวจสอบว่า วันที่ในปฏิทินอยู่ในช่วงวันจองหรือไม่
  const isBookedOnDay = (day) => {
    const dateString = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    const rental = rentals.find(rental =>
      (new Date(rental.startDate) <= new Date(dateString)) && (new Date(rental.endDate) >= new Date(dateString))
    );
    return rental ? rental.name : null;
  };

  // ฟังก์ชันกำหนดสีพื้นหลังของวันที่จอง
  const getDayBackgroundColor = (day) => {
    if (isBookedOnDay(day)) {
      return "bg-success text-white";  // วันที่มีการจองจะใช้สีเขียว
    }
    return "bg-light";  // วันที่ว่างจะใช้สีพื้นหลังปกติ
  };

  return (
    <Container fluid className="mt-4 text-center vh-100 d-flex flex-column justify-content-center align-items-center">
      <h2>
        {currentDate.toLocaleString("default", { month: "long" })} {year}
      </h2>
      <div className="d-flex justify-content-between my-2 w-100 px-5">
        <Button variant="primary" onClick={prevMonth}>&lt; Prev</Button>
        <Button variant="primary" onClick={nextMonth}>Next &gt;</Button>
      </div>
      <Table bordered hover className="calendar-table w-100" style={{ maxWidth: "1200px" }}>
        <thead>
          <tr>
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <th key={day} className="text-center">{day}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {[...Array(Math.ceil(calendarDays.length / 7))].map((_, weekIndex) => (
            <tr key={weekIndex}>
              {calendarDays.slice(weekIndex * 7, weekIndex * 7 + 7).map((day, index) => (
                <td key={index} className={`${day ? getDayBackgroundColor(day) : "bg-secondary text-white"} text-center border p-4`}>
                  {day || ""}
                  <div className="mt-2">
                    {isBookedOnDay(day) && (
                      <span>{isBookedOnDay(day)}</span>  // แสดงชื่อผู้เช่าหากวันที่อยู่ในช่วงการจอง
                    )}
                  </div>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};

export default Calendar;
