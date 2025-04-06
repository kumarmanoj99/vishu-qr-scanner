"use client";
import React, { useEffect, useRef, useState } from "react";
import QrScanner from "qr-scanner";

let scannedTickets = {};

export default function Page() {
  const [result, setResult] = useState(null);
  const [status, setStatus] = useState("");
  const videoRef = useRef(null);
  const scannerRef = useRef(null);

  useEffect(() => {
    if (videoRef.current) {
      scannerRef.current = new QrScanner(
        videoRef.current,
        (scanResult) => {
          handleScan(scanResult.data);
        },
        {
          highlightScanRegion: true,
          returnDetailedScanResult: true,
        }
      );

      scannerRef.current.start().catch((err) => {
        console.error("Camera error:", err);
        setStatus("⚠️ Cannot access camera. Please allow permission.");
      });

      return () => scannerRef.current?.stop();
    }
  }, []);

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
          <p>{status || "No ticket scanned yet."}</p>
        )}
      </div>
    </div>
  );
}
