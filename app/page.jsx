"use client";
import React, { useState, useEffect } from "react";
import QrScanner from "qr-scanner";

let scannedTickets = {};

export default function Page() {
  const [result, setResult] = useState(null);
  const [status, setStatus] = useState("");
  const [scanner, setScanner] = useState(null);
  const videoRef = React.useRef(null);

  useEffect(() => {
    if (videoRef.current && !scanner) {
      const qrScanner = new QrScanner(
        videoRef.current,
        (result) => handleScan(result.data),
        {
          highlightScanRegion: true,
          returnDetailedScanResult: true,
        }
      );
      qrScanner.start();
      setScanner(qrScanner);
    }
    return () => scanner && scanner.destroy();
  }, [videoRef.current]);

  const handleScan = (data) => {
    try {
      const ticket = JSON.parse(data);
      const ticketId = ticket.ticket_id;
      if (!scannedTickets[ticketId]) {
        scannedTickets[ticketId] = true;
        setResult(ticket);
        setStatus("✅ Ticket Valid. Entry Allowed.");
      } else {
        setResult(ticket);
        setStatus("❌ Ticket Already Used.");
      }
    } catch (e) {
      setResult(null);
      setStatus("⚠️ Invalid QR Code");
    }
  };

  return (
    <div className="p-4 grid gap-4">
      <h1 className="text-2xl font-bold text-center">Vishu Sadhya QR Scanner</h1>
      <video ref={videoRef} className="w-full rounded-lg shadow" />

      <div className="p-4 bg-white rounded-xl shadow">
        <h2 className="text-lg font-semibold mb-2">Scan Result:</h2>
        {result ? (
          <div>
            <p><strong>Name:</strong> {result.name}</p>
            <p><strong>Apartment:</strong> {result.apartment}</p>
            <p><strong>Phone:</strong> {result.phone}</p>
            <p><strong>Ticket ID:</strong> {result.ticket_id}</p>
            <p className="mt-2 font-bold">{status}</p>
          </div>
        ) : (
          <p>No ticket scanned yet.</p>
        )}
      </div>
    </div>
  );
}