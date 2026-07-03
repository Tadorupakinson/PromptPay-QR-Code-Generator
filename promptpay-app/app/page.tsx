"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  const [User, setUser] = useState("");
  const [amount, setAmount] = useState("");
  const [UserError, setUserError] = useState("");
  const [amountError, setAmountError] = useState("");
  const generateQR = async () => {

    //ตรวจสอบว่าเบอร์โทรศัพท์และบัตรประชาชนถูกต้องไหม
    const Uservalue = User.trim();
    const UserisValid =
      Uservalue &&
      /^\d+$/.test(Uservalue) &&
      (Uservalue.length === 10 || Uservalue.length === 13);

    const isPhone = /^0[689]\d{8}$/.test(User);
    const isIdCard = isValidThaiID(User);
    if (!((isPhone || isIdCard ) && UserisValid)) {
      setUserError("กรุณากรอกเบอร์โทรหรือเลขบัตรประชาชนให้ถูกต้อง");
      return;
    }

    //ตรวจสอบจำนวนเงินว่าไม่มีติดลบหรือเท่ากับ 0
    const amountvalue = amount.trim();
    const AmountisValid =
      (/^\d+(\.\d{1,2})?$/.test(amountvalue) &&
        Number(amountvalue) > 0 &&
        Number(amountvalue) <= 200000);

    if (!AmountisValid) {
      setAmountError("กรุณากรอกจำนวนเงินมากกว่า 0 และน้อยกว่าหรือเท่ากับ 200,000 บาท");
      return;
    }

    const id = Date.now().toString(); // หรือ ORDER-001

    localStorage.setItem(
      id,
      JSON.stringify({ User, amount })
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
          inputMode="numeric"
          pattern="[0-9]*"
          placeholder="เบอร์โทรศัพท์ หรือ เลขบัตรประชาชน"
          value={User}
          onChange={(e) => {
            setUser(e.target.value)
            setUserError(""); // ล้าง Error เมื่อผู้ใช้แก้ไข 
          }}
          required
          className="w-full border rounded-lg p-3   text-secondary"
        />
        {UserError && (
          <p className="mt-1 text-sm text-red-400 mb-4"> {UserError} </p>
        )}

        <input
          type="text"
          inputMode="decimal"
          placeholder="จำนวนเงิน "
          value={amount}
          onChange={(e) => {
            setAmount(e.target.value)
            setAmountError(""); // ล้าง Error เมื่อผู้ใช้แก้ไข
          }}
          className={`w-full border rounded-lg p-3 mt-4 text-secondary ${amountError ? "border-red-500" : ""}`}
        />
        {amountError && (
          <p className="mt-1 text-sm text-red-400"> {amountError} </p>
        )}

        <button onClick={generateQR} className="w-full bg-blue-600 text-white p-2 rounded mt-4" > สร้าง QR Code </button>
      </div>
    </main>
  );
}

function isValidThaiID(User: string) {
  if (!/^\d{13}$/.test(User)) return false;
  if (User[0] === "0") return false;
  let sum = 0;

  for (let i = 0; i < 12; i++) {
    sum += Number(User[i]) * (13 - i);
  }

  const checkDigit = (11 - (sum % 11)) % 10;

  return checkDigit === Number(User[12]);
}