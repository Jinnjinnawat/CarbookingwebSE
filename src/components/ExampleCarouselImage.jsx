import React from "react";
import { Image } from "react-bootstrap";
import './ExampleCarouselImage.css'; // เพิ่มไฟล์ CSS ถ้าต้องการ

function ExampleCarouselImage({ text, imageUrl }) {
  return (
    <div className="carousel-image-container">
      <Image
        src={imageUrl}
        alt={text}
        fluid
        className="full-screen-image"
      />
      
    </div>
  );
}

export default ExampleCarouselImage;