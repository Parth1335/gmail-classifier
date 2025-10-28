"use client";

import { useState } from "react";
import useSession from "next-auth/react";
import { useRouter } from "next/navigation";

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [emails, setEmails] = useState([]);
  const [loading, setLoading] = useState(false);
  const [maxResults, setMaxResults] = useState(15);

if(status === "unauthenticated"){
  router.push("/");
}

const fetchEmails = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/emails?maxResults=${maxResults}`);
      const data = await res.json();

      if(res.ok) {
      setEmails(data.emails || []);
      } else {
        alert(data.error || "Failed to fetch emails");
      } 
    } catch (err){
            console.error(err);
            alert("An error occurred while fetching emails");
        } finally {
            setLoading(false);
        }
    };
return (
    <div classname ="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
        <h1 className="text-2xl font-semibold mb-4">Your Emails</h1>

        <div className="flex flex-col sm:flex-row items-center gap-4 mb-8">
        <label className="font-medium text-gray-700">Number of emails:</label>
        <select
          value={maxResults}
          onChange={(e) => setMaxResults(Number(e.target.value))}
          className="border border-gray-300 rounded-md px-3 py-2 bg-white"
        >
          <option value={5}>5</option>
          <option value={10}>10</option>
          <option value={20}>20</option>
        </select>

        <button
          onClick={fetchEmails}
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition disabled:opacity-50"
        >
          {loading ? "Fetching..." : "Fetch Emails"}
        </button>
      </div>
      
      <div className="w-full max-w-3xl bg-white shadow-lg rounded-lg p-6">
        {emails.length === 0 ? (
          <p className="text-gray-500 text-center">No emails fetched yet.</p>
        ) : (
          <div className="space-y-4 max-h-[500px] overflow-y-auto">
            {emails.map((email, index) => (
              <div
                key={index}
                className="border border-gray-200 rounded-md p-4 hover:bg-gray-50 transition"
              >
                <h2 className="font-semibold text-gray-800">
                  {email.subject || "(No Subject)"}
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  From: {email.from || "Unknown Sender"}
                </p>
                <p className="text-gray-700 mt-2 line-clamp-2">
                  {email.snippet || "No content available."}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}