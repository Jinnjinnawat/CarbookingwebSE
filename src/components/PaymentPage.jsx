import React, { useState, useEffect } from 'react';
import { Button, Form, Container, Card, Col, Row } from 'react-bootstrap';
import { doc, getDoc, setDoc, Timestamp } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { useNavigate, useParams } from 'react-router-dom';
import { FaCreditCard, FaMoneyBillWave, FaRegBuilding } from 'react-icons/fa';

const PaymentForm = () => {
  const { rentalId } = useParams(); // ใช้สำหรับดึง rentalId จาก URL
  const [bookingData, setBookingData] = useState(null);
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const navigate = useNavigate();

  // Fetch booking data from Firestore
  const fetchBookingData = async () => {
    try {
      const rentalRef = doc(db, 'bookings', rentalId);
      const rentalSnap = await getDoc(rentalRef);

      if (rentalSnap.exists()) {
        setBookingData(rentalSnap.data());
      } else {
        console.log('No such booking!');
      }
    } catch (error) {
      console.error('Error fetching booking data:', error);
    }
  };

  useEffect(() => {
    fetchBookingData();
  }, [rentalId]);

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();

    try {
      // สร้างเอกสารใหม่ในคอลเลกชัน `paymentData`
      const paymentRef = doc(db, 'paymentData', rentalId); // ใช้ rentalId เป็น ID ของเอกสาร
      const paymentData = {
        rentalId: rentalId,
        paymentAmount: paymentAmount,
        paymentMethod: paymentMethod,
        paymentStatus: 'Paid', // ตั้งสถานะการชำระเงินเป็น 'Paid'
        paymentDate: Timestamp.fromDate(new Date()), // บันทึกเวลาที่ทำการชำระเงิน
        carModel: bookingData.carModel,
        licensePlate: bookingData.licensePlate,
        customerName: `${bookingData.name} ${bookingData.surname}`,
        startDate: bookingData.startDate,
        endDate: bookingData.endDate,
        totalCost: bookingData.totalCost,
      };

      // ส่งข้อมูลการชำระเงินไปยัง Firestore
      await setDoc(paymentRef, paymentData);

      // แสดงข้อความเมื่อการชำระเงินสำเร็จ
      alert('การชำระเงินสำเร็จ');
      navigate('/MapPage'); // กลับไปที่หน้ารายการการเช่า
    } catch (error) {
      console.error('Error processing payment:', error);
      alert('เกิดข้อผิดพลาดในการบันทึกการชำระเงิน');
    }
  };

  return (
    <Container className="mt-4">
      <h2 className="text-center mb-4">ฟอร์มชำระเงิน</h2>
      {bookingData ? (
        <Card className="shadow-lg p-4">
          <Card.Body>
            <h4 className="text-primary mb-4">ข้อมูลการเช่า</h4>
            <ul>
              <li><strong>รุ่นรถ:</strong> {bookingData.carModel}</li>
              <li><strong>ทะเบียน:</strong> {bookingData.licensePlate}</li>
              <li><strong>ชื่อ:</strong> {bookingData.name} {bookingData.surname}</li>
              <li><strong>วันที่เริ่มจอง:</strong> {bookingData.startDate}</li>
              <li><strong>วันที่สุดท้ายการจอง:</strong> {bookingData.endDate}</li>
              <li><strong>สถานะการจอง:</strong> {bookingData.status}</li>
              <li><strong>Total Price:</strong> {bookingData.totalCost}</li>
            </ul>

            <Form onSubmit={handlePaymentSubmit}>
              <Row>
                <Col md={6}>
                  <Form.Group controlId="formPaymentAmount">
                    <Form.Label>จำนวนเงินที่ชำระ</Form.Label>
                    <Form.Control
                      type="number"
                      placeholder="กรอกจำนวนเงิน"
                      value={paymentAmount}
                      onChange={(e) => setPaymentAmount(e.target.value)}
                      required
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Form.Group controlId="formPaymentMethod" className="mt-4">
                <Form.Label>วิธีการชำระเงิน</Form.Label>
                <div className="d-flex justify-content-start">
                  <Button
                    variant="outline-primary"
                    className="me-2"
                    active={paymentMethod === 'Credit Card'}
                    onClick={() => setPaymentMethod('Credit Card')}
                  >
                    <FaCreditCard /> Credit Card
                  </Button>
                  <Button
                    variant="outline-success"
                    className="me-2"
                    active={paymentMethod === 'Cash'}
                    onClick={() => setPaymentMethod('Cash')}
                  >
                    <FaMoneyBillWave /> Cash
                  </Button>
                  <Button
                    variant="outline-warning"
                    active={paymentMethod === 'Bank Transfer'}
                    onClick={() => setPaymentMethod('Bank Transfer')}
                  >
                    <FaRegBuilding /> Bank Transfer
                  </Button>
                </div>
              </Form.Group>

              <Button variant="primary" type="submit" className="mt-4 w-100">
                ชำระเงิน
              </Button>
            </Form>
          </Card.Body>
        </Card>
      ) : (
        <p>กำลังโหลดข้อมูลการเช่า...</p>
      )}
    </Container>
  );
};

export default PaymentForm;
