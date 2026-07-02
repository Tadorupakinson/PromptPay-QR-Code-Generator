"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import generatePayload from "promptpay-qr";
import QRCode from "qrcode";

export default function QRPage() {
  const params = useParams();
  const router = useRouter();
  const [qr, setQr] = useState("");
  const [data, setData] = useState<any>(null);
  const id = Array.isArray(params?.id)
    ? params.id[0]
    : params?.id;



  useEffect(() => {
    if (!id) return;

    // กัน SSR crash
    if (typeof window === "undefined") return;

    const raw = localStorage.getItem(id);

    if (!raw) {
      router.push("/");
      return;
    }

    const parsed = JSON.parse(raw);
    setData(parsed);

    const createQR = async () => {
      const payload = generatePayload(parsed.phone, {
        amount: parsed.amount
          ? Number(parsed.amount)
          : undefined,
      });

      const img = await QRCode.toDataURL(payload);
      setQr(img);
    };

    createQR();
  }, [id]);

  const shareLink = () => {
    navigator.clipboard.writeText(window.location.href);
    alert("คัดลอกลิงก์แล้ว");
  };

  const download = () => {
    const a = document.createElement("a");
    a.href = qr;
    a.download = "qr.png";
    a.click();
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded-xl shadow text-center w-full max-w-md">

        <img
          src="/pic/promptpayimg.png"
          className="w-auto h-auto mx-auto"
          alt="promptpay"
        />

        {qr && (
          <img src={qr} className="mx-auto w-64 h-64" />
        )}

        {data && (
          <div className="text-center text-black">
            <p>
              {data.amount
                ? Number(data.amount).toFixed(2)
                : "ไม่กำหนด"}
            </p>
            <p>{data.phone}</p>
          </div>
        )}

        <button
          onClick={download}
          className="mt-4 w-full bg-green-600 text-white p-2 rounded"
        >
          ดาวน์โหลด QR
        </button>

        <button
          onClick={shareLink}
          className="mt-2 w-full bg-blue-500 text-white p-2 rounded"
        >
          แชร์ลิงก์
        </button>

        <button
          onClick={() => router.back()}
          className="mt-2 w-full bg-gray-500 text-white p-2 rounded"
        >
          ย้อนกลับ
        </button>
      </div>
    </main>
  );
}