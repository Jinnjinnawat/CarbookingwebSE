import Carousel from 'react-bootstrap/Carousel';
import ExampleCarouselImage from "./ExampleCarouselImage";

function CarouselFadeExample() {
  return (
    <Carousel fade>
      <Carousel.Item>
        <ExampleCarouselImage
          text="Car Hire Keys"
          imageUrl="https://media.product.which.co.uk/prod/images/original/4c8614ffd15d-car-hire-keys.jpg"
        />
        <Carousel.Caption>
          <h3>เริ่มต้นการเดินทางของคุณด้วยรถเช่า</h3>
          <p>เลือกจากรถหลากหลายประเภทที่เหมาะกับทุกการเดินทางของคุณ</p>
        </Carousel.Caption>
      </Carousel.Item>
      <Carousel.Item>
        <ExampleCarouselImage
          text="Replacement Car Checklist"
          imageUrl="https://dl-mag-media.dlgdigitalservices.com/lib/img/Replacement-car-checklist.jpg"
        />
        <Carousel.Caption>
          <h3>ขั้นตอนการเช่ารถง่ายๆ</h3>
          <p>เอกสารครบ จองง่าย รับรถไว พร้อมออกเดินทางได้ทันที</p>
        </Carousel.Caption>
      </Carousel.Item>
      <Carousel.Item>
        <ExampleCarouselImage
          text="Car Hire"
          imageUrl="https://guardian.ng/wp-content/uploads/2019/03/Car-hire.jpg"
        />
        <Carousel.Caption>
          <h3>บริการเช่ารถที่ตอบโจทย์ทุกความต้องการ</h3>
          <p>ไม่ว่าจะเป็นรถขนาดเล็ก รถครอบครัว หรือรถหรู เรามีให้เลือกครบ</p>
        </Carousel.Caption>
      </Carousel.Item>
    </Carousel>
  );
}

export default CarouselFadeExample;