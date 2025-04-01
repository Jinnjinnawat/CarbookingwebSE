import React, { useEffect, useState } from "react";
import { Container, Form, Button, Spinner } from "react-bootstrap";
import { db } from '../firebaseConfig';
import { collection, query, where, getDocs, updateDoc, doc } from "firebase/firestore";
import { useNavigate } from 'react-router-dom';

const EditProfile = () => {
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCustomerData = async () => {
      try {
        const storedUser = JSON.parse(localStorage.getItem('user'));
        if (storedUser && storedUser.email) {
          const customerQuery = query(collection(db, "customers"), where("email", "==", storedUser.email));
          const customerSnapshot = await getDocs(customerQuery);

          if (!customerSnapshot.empty) {
            const customerData = customerSnapshot.docs[0].data();
            setCustomer(customerData);
            setFirstName(customerData.first_name);
            setLastName(customerData.last_name);
            setPhone(customerData.phone);
            setAddress(customerData.address);
          } else {
            console.log("No customer found with that email.");
          }
        } else {
          console.log("User data not found in localStorage.");
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching customer data:", error);
        setLoading(false);
      }
    };

    fetchCustomerData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const customerQuery = query(collection(db, "customers"), where("email", "==", customer.email));
      const customerSnapshot = await getDocs(customerQuery);

      if (!customerSnapshot.empty) {
        const customerDoc = customerSnapshot.docs[0].ref;
        await updateDoc(customerDoc, {
          first_name: firstName,
          last_name: lastName,
          phone: phone,
          address: address,
        });
        alert('แก้ไขข้อมูลสำเร็จ');
        navigate('/profile');
      } else {
        alert('ไม่พบข้อมูลผู้ใช้');
      }
    } catch (error) {
      console.error("Error updating customer data:", error);
      alert('เกิดข้อผิดพลาดในการแก้ไขข้อมูล');
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ height: "100vh" }}>
        <Spinner animation="border" />
      </Container>
    );
  }

  if (!customer) {
    return <p className="text-center">No customer data available.</p>;
  }

  return (
    <Container className="mt-5">
      <h2>แก้ไขข้อมูลผู้ใช้</h2>
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="firstName">
          <Form.Label>ชื่อ</Form.Label>
          <Form.Control type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
        </Form.Group>
        <Form.Group controlId="lastName">
          <Form.Label>นามสกุล</Form.Label>
          <Form.Control type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} />
        </Form.Group>
        <Form.Group controlId="phone">
          <Form.Label>เบอร์โทร</Form.Label>
          <Form.Control type="text" value={phone} onChange={(e) => setPhone(e.target.value)} />
        </Form.Group>
        <Form.Group controlId="address">
          <Form.Label>ที่อยู่</Form.Label>
          <Form.Control as="textarea" rows={3} value={address} onChange={(e) => setAddress(e.target.value)} />
        </Form.Group>
        <Button variant="primary" type="submit">บันทึกการแก้ไข</Button>
      </Form>
    </Container>
  );
};

export default EditProfile;