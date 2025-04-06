"use client";
import React, { useEffect, useRef, useState } from "react";
import QrScanner from "qr-scanner";
import { initializeApp } from "firebase/app";
import {
  getDatabase,
  ref,
  get,
  set,
  child,
  onValue
} from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyCGB3NFGkcx5NGIg3d8OpD4bYokiZJtrx8",
  authDomain: "vishudb-d47e9.firebaseapp.com",
  databaseURL: "https://vishudb-d47e9-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "vishudb-d47e9",
  storageBucket: "vishudb-d47e9.firebasestorage.app",
  messagingSenderId: "133578898579",
  appId: "1:133578898579:web:a2d7cb9ca227127d65a166"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const dbRef = ref(db, "tickets");

export default function Page() {
  const videoRef = useRef(null);
  const [scanner, setScanner] = useState(null);
  const [result, setResult] = useState(null);
  const [status, setStatus] = useState("");
  const [tickets, setTickets] = useState({});

  useEffect(() => {
    onValue(dbRef, (snapshot) => {
      const data = snapshot.val();
      if (data) setTickets(data);
    });
  }, []);

  useEffect(() => {
    if (videoRef.current && !scanner) {
      const qrScanner = new QrScanner(
        videoRef.current,
        (res) => handleScan(res.data),
        { highlightScanRegion: true, returnDetailedScanResult: true }
      );
      qrScanner.start();
      setScanner(qrScanner);
    }
    return () => scanner && scanner.destroy();
  }, [videoRef]);

  const handleScan = async (data) => {
    try {
      const parsed = JSON.parse(data);
      const ticketId = parsed.ticket_id;
      const ticketRef = child(ref(db), `tickets/${ticketId}`);
      const snapshot = await get(ticketRef);

      if (!snapshot.exists()) {
        setStatus("❌ Invalid Ticket");
        return;
      }

      const ticket = snapshot.val();
      setResult({ ...ticket, ticket_id: ticketId });

      if (ticket.used) {
        setStatus("❌ Ticket Already Used");
      } else {
        await set(ticketRef, { ...ticket, used: true });
        setStatus("✅ Ticket Valid. Entry Allowed");
      }
    } catch (err) {
      setStatus("⚠️ Could not read QR Code");
    }
  };

  return (
    <div className="p-4 grid gap-4">
      <h1 className="text-2xl font-bold text-center">Vishu QR Scanner</h1>
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