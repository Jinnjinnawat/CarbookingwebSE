import React, { useEffect, useState } from 'react';
import { Table, Form } from 'react-bootstrap';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../firebaseConfig';

const RevenueTable = () => {
  const [revenueData, setRevenueData] = useState([]);
  const [search, setSearch] = useState('');

  const fetchRevenueData = async () => {
    try {
      const customerSnapshot = await getDocs(collection(db, 'customers'));
      const revenueList = [];

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

          paymentSnapshot.forEach((doc) => {
            const paymentData = doc.data();
            // Convert Timestamp to Date
            const paymentDate = paymentData.paymentDate ? paymentData.paymentDate.toDate().toLocaleDateString() : 'N/A'; // added null check

            revenueList.push({
              rentalId: rentalId,
              carModel: bookingData.carModel,
              licensePlate: bookingData.licensePlate,
              name: bookingData.name,
              surname: bookingData.surname,
              startDate: bookingData.startDate,
              endDate: bookingData.endDate,
              paymentDate: paymentDate, // Use formatted date
              paymentAmount: paymentData.paymentAmount,
              paymentStatus: paymentData.paymentStatus,
            });
          });
        }
      }

      setRevenueData(revenueList);
      console.log('Fetched revenue data:', revenueList);
    } catch (error) {
      console.error('Error fetching revenue data:', error);
    }
  };

  useEffect(() => {
    fetchRevenueData();
  }, []);

  const filteredRevenueData = revenueData.filter((item) =>
    item.carModel.toLowerCase().includes(search.toLowerCase()) ||
    item.licensePlate.toLowerCase().includes(search.toLowerCase()) ||
    item.name.toLowerCase().includes(search.toLowerCase()) ||
    item.surname.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="container mt-4">
      <center><h2>รายงานรายรับ</h2></center>
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
            <th>วันสุดท้ายการจอง</th>
            <th>วันที่ชำระเงิน</th>
            <th>จำนวนเงิน</th>
            <th>สถานะการชำระเงิน</th>
          </tr>
        </thead>
        <tbody>
          {filteredRevenueData.length > 0 ? (
            filteredRevenueData.map((item) => (
              <tr key={item.rentalId}>
                <td>{item.carModel}</td>
                <td>{item.licensePlate}</td>
                <td>{item.name}</td>
                <td>{item.surname}</td>
                <td>{item.startDate}</td>
                <td>{item.endDate}</td>
                <td>{item.paymentDate}</td>
                <td>{item.paymentAmount}</td>
                <td>{item.paymentStatus}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="9" className="text-center">ไม่พบข้อมูลรายรับ</td>
            </tr>
          )}
        </tbody>
      </Table>
    </div>
  );
};

export default RevenueTable;