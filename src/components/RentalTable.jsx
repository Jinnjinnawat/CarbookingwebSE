import React, { useEffect, useState } from 'react';
import { Table, Button, Dropdown, DropdownButton } from 'react-bootstrap';
import { collection, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';  // นำเข้า db จาก firebaseConfig
import { useNavigate } from 'react-router-dom';  // Import useNavigate from react-router-dom

const RentalTable = () => {
  const [rentals, setRentals] = useState([]);
  const navigate = useNavigate();  // Hook to handle navigation

  useEffect(() => {
    const fetchRentals = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'bookings'));  // Change 'cars' to 'rentals'
        const rentalList = [];
        querySnapshot.forEach((doc) => {
          rentalList.push({ id: doc.id, ...doc.data() });
        });
        setRentals(rentalList);
        console.log("Fetched rentals:", rentalList);  // Log fetched data
      } catch (error) {
        console.error('Error fetching rentals:', error);
      }
    };

    fetchRentals();
  }, []);

  const handleAdd = () => {
    navigate('/addrental');  // Navigate to the /addrental page
  };

  const handleEditStatus = async (rentalId, newStatus) => {
    try {
      const rentalRef = doc(db, 'bookings', rentalId);  // Change 'bookings' to 'rentals'
      await updateDoc(rentalRef, { status: newStatus });
      setRentals(rentals.map(rental => rental.id === rentalId ? { ...rental, status: newStatus } : rental));
    } catch (error) {
      console.error('Error updating rental status:', error);
    }
  };

  const handleDelete = async (rentalId) => {
    try {
      await deleteDoc(doc(db, 'bookings', rentalId));  // Change 'bookings' to 'rentals'
      setRentals(rentals.filter(rental => rental.id !== rentalId));  // Remove the deleted rental from the state
    } catch (error) {
      console.error('Error deleting rental:', error);
    }
  };

  return (
    <div className="container mt-4">
      <center><h2>ข้อมูลการเช่ารถ</h2></center>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>รุ่นรถ</th>
            <th>ทะเบียน</th>
            <th>ชื่อ</th>
            <th>นามสกุล</th>
            <th>วันที่เริ่มจอง</th>
            <th>เวลาเริ่มจอง</th>
            <th>วันสุดท้ายการจอง</th>
            <th>เวลาสุดท้ายการจอง</th>
            <th>สถานะการจอง</th>
            <th>Total Price</th>
            <th>ยกเลิกการเช่า</th>
            
          </tr>
        </thead>
        <tbody>
          {rentals.length > 0 ? (
            rentals.map((rental) => (
              <tr key={rental.id}>
                <td>{rental.carModel}</td>
                <td>{rental.licensePlate}</td>
                <td>{rental.name}</td>
                <td>{rental.surname}</td>
                <td>{rental.startDate}</td>
                <td>{rental.startTime}</td>
                <td>{rental.endDate}</td>
                <td>{rental.endTime}</td>
                <td>
                  <DropdownButton variant="warning" title={rental.status}>
                    <Dropdown.Item onClick={() => handleEditStatus(rental.id, 'Available')}>Available</Dropdown.Item>
                    <Dropdown.Item onClick={() => handleEditStatus(rental.id, 'Rented')}>Rented</Dropdown.Item>
                    <Dropdown.Item onClick={() => handleEditStatus(rental.id, 'Maintenance')}>Maintenance</Dropdown.Item>
                  </DropdownButton>
                </td>
                <td>{rental.totalCost}</td>
               
                <td>
                  <Button variant="danger" onClick={() => handleDelete(rental.id)}>
                    Delete
                  </Button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="10" className="text-center">No rentals found</td>
            </tr>
          )}
        </tbody>
      </Table>
     
    </div>
  );
};

export default RentalTable;
