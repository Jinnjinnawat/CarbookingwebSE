// RentalTable.jsx
import React, { useEffect, useState } from 'react';
import { Table, Button } from 'react-bootstrap';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../firebaseConfig';  // นำเข้า db จาก firebaseConfig
import { useNavigate } from 'react-router-dom';  // Import useNavigate from react-router-dom

const RentalTable = () => {
  const [rentals, setRentals] = useState([]);
  const navigate = useNavigate();  // Hook to handle navigation

  useEffect(() => {
    const fetchRentals = async () => {
      const querySnapshot = await getDocs(collection(db, 'rentals'));  // Change 'cars' to 'rentals'
      const rentalList = [];
      querySnapshot.forEach((doc) => {
        rentalList.push({ id: doc.id, ...doc.data() });
      });
      setRentals(rentalList);
    };

    fetchRentals();
  }, []);

  const handleAdd = () => {
    // Navigate to the /addrental page when the "เพิ่มข้อมูลการเช่ารถ" button is clicked
    navigate('/addrental');
  };

  const handleEdit = (rentalId) => {
    // Navigate to the edit page for the selected rental
    navigate(`/editrental/${rentalId}`);
  };

  const handleDelete = async (rentalId) => {
    try {
      await deleteDoc(doc(db, 'rentals', rentalId));  // Change to 'rentals' collection
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
            <th>Car ID</th>
            <th>Customer ID</th>
            <th>Status</th>
            <th>Start Date</th>
            <th>End Date</th>
            <th>Total Price</th>
            <th>แก้ไขข้อมูล</th>
            <th>ลบข้อมูล</th>
          </tr>
        </thead>
        <tbody>
          {rentals.map((rental) => (
            <tr key={rental.id}>
              <td>{rental.car_id}</td>
              <td>{rental.customer_id}</td>
              <td>{rental.status}</td>
              <td>{new Date(rental.start_date.seconds * 1000).toLocaleDateString()}</td> {/* Convert Firestore timestamp to Date */}
              <td>{new Date(rental.end_date.seconds * 1000).toLocaleDateString()}</td> {/* Convert Firestore timestamp to Date */}
              <td>{rental.total_price}</td>
              <td>
                <Button variant="warning" onClick={() => handleEdit(rental.id)} className="me-2">
                  Edit
                </Button>
              </td>
              <td>
                <Button variant="danger" onClick={() => handleDelete(rental.id)}>
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default RentalTable;
