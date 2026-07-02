"use client";

import { useState } from "react";

import generatePayload from "promptpay-qr";
import QRCode from "qrcode";

export default function Home() {
  const [phone, setPhone] = useState("");
  const [amount, setAmount] = useState("");
  const [qrImage, setQrImage] = useState("");

  const generateQR = async () => {
    if (!phone.trim()) {
      alert("กรุณากรอกเบอร์โทรศัพท์หรือเลขบัตรประชาชน");
      return;
    }
    if (!/^\d+$/.test(phone)) {
      alert("กรุณากรอกเฉพาะตัวเลข");
      return;
    }

    try {
      const payload = generatePayload(phone, {
        amount: amount ? Number(amount) : undefined,
      });
      const image = await QRCode.toDataURL(payload);
      setQrImage(image);
    } catch (error) {
      alert("ข้อมูลไม่ถูกต้อง");
      console.error(error);
    }
  };

  return (
    <main className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-6 text-primary">
          PromptPay QR Generator
        </h1>

        <input
          type="text"
          placeholder="เบอร์โทรศัพท์ หรือ เลขบัตรประชาชน"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
          className="w-full border rounded-lg p-3 mb-4  text-secondary"
        />

        <input
          type="number"
          placeholder="จำนวนเงิน "
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full border rounded-lg p-3 mb-4 text-secondary"
        />

        <button
          onClick={generateQR}
          className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700"
        >
          สร้าง QR Code
        </button>

        {qrImage && (
          <div className="mt-6 flex justify-center">
            <img
              src={qrImage}
              alt="PromptPay QR"
              className="w-64 h-64"
            />
          </div>
        )}
      </div>
    </main>
  );
}