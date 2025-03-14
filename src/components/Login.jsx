import React, { useState, useEffect } from 'react';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebaseConfig';

const Login = ({ setUser }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (storedUser) {
      navigate('/home');
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const customerQuery = query(collection(db, 'customers'), where('email', '==', email));
      const adminQuery = query(collection(db, 'admin'), where('email', '==', email));

      const [customerSnapshot, adminSnapshot] = await Promise.all([
        getDocs(customerQuery),
        getDocs(adminQuery)
      ]);

      let userData = null;
      let isAdmin = false;

      if (!customerSnapshot.empty) {
        userData = customerSnapshot.docs[0].data();
      }

      if (!adminSnapshot.empty) {
        isAdmin = true;
      }

      if (!userData && !isAdmin) {
        setError('ไม่พบข้อมูลผู้ใช้');
        return;
      }

      if (userData && userData.password === password) {
        const loggedInUser = { first_name: userData.first_name };
        localStorage.setItem('user', JSON.stringify(loggedInUser));
        setUser(loggedInUser); // อัปเดต Navbar ทันที
        navigate('/home');
        return;
      }

      if (isAdmin) {
        const loggedInUser = { first_name: 'Admin' };
        localStorage.setItem('user', JSON.stringify(loggedInUser));
        setUser(loggedInUser); // อัปเดต Navbar ทันที
        navigate('/admin');
        return;
      }

      setError('รหัสผ่านไม่ถูกต้อง');
      
    } catch (error) {
      setError('เกิดข้อผิดพลาดในการเข้าสู่ระบบ');
      console.error('Login Error:', error);
    }
  };

  return (
    <Container>
      <Row className="justify-content-md-center">
        <Col xs={12} md={6}>
          <h2 className="text-center my-4">เข้าสู่ระบบ</h2>
          {error && <div className="alert alert-danger">{error}</div>}
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formEmail">
              <Form.Label>อีเมล</Form.Label>
              <Form.Control
                type="email"
                placeholder="กรุณากรอกอีเมล"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group controlId="formPassword">
              <Form.Label>รหัสผ่าน</Form.Label>
              <Form.Control
                type="password"
                placeholder="กรุณากรอกรหัสผ่าน"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </Form.Group>

            <Button variant="primary" type="submit" className="w-100 mt-3">
              เข้าสู่ระบบ
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default Login;
