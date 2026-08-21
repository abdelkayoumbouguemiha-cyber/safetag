"use client";

export default function ScanError() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 text-center gap-4">
      <h1 className="text-xl font-semibold">
        We are having trouble loading this page.
      </h1>
      <p className="text-gray-600">
        If a child needs help right now, call the emergency hotline directly:
      </p>
      <a href="tel:1021" className="bg-red-600 text-white px-6 py-3 rounded-lg font-medium text-lg">
        Call 1021
      </a>
    </main>
  );
}
