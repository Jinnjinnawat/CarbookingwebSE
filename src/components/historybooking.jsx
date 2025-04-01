import React, { useEffect, useState } from 'react';
import { Table, Button, Form } from 'react-bootstrap';
import { collection, getDocs, deleteDoc, doc, query, where } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { useNavigate } from 'react-router-dom';

const HistorybookingTable = () => {
  const [rentals, setRentals] = useState([]);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  const fetchRentals = async () => {
    try {
      const customerSnapshot = await getDocs(collection(db, 'customers'));
      const rentalList = [];

      for (const customerDoc of customerSnapshot.docs) {
        const customerEmail = customerDoc.data().email;
        const bookingsQuery = query(collection(db, 'bookings'), where('email', '==', customerEmail));
        const bookingsSnapshot = await getDocs(bookingsQuery);

        for (const bookingDoc of bookingsSnapshot.docs) {
          const bookingData = bookingDoc.data();
          const rentalId = bookingDoc.id;

          // Fetch payment data for each booking
          const paymentQuery = query(collection(db, 'paymentData'), where('rentalId', '==', rentalId));
          const paymentSnapshot = await getDocs(paymentQuery);
          let paymentStatus = null;

          paymentSnapshot.forEach((doc) => {
            paymentStatus = doc.data().paymentStatus; // Assuming the field is 'paymentStatus'
          });

          rentalList.push({ id: rentalId, ...bookingData, paymentStatus });
        }
      }

      setRentals(rentalList);
      console.log('Fetched rentals:', rentalList);
    } catch (error) {
      console.error('Error fetching rentals:', error);
    }
  };

  useEffect(() => {
    fetchRentals();
  }, []);

  const handleDelete = async (rentalId) => {
    try {
      await deleteDoc(doc(db, 'bookings', rentalId));
      setRentals(rentals.filter(rental => rental.id !== rentalId));
    } catch (error) {
      console.error('Error deleting rental:', error);
    }
  };

  const handlePayment = (rentalId) => {
    navigate(`/PaymentForm/${rentalId}`);
  };

  const filteredRentals = rentals.filter(rental =>
    rental.carModel.toLowerCase().includes(search.toLowerCase()) ||
    rental.licensePlate.toLowerCase().includes(search.toLowerCase()) ||
    rental.name.toLowerCase().includes(search.toLowerCase()) ||
    rental.surname.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="container mt-4">
      <center><h2>ข้อมูลการเช่ารถ</h2></center>
      <div className="d-flex justify-content-between mb-3">
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
            <th>การกระทำ</th>
          </tr>
        </thead>
        <tbody>
          {filteredRentals.length > 0 ? (
            filteredRentals.map((rental) => (
              <tr key={rental.id}>
                <td>{rental.carModel}</td>
                <td>{rental.licensePlate}</td>
                <td>{rental.name}</td>
                <td>{rental.surname}</td>
                <td>{rental.startDate}</td>
                <td>{rental.startTime}</td>
                <td>{rental.endDate}</td>
                <td>{rental.endTime}</td>
                <td>{rental.status}</td>
                <td>{rental.totalCost}</td>
                <td>
                  {rental.paymentStatus === 'Paid' ? (
                    <>
                      <span>ชำระเงินแล้ว</span>
                      <Button 
                        variant="info" 
                        onClick={() => navigate('/MapPage')} 
                        className="ms-2"
                      >
                        ดูแผนที่
                      </Button>
                    </>
                  ) : rental.paymentStatus === 'NotPaid' ? (
                    <>
                      <span>ยังไม่ได้ชำระเงิน</span>
                      <Button 
                        variant="success" 
                        onClick={() => handlePayment(rental.id)}
                        className="mb-2"
                      >
                        ชำระเงิน
                      </Button>
                    </>
                  ) : rental.status === 'approve' ? (
                    <Button 
                      variant="success" 
                      onClick={() => handlePayment(rental.id)}
                      className="mb-2"
                    >
                      ชำระเงิน
                    </Button>
                  ) : (
                    <Button variant="danger" onClick={() => handleDelete(rental.id)}>ยกเลิก</Button>
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="11" className="text-center">ไม่พบข้อมูลการเช่า</td>
            </tr>
          )}
        </tbody>
      </Table>
    </div>
  );
};

export default HistorybookingTable;