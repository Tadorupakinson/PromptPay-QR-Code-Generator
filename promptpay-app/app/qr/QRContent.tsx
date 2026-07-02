"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import generatePayload from "promptpay-qr";
import QRCode from "qrcode";

export default function QRContent() {
    const params = useSearchParams();
    const router = useRouter();

    const phone = params.get("phone") ?? "";
    const amount = params.get("amount") ?? "";

    const [qr, setQr] = useState("");

    useEffect(() => {
        if (!phone) {
            router.push("/");
            return;
        }

        const createQR = async () => {
            const payload = generatePayload(phone, {
                amount: amount ? Number(amount) : undefined,
            });

            const img = await QRCode.toDataURL(payload);
            setQr(img);
        };

        createQR();
    }, [phone, amount, router]);
    const shareLink = () => {
        navigator.clipboard.writeText(window.location.href);
        alert("คัดลอกลิงก์แล้ว");
    };
    const download = () => {
        const a = document.createElement("a"); a.href = qr;
        a.download = "qr.png"; a.click();
    };
    return (
        <main className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-6 rounded-xl shadow text-center w-full max-w-md">
                <img src="/pic/promptpayimg.png" className="w-auto h-auto mx-auto" alt="promptpay" />
                {qr && (<img src={qr} className="mx-auto w-64 h-64" />)}
                <div className="text-center text-black mt-2">
                    <p> {amount ? Number(amount).toFixed(2) : "ไม่กำหนด"} </p>
                    <p>{phone}</p> </div> <button onClick={download} className="mt-4 w-full bg-green-600 text-white p-2 rounded" > ดาวน์โหลด QR </button>
                <button onClick={shareLink} className="mt-2 w-full bg-blue-500 text-white p-2 rounded" > แชร์ลิงก์ </button>
                <button onClick={() => router.back()} className="mt-2 w-full bg-gray-500 text-white p-2 rounded" > ย้อนกลับ </button>
            </div>
        </main>
    );
}
