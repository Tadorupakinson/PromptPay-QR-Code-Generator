"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  const [phone, setPhone] = useState("");
  const [amount, setAmount] = useState("");

  const generateQR = async () => {
    const value = phone.trim();

    const isValid =
      value &&
      /^\d+$/.test(value) &&
      (value.length === 10 || value.length === 13);

    if (!isValid) {
      alert("กรุณากรอกเบอร์โทร 10 หลัก หรือเลขบัตรประชาชน 13 หลัก");
      return;
    }
    const isPhone = /^0\d{9}$/.test(phone);
    const isIdCard = /^\d{13}$/.test(phone);
    if (!(isPhone || isIdCard)) {
      alert("กรุณากรอกเบอร์โทรหรือเลขบัตรประชาชนให้ถูกต้อง");
      return;
    }

    const id = Date.now().toString(); // หรือ ORDER-001

    localStorage.setItem(
      id,
      JSON.stringify({ phone, amount })
    );

    router.push(`/qr/${id}`);
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
          className="w-full bg-blue-600 text-white p-2 rounded"
        >
          สร้าง QR Code
        </button>
      </div>
    </main>
  );
}