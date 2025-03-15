import React, { useEffect, useState } from 'react';
import { Table, Button } from 'react-bootstrap';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { useNavigate } from 'react-router-dom';

const AdminTable = () => {
  const [admins, setAdmins] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAdmins = async () => {
      const querySnapshot = await getDocs(collection(db, 'admin'));
      const adminList = [];
      querySnapshot.forEach((doc) => {
        console.log(doc.data());
        adminList.push({ id: doc.id, ...doc.data() });
      });
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
    navigate('/addadmin');  // Navigate to the Add Admin page
  };

  const handleEdit = (adminId) => {
    navigate(`/editadmin/${adminId}`);  // Navigate to the Edit Admin page with the admin ID
  };
  
  
  return (
    <div className="container mt-4">
      <center><h2>ข้อมูลผู้ดูแลระบบ</h2></center>
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
          {admins.map((admin) => (
            <tr key={admin.id}>
              <td>{admin.admin_user}</td>
              <td>{admin.admin_frname}</td>
              <td>{admin.admin_lastname}</td>
              <td>{admin.email}</td>
              <td>{admin.admin_address}</td>
              <td>{admin.password}</td>
              <td>{admin.phone}</td>
              <td>
                <Button 
                  variant="warning" 
                  onClick={() => handleEdit(admin.id)}
                >
                  Edit
                </Button>
              </td>
              <td>
                <Button 
                  variant="danger" 
                  onClick={() => handleDelete(admin.id)}
                >
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
