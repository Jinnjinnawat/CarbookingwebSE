import React from "react";
import { Image } from "react-bootstrap";
import './ExampleCarouselImage.css'; // เพิ่มไฟล์ CSS ถ้าต้องการ

function ExampleCarouselImage({ text }) {
  return (
    <div className="carousel-image-container">
      <Image
        src={`https://images.unsplash.com/photo-1593642532973-d31b6557fa68?crop=entropy&cs=tinysrgb&fit=max&ixid=MnwzNjY0OXwwfDF8c2VhY2h8NXx8Y2Fyb3VzZWx8ZW58MHx8fHwxNjc2NDA1NjY0&ixlib=rb-1.2.1&q=80&w=1080`}
        alt={text}
        fluid
        className="full-screen-image"
      />
    </div>
  );
}

export default ExampleCarouselImage;
