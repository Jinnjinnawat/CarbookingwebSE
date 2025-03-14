import React, { useState } from "react";
import { Container, Table, Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const daysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();

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
                <td key={index} className={day ? "bg-light text-center border p-4" : "bg-secondary text-white border p-4"}>
                  {day || ""}
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
