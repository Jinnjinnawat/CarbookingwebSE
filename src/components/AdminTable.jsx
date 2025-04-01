import React, { useEffect, useState } from 'react';
import { Table, Button, Form } from 'react-bootstrap';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { useNavigate } from 'react-router-dom';

const AdminTable = () => {
  const [admins, setAdmins] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAdmins = async () => {
      const querySnapshot = await getDocs(collection(db, 'admin'));
      const adminList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setAdmins(adminList);
    };

    fetchAdmins();
  }, []);

  const handleDelete = async (adminId) => {
    try {
      await deleteDoc(doc(db, 'admin', adminId));
      setAdmins(admins.filter(admin => admin.id !== adminId));
    } catch (error) {
      console.error('Error deleting admin:', error);
    }
  };

  const handleAdd = () => {
    navigate('/addadmin');
  };

  const handleEdit = (adminId) => {
    navigate(`/editadmin/${adminId}`);
  };

  const filteredAdmins = admins.filter(admin =>
    admin.admin_user.toLowerCase().includes(searchTerm.toLowerCase()) ||
    admin.admin_frname.toLowerCase().includes(searchTerm.toLowerCase()) ||
    admin.admin_lastname.toLowerCase().includes(searchTerm.toLowerCase()) ||
    admin.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mt-4">
      <center><h2>ข้อมูลผู้ดูแลระบบ</h2></center>
      <Form className="mb-3">
        <Form.Control 
          type="text" 
          placeholder="ค้นหาแอดมิน..." 
          value={searchTerm} 
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </Form>
      <Button variant="success" onClick={handleAdd} className="mb-3">
        เพิ่มข้อมูลแอดมิน
      </Button>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Username</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Email</th>
            <th>Address</th>
            <th>Password</th>
            <th>Phone</th>
            <th>แก้ไขข้อมูล</th>
            <th>ลบข้อมูล</th>
          </tr>
        </thead>
        <tbody>
          {filteredAdmins.map((admin) => (
            <tr key={admin.id}>
              <td>{admin.admin_user}</td>
              <td>{admin.admin_frname}</td>
              <td>{admin.admin_lastname}</td>
              <td>{admin.email}</td>
              <td>{admin.admin_address}</td>
              <td>{admin.password}</td>
              <td>{admin.phone}</td>
              <td>
                <Button variant="warning" onClick={() => handleEdit(admin.id)}>
                  Edit
                </Button>
              </td>
              <td>
                <Button variant="danger" onClick={() => handleDelete(admin.id)}>
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

export default AdminTable;
