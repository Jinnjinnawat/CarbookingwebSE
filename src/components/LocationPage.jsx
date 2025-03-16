import React, { useState } from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import QRCode from 'react-qr-code';

const MapPage = () => {
  const [location, setLocation] = useState({
    lat: 13.736717, // ตัวอย่าง latitude
    lng: 100.523186, // ตัวอย่าง longitude
  });

  const qrData = `https://www.openstreetmap.org/?mlat=${location.lat}&mlon=${location.lng}#map=14/${location.lat}/${location.lng}`;

  return (
    <Container fluid className="mt-4">
      <Row>
        <Col md={8} className="mb-4">
          <Card>
            <Card.Body style={{ overflow: 'hidden', padding: '0' }}>
              <div
                style={{
                  height: '500px',
                  width: '100%',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                <MapContainer
                  center={[location.lat, location.lng]}
                  zoom={14}
                  style={{
                    width: '100%',
                    height: '100%',
                    maxWidth: '100%',
                    overflow: 'hidden',
                    borderRadius: '10px',
                  }}
                >
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  />
                  <Marker position={[location.lat, location.lng]}>
                    <Popup>สถานที่รับรถ</Popup>
                  </Marker>
                </MapContainer>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4}>
          <Card>
            <Card.Body className="text-center">
              <h3>สถานที่รับรถ</h3>
              <QRCode value={qrData} size={200} />
              <p className="mt-3">Scan this QR code for directions</p>
              <Button variant="primary" href={qrData} target="_blank">
                Open in OpenStreetMap
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default MapPage;
