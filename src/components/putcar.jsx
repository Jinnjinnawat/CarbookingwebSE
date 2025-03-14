import React, { useState } from 'react';
import { getStorage, ref, uploadBytes } from 'firebase/storage';

function CsvUpload() {
  const [data, setData] = useState(null);

  // ฟังก์ชันสำหรับอ่านไฟล์ CSV
  const handleFileLoad = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();

      // อ่านไฟล์เมื่อไฟล์ถูกเลือก
      reader.onload = () => {
        const fileContent = reader.result;
        const rows = fileContent.split('\n'); // แยกแต่ละแถวของ CSV
        const parsedData = rows.map(row => row.split(',')); // แยกแต่ละคอลัมน์
        setData(parsedData);
        console.log('ข้อมูลจากไฟล์ CSV:', parsedData);
      };

      // อ่านไฟล์เป็นข้อความ
      reader.readAsText(file);
    }
  };

  // ฟังก์ชันสำหรับอัปโหลดไฟล์ไปยัง Firebase Storage
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const storage = getStorage(); // เรียกใช้ Firebase Storage
      const storageRef = ref(storage, 'csv_files/' + file.name); // สร้าง reference สำหรับไฟล์

      // อัปโหลดไฟล์ไปยัง Firebase Storage
      uploadBytes(storageRef, file).then((snapshot) => {
        console.log('อัปโหลดไฟล์สำเร็จ:', snapshot);
      }).catch((error) => {
        console.error('เกิดข้อผิดพลาดในการอัปโหลดไฟล์:', error);
      });
    }
  };

  return (
    <div>
      <h2>อัปโหลดไฟล์ CSV</h2>

      {/* อัปโหลดไฟล์ CSV */}
      <input
        type="file"
        accept=".csv"
        onChange={handleFileLoad}  // เมื่อไฟล์ถูกเลือกจะอ่านข้อมูล
      />

      {/* แสดงข้อมูลที่อ่านจากไฟล์ CSV */}
      <div>
        <h3>ข้อมูลจากไฟล์ CSV:</h3>
        <pre>{JSON.stringify(data, null, 2)}</pre>
      </div>

      {/* อัปโหลดไฟล์ไปยัง Firebase Storage */}
      <h3>อัปโหลดไฟล์ไปยัง Firebase Storage</h3>
      <input
        type="file"
        onChange={handleFileUpload}  // เรียกฟังก์ชันอัปโหลดไฟล์
      />
    </div>
  );
}

export default CsvUpload;
