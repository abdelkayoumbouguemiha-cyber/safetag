"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { activateBracelet } from "@/actions/bracelets";
import QrScanner from "qr-scanner";

function extractCodeFromScan(raw: string): string {
  // The QR encodes a full URL like https://.../scan/<uuid> — extract the
  // UUID if that's what was scanned, otherwise assume the raw text is
  // already just the code.
  const match = raw.match(/scan\/([a-f0-9-]{36})/i);
  return match ? match[1] : raw.trim();
}

export default function AddBraceletPage() {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [scanning, setScanning] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const scannerRef = useRef<QrScanner | null>(null);

  useEffect(() => {
    return () => {
      scannerRef.current?.stop();
      scannerRef.current?.destroy();
    };
  }, []);

  async function startScanning() {
    setError(null);
    setScanning(true);

    // Wait a tick so the <video> element is mounted before we attach the scanner.
    setTimeout(async () => {
      if (!videoRef.current) return;

      try {
        const scanner = new QrScanner(
          videoRef.current,
          (result) => {
            setCode(extractCodeFromScan(result.data));
            stopScanning();
          },
          {
            highlightScanRegion: true,
            highlightCodeOutline: true,
            preferredCamera: "environment",
          }
        );
        scannerRef.current = scanner;
        await scanner.start();
      } catch {
        setError("Could not access camera. You can still enter the code manually below.");
        setScanning(false);
      }
    }, 0);
  }

  function stopScanning() {
    scannerRef.current?.stop();
    scannerRef.current?.destroy();
    scannerRef.current = null;
    setScanning(false);
  }

  async function handleSubmit() {
    setLoading(true);
    setError(null);

    const result = await activateBracelet(code, name);
    setLoading(false);

    if (result.success) {
      router.push("/dashboard");
    } else {
      setError(result.message ?? "Something went wrong.");
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 gap-4">
      <h1 className="text-2xl font-bold">Activate a Bracelet</h1>

      {scanning ? (
        <div className="flex flex-col items-center gap-3 w-full max-w-sm">
          <video
            ref={videoRef}
            className="w-full rounded-lg border"
          />
          <button
            onClick={stopScanning}
            className="text-sm text-gray-600 underline"
          >
            Cancel scanning
          </button>
        </div>
      ) : (
        <button
          onClick={startScanning}
          className="flex items-center gap-2 border border-blue-600 text-blue-600 px-6 py-3 rounded-lg font-medium"
        >
          📷 Scan QR Code
        </button>
      )}

      <p className="text-sm text-gray-400">— or enter manually —</p>

      <input
        type="text"
        placeholder="Activation code"
        value={code}
        onChange={(e) => setCode(e.target.value)}
        className="border rounded-lg px-4 py-2 w-72"
      />

      <input
        type="text"
        placeholder="Child's first name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="border rounded-lg px-4 py-2 w-72"
      />

      <button
        onClick={handleSubmit}
        disabled={loading || !code || !name}
        className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium disabled:opacity-50"
      >
        {loading ? "Activating..." : "Activate"}
      </button>

      {error && <p className="text-red-600 text-sm">{error}</p>}
    </main>
  );
}
