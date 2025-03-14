// VehicleTable.jsx
import React, { useEffect, useState } from 'react';
import { Table, Button } from 'react-bootstrap';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../firebaseConfig';  // นำเข้า db จาก firebaseConfig
import { useNavigate } from 'react-router-dom';  // Import useNavigate from react-router-dom

const VehicleTable = () => {
  const [vehicles, setVehicles] = useState([]);
  const navigate = useNavigate();  // Hook to handle navigation

  useEffect(() => {
    const fetchVehicles = async () => {
      const querySnapshot = await getDocs(collection(db, 'cars'));
      const vehicleList = [];
      querySnapshot.forEach((doc) => {
        vehicleList.push({ id: doc.id, ...doc.data() });
      });
      setVehicles(vehicleList);
    };

    fetchVehicles();
  }, []);

  const handleAdd = () => {
    // Navigate to the /addcar page when the "เพิ่มข้อมูลรถ" button is clicked
    navigate('/addcar');
  };

  const handleEdit = (vehicleId) => {
    // Add the logic for handling edit (e.g., redirect to an edit page or open a modal)
    console.log('Edit vehicle with id:', vehicleId);
    // Example: navigate to an edit page (adjust the path as needed)
    navigate(`/editcar/${vehicleId}`);
  };

  const handleDelete = async (vehicleId) => {
    try {
      await deleteDoc(doc(db, 'cars', vehicleId));
      setVehicles(vehicles.filter(vehicle => vehicle.id !== vehicleId));  // Remove the deleted vehicle from the state
    } catch (error) {
      console.error('Error deleting vehicle:', error);
    }
  };

  return (
    <div className="container mt-4">
      <center><h2>รถยนต์</h2></center>
      <Button variant="success" onClick={handleAdd} className="me-2">
        เพิ่มข้อมูลรถ
      </Button>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Brand</th>
            <th>License Plate</th>
            <th>Model</th>
            <th>Price Per Day</th>
            <th>Status</th>
            <th>แก้ไขข้อมูล</th>
            <th>ลบข้อมูล</th>
          </tr>
        </thead>
        <tbody>
          {vehicles.map((vehicle) => (
            <tr key={vehicle.id}>
              <td>{vehicle.brand}</td>
              <td>{vehicle.license_plate}</td>
              <td>{vehicle.model}</td>
              <td>{vehicle.price_per_day}</td>
              <td>{vehicle.status}</td>
              <td>
                <Button variant="warning" onClick={() => handleEdit(vehicle.id)} className="me-2">
                  Edit
                </Button>
              </td>
              <td>
                <Button variant="danger" onClick={() => handleDelete(vehicle.id)}>
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

export default VehicleTable;
