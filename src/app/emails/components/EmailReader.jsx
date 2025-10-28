"use client";

import { X } from "lucide-react";

export default function EmailReader({ email, onClose }) {
  if (!email) return null;

  return (
    <div className="fixed top-0 right-0 w-1/2 h-full bg-white shadow-2xl z-50 p-6 overflow-y-auto transition-transform duration-300 ease-in-out">
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
      >
        <X size={20} />
      </button>
      <h2 className="text-2xl font-semibold mb-2">{email.subject}</h2>
      <p className="text-sm text-gray-500 mb-4">From: {email.from}</p>
      <div className="text-gray-800 whitespace-pre-wrap">
        {email.snippet || "No preview available."}
      </div>
    </div>
  );
}
