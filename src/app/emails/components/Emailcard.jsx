"use client";

export default function EmailCard({ email }) {
  const categoryColors = {
    Important: "text-green-500",
    Work: "text-green-500",
    Updates: "text-blue-500",
    Marketing: "text-orange-500",
    Promotions: "text-orange-500",
    Spam: "text-Yellow-500",
    Others: "text-gray-400",
  };

  return (
    <div className="border-2 border-black p-4 rounded-md flex justify-between">
      <div>
        <p className="font-semibold">{email.from || "Unknown Sender"}</p>
        <p className="text-sm mt-1">{email.snippet || "No preview available."}</p>
      </div>
      {email.category && (
        <span
          className={`font-semibold self-start ${categoryColors[email.category]}`}
        >
          {email.category}
        </span>
      )}
    </div>
  );
}