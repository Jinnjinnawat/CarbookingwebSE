import React, { useState } from 'react';
import { Offcanvas, Nav } from 'react-bootstrap';
import { FiMenu } from 'react-icons/fi'; // Import FiMenu
import { NavLink, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const Sidebar = () => {
  const [show, setShow] = useState(false); // Sidebar starts as closed
  const navigate = useNavigate();

  const toggleSidebar = () => setShow(!show);

  const handleAddCarClick = () => {
    setShow(false);
    navigate('/incar');
  };

  return (
    <>
      {/* ปุ่มไอคอนเมนู (FiMenu) */}
      <FiMenu
        onClick={toggleSidebar}
        style={{
          position: 'fixed',
          top: '10px',
          left: '10px',
          fontSize: '1.8rem',
          cursor: 'pointer',
          zIndex: 1040,
        }}
      />

      <Offcanvas show={show} onHide={toggleSidebar} backdrop={false} scroll={true} className="sidebar" style={{ width: '250px' }}>
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Menu</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <Nav className="flex-column">
          <Nav.Link as={NavLink} to="/admin" onClick={toggleSidebar}>
            หน้าหลัก
            </Nav.Link>
            <Nav.Link as={NavLink} to="/Tablecar" onClick={toggleSidebar}>
              ข้อมูลรถยนต์
            </Nav.Link>
            <Nav.Link as={NavLink} to="/TableAdmin" onClick={toggleSidebar}>
              ข้อมูลแอดมิน
            </Nav.Link>
            <Nav.Link as={NavLink} to="/TableRental" onClick={toggleSidebar}>
              ข้อมูลเช่ารถยนต์
            </Nav.Link>
            <Nav.Link onClick={toggleSidebar}>
              Logout
            </Nav.Link>
          </Nav>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
};

export default Sidebar;
