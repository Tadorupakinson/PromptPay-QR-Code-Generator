// app/qr/page.tsx
"use client";

import { Suspense } from "react";
import QRContent from "./QRContent";

export default function QRPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <QRContent />
    </Suspense>
  );
}