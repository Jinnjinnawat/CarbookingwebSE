
import React from "react";
import { Container, Row, Col } from "react-bootstrap";

const Footer = () => {
  return (
    <footer className="bg-dark text-light py-4 ">
      <Container>
        <Row>
          <Col md={4}>
            <h5>เกี่ยวกับเรา</h5>
            <p>เว็บไซต์นี้ให้ข้อมูลเกี่ยวกับ...</p>
          </Col>
          <Col md={4}>
            <h5>ลิงก์ที่เป็นประโยชน์</h5>
            <ul className="list-unstyled">
              <li><a href="#" className="text-light">หน้าหลัก</a></li>
              <li><a href="#" className="text-light">บริการของเรา</a></li>
              <li><a href="#" className="text-light">ติดต่อเรา</a></li>
            </ul>
          </Col>
          <Col md={4}>
            <h5>ติดต่อเรา</h5>
            <p>Email: example@email.com</p>
            <p>โทร: 012-345-6789</p>
          </Col>
        </Row>
        <Row className="mt-3">
          <Col className="text-center">
            <p className="mb-0">&copy; {new Date().getFullYear()} MyWebsite. All Rights Reserved.</p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;