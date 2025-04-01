import React, { useEffect, useState } from 'react';
import { Table, Button, Form } from 'react-bootstrap';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { useNavigate } from 'react-router-dom';

const VehicleTable = () => {
  const [vehicles, setVehicles] = useState([]);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchVehicles = async () => {
      const querySnapshot = await getDocs(collection(db, 'cars'));
      const vehicleList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setVehicles(vehicleList);
    };
    fetchVehicles();
  }, []);

  const handleAdd = () => navigate('/addcar');
  const handleEdit = (vehicleId) => navigate(`/editcar/${vehicleId}`);

  const handleDelete = async (vehicleId) => {
    try {
      await deleteDoc(doc(db, 'cars', vehicleId));
      setVehicles(vehicles.filter(vehicle => vehicle.id !== vehicleId));
    } catch (error) {
      console.error('Error deleting vehicle:', error);
    }
  };

  const filteredVehicles = vehicles.filter(vehicle =>
    vehicle.brand.toLowerCase().includes(search.toLowerCase()) ||
    vehicle.license_plate.toLowerCase().includes(search.toLowerCase()) ||
    vehicle.model.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="container mt-4">
      <center><h2>รถยนต์</h2></center>
      <div className="d-flex justify-content-between mb-3">
        <Button variant="success" onClick={handleAdd}>เพิ่มข้อมูลรถ</Button>
        <Form.Control
          type="text"
          placeholder="ค้นหา..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ width: '250px' }}
        />
      </div>
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
          {filteredVehicles.map((vehicle) => (
            <tr key={vehicle.id}>
              <td>{vehicle.brand}</td>
              <td>{vehicle.license_plate}</td>
              <td>{vehicle.model}</td>
              <td>{vehicle.price_per_day}</td>
              <td>{vehicle.status}</td>
              <td>
                <Button variant="warning" onClick={() => handleEdit(vehicle.id)}>Edit</Button>
              </td>
              <td>
                <Button variant="danger" onClick={() => handleDelete(vehicle.id)}>Delete</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default VehicleTable;