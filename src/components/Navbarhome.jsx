import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import { NavLink } from "react-router-dom";

function ColorSchemesExample({ user, setUser }) {
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setUser(storedUser);
    }
  }, [setUser]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    navigate("/Login");
  };

  return (
    <Navbar bg="dark" data-bs-theme="dark">
      <Container>
        <Navbar.Brand as={NavLink} to="/">CarBooking</Navbar.Brand>
        <Nav className="me-auto">
          <Nav.Link as={NavLink} to="/home">Home</Nav.Link>
          {!user && <Nav.Link as={NavLink} to="/Reg">Register</Nav.Link>} {/* แสดงเฉพาะยังไม่ได้ล็อกอิน */}
          {user && (
            <>
              <Nav.Link as={NavLink} to="/history">ประวัติการเช่ารถ</Nav.Link>
              <Nav.Link as={NavLink} to="/rent">เช่ารถ</Nav.Link>
            </>
          )}
        </Nav>
        
        <Nav className="ms-auto">
          {user ? (
            <NavDropdown title={user.first_name} id="user-dropdown">
              <NavDropdown.Item as={NavLink} to="/profile">Profile</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item onClick={handleLogout}>Logout</NavDropdown.Item>
            </NavDropdown>
          ) : (
            <Nav.Link as={NavLink} to="/Login">Login</Nav.Link>
          )}
        </Nav>
      </Container>
    </Navbar>
  );
}

export default ColorSchemesExample;
